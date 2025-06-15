const { parse } = require('querystring');
const auth = require('../../../../middlewares/auth');
const moment = require('moment');
const jmoment = require('jalali-moment');
const json2xls = require('json2xls');
const crypt = require('../../../../helpers/crypt');

module.exports = ((app) => {
    const prefix = '/api/insurance/tamin';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            if (req.body.contract_id && req.body.year && req.body.month && req.body.list_number) {
                await pp.query('insert into insurance_tamin (contract_id_fk, year, month, list_number, description) values (?,?,?,?,?)', [
                    req.body.contract_id,
                    req.body.year,
                    req.body.month,
                    req.body.list_number,
                    req.body.description
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/detail/:id`, auth.authorized, async (req, res) => {
        try {
            const [detail] = await pp.query('select t1.contract_id_fk, t1.id, t1.description, t1.list_number, t1.year, t1.month, t2.workshop_code, t2.row,  sum(t3.total_share) as total_insured, count(t3.id) as personnel_count from insurance_tamin as t1 inner join contract as t2 on t1.contract_id_fk = t2.id left join insurance_tamin_personnel as t3 on  t1.id = t3.insurance_tamin_id_fk where t1.id=? and (t2.deleted <> 1 or t2.deleted is null)', [
                req.params.id
            ]);

            res.status(200).send(detail[0]);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.delete(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    var [list] = await pp.query('select id from insurance_tamin_personnel where insurance_tamin_id_fk=?', [arr[i]]);
                    if (list.length == 0) {
                        await pp.query('delete from insurance_tamin where id=?', [arr[i]]);
                    }
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.contract_id && req.body.year && req.body.month && req.body.list_number) {
                await pp.query('update insurance_tamin set contract_id_fk=?, year=?, month=?, list_number=?, description=?, status=? where id=?', [
                    req.body.contract_id,
                    req.body.year,
                    req.body.month,
                    req.body.list_number,
                    req.body.description,
                    req.body.status,
                    req.params.id
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })


    app.get(`${prefix}/check/:id`, auth.authorized, async (req, res) => {
        try {
            var [persons] = await pp.query('select t1.*, t2.contract_end_date from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id where t1.insurance_tamin_id_fk=?', [req.params.id]);
            var [tamin] = await pp.query('select * from insurance_tamin where id=?', [req.params.id]);

            var output = [];

            if (tamin.length == 1) {
                var taminDate = jmoment.from(`${tamin[0].year}/${tamin[0].month}/01 00:00:00`, 'fa', 'YYYY/MM/DD HH:mm:ss');

                var number_of_days_in_month = jmoment.jDaysInMonth(taminDate.format('jYYYY'), taminDate.format('jMM'));

                //public variables
                var min_daily_salary, max_daily_salary = 0;

                var [pv] = await pp.query('select * from hr_yearly_variable where year=?', [
                    taminDate.format('YYYY')
                ]);
                if (pv.length == 1) {
                    min_daily_salary = pv[0].min_daily_salary;
                    max_daily_salary = pv[0].max_daily_salary;
                }

                //check for duplicate insurance number
                var [insurance_duplicate] = await pp.query('select t2.insurance_number from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id group by t2.insurance_number having count(t2.insurance_number) > 1;');

                if (insurance_duplicate.length > 0) {
                    res.status(403).send('شماره بیمه تکراری در لیست وارد شده است');
                    return;
                }

                for (let i = 0; i < persons.length; i++) {
                    if (persons[i].contract_end_date == null) {
                        var m = {
                            personnel_id: persons[i].personnel_id_fk,
                            message: 'تاریخ اتمام قرارداد ثبت نشده است'
                        }
                        output.push(m);
                    }
                    else {
                        var personContractDate = persons[i].contract_end_date;
                        if (taminDate.format('YYYY') < moment(personContractDate).format('YYYY') || taminDate.format('MM') < moment(personContractDate).format('MM')) {
                            var m = {
                                personnel_id: persons[i].personnel_id_fk,
                                message: 'دوره قراردادی به اتمام رسیده است'
                            }
                            output.push(m);
                        }
                    }


                    if (persons[i].job_status != null || persons[i].job_status != 'active') {
                        var m = {
                            personnel_id: persons[i].personnel_id_fk,
                            message: 'وضعیت کاری این پرسنل غیر فعال هست'
                        }
                        output.push(m);
                    }


                    //check for minimum salary-max salary
                    if (persons[i].daily_salary < min_daily_salary || persons[i].daily_salary > max_daily_salary) {
                        var m = {
                            personnel_id: persons[i].personnel_id_fk,
                            message: 'دستمزد روزانه با استاندارد دستمزد همخوانی ندارد'
                        }
                        output.push(m);
                    }

                    //check number of days in month
                    if (persons[i].total_work_day > number_of_days_in_month) {
                        var m = {
                            personnel_id: persons[i].personnel_id_fk,
                            message: 'تعداد روز کارکرد بیش از روز های ماه میباشد'
                        }
                        output.push(m);
                    }
                }
                res.status(200).send(output);
            }
            else {
                res.status(403).send('شناسه لیست ارسال شده معتبر نمیباشد')
                return;
            }


            if (persons.length > 0) {

            }
            else {
                res.status(403).send('empty list');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/get/company/:id`, auth.authorized, async (req, res) => {
        try {
            const [tamin] = await pp.query('select * from insurance_tamin where id=?', [req.params.id]);
            const [contract] = await pp.query('select * from contract where id=?', [tamin[0].contract_id_fk]);

            res.status(200).send({
                company_id: contract[0].contractor_id
            })
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/list/:id`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t2.first_name, t2.last_name, t2.insurance_number, t2.id_number, t2.father_name, t2.job_title, t1.start_date, t1.end_date, t1.total_work_day, t1.daily_salary, t1.monthly_salary, t1.include_benefit, t1.salary_benefit_include, t1.salary_benefit_include_notinclude, t1.insured_share, t1.employer_share, t1.jobless_share, t1.hard_job_share, t1.description from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id where t1.insurance_tamin_id_fk = ?', [req.params.id]);

            var [tamin] = await pp.query('select * from insurance_tamin where id=?', [req.params.id]);
            var [contract] = await pp.query('select * from contract where id=?', [tamin[0].contract_id_fk]);

            var manager_name = ''
            if (contract.length > 0 && contract[0].manager_id != null) {
                var [manager] = await pp.query('select * from personnel where id=?', [contract[0].manager_id]);
                manager_name = `${manager[0].first_name} ${manager[0].last_name}`;
            }


            var total_insured = 0;
            var total_employer = 0;
            var total_jobless = 0;
            var total_hard = 0

            for (let i = 0; i < list.length; i++) {
                total_insured += parseInt(list[i].insured_share);
                total_employer += parseInt(list[i].employer_share);
                total_jobless += parseInt(list[i].jobless_share);
                total_hard += parseInt(list[i].hard_job_share);
            }

            const output = {
                list: list,
                total_insured: total_insured,
                total_employer: total_employer,
                total_jobless: total_insured * 0.03,
                total_hard: total_hard,
                workshop_code: contract.length > 0 ? contract[0].workshop_code != null ? contract[0].workshop_code : '' : '',
                row: contract.length > 0 ? contract[0].row != null ? contract[0].row : '' : '',
                period: {
                    year: tamin[0].year,
                    month: tamin[0].month
                },
                manager: manager_name
            }
            res.status(200).send(output);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/persons/:taminid`, auth.authorized, async (req, res) => {
        try {

            let cmd = `select t1.*,t2.job_title, t2.first_name, t2.last_name, t2.insurance_number, t2.national_number, t3.title as job_title, t3.code as job_code, t3.id as job_id_fk  from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id left join job_title as t3 on t1.job_id_fk = t3.id  where t1.insurance_tamin_id_fk=${req.params.taminid}`;

            var [list] = await pp.query(cmd);
            const hash = await crypt.encrypt(cmd);

            res.status(200).send({
                list: list,
                hash: hash
            });
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/:companyId/:contractId`, auth.authorized, async (req, res) => {
        try {
            var cmd = '';

            if (req.params.companyId == '-1') {
                cmd = 'select t1.*, count(t3.id) as personnel_count, sum(t3.total_share) as total_insured,  t2.workshop_code, t2.row from insurance_tamin as t1 inner join contract as t2 on t1.contract_id_fk = t2.id left join insurance_tamin_personnel as t3 on t1.id = t3.insurance_tamin_id_fk where (t2.deleted <> 0 or t2.deleted is null)  group by t1.id order by t1.year desc, t1.month desc';
            }
            else if (req.params.companyId != '-1' && req.params.contractId == '-1') {
                cmd = `select t1.*, count(t3.id) as personnel_count, sum(t3.total_share) as total_insured,  t2.workshop_code, t2.row from insurance_tamin as t1 inner join contract as t2 on t1.contract_id_fk = t2.id left join insurance_tamin_personnel as t3 on t1.id = t3.insurance_tamin_id_fk where t2.contractor_id=${req.params.companyId}  group by t1.id order by t1.year desc, t1.month desc`
            }
            else if (req.params.companyId != '-1' && req.params.contractId != '-1') {
                cmd = `select t1.*, count(t3.id) as personnel_count, sum(t3.total_share) as total_insured,  t2.workshop_code, t2.row from insurance_tamin as t1 inner join contract as t2 on t1.contract_id_fk = t2.id left join insurance_tamin_personnel as t3 on t1.id = t3.insurance_tamin_id_fk where t2.contractor_id=${req.params.companyId} and t2.id=${req.params.contractId}  group by t1.id order by t1.year desc, t1.month desc`;
            };

            if (cmd == '') {
                res.status(403).send('error occured');
            }
            else {
                console.log(cmd);
                
                const hash = await crypt.encrypt(cmd);
                const [list] = await pp.query(cmd);
                res.status(200).send({
                    hash: hash,
                    list: list
                })
            }

        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/:insurance_id`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.*, count(t3.id) as personnel_count, sum(t3.insured_share) as total_insured,  t2.workshop_code, t2.row from insurance_tamin as t1 inner join contract as t2 on t1.contract_id_fk = t2.id left join insurance_tamin_personnel as t3 on t1.id = t3.insurance_tamin_id_fk where t1.id=?  group by t1.id', [req.params.insurance_id]);
            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.post(`${prefix}/person`, auth.authorized, async (req, res) => {
        try {
            if (req.body.personnel_id && req.body.insurance_id && req.body.total_work_day && req.body.daily_salary) {
                //check for duplicate
                var [duplicate] = await pp.query('select * from insurance_tamin_personnel where insurance_tamin_id_fk=? and personnel_id_fk=?', [
                    req.body.insurance_id,
                    req.body.personnel_id
                ]);

                if (duplicate.length > 0) {
                    res.status(403).send('duplicate person');
                }
                else {
                    await pp.query('insert into insurance_tamin_personnel (insurance_tamin_id_fk, personnel_id_fk, start_date, end_date, total_work_day, daily_salary, monthly_salary, include_benefit, salary_benefit_include, salary_benefit_include_notinclude, insured_share, employer_share, jobless_share, hard_job_share, total_share, job_id_fk, description) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                        req.body.insurance_id,
                        req.body.personnel_id,
                        req.body.start_date,
                        req.body.end_date,
                        req.body.total_work_day,
                        req.body.daily_salary,
                        req.body.monthly_salary,
                        req.body.include_benefit,
                        req.body.salary_benefit_include,
                        req.body.salary_benefit_include_notinclude,
                        req.body.insured_share,
                        req.body.employer_share,
                        req.body.jobless_share,
                        req.body.hard_job_share,
                        req.body.total_share,
                        req.body.job_id_fk,
                        req.body.description
                    ]);

                    res.status(200).send('done');
                }
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/person/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.personnel_id && req.body.insurance_id && req.body.total_work_day && req.body.daily_salary) {
                await pp.query('update insurance_tamin_personnel set insurance_tamin_id_fk=?, personnel_id_fk=?, start_date=?, end_date=?, total_work_day=?, daily_salary=?, monthly_salary=?, include_benefit=?, salary_benefit_include=?, salary_benefit_include_notinclude=?, insured_share=?, employer_share=?, jobless_share=?, hard_job_share=?, total_share=?, job_id_fk=?, description=? where id=?', [
                    req.body.insurance_id,
                    req.body.personnel_id,
                    req.body.start_date,
                    req.body.end_date,
                    req.body.total_work_day,
                    req.body.daily_salary,
                    req.body.monthly_salary,
                    req.body.include_benefit,
                    req.body.salary_benefit_include,
                    req.body.salary_benefit_include_notinclude,
                    req.body.insured_share,
                    req.body.employer_share,
                    req.body.jobless_share,
                    req.body.hard_job_share,
                    req.body.total_share,
                    req.body.job_id_fk,
                    req.body.description,
                    req.params.id
                ]);

                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/person`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.id, t2.first_name, t2.last_name, t2.national_number, t2.insurance_number, t1.total_work_day, t1.daily_salary, t1.include_benefit, t1.salary_benefit_include, t1.salary_benefit_include_notinclude,  t3.title as job_title, t3.id as job_id from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id left join job_title as t3 on t1.job_id_fk=t3.id');

            var [hr_variable] = await pp.query('select * from hr_yearly_variable');

            res.status(200).send({
                list: list,
                hr_variable: hr_variable[0]
            });
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.delete(`${prefix}/person`, auth.authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    await pp.query('delete from insurance_tamin_personnel where id=?', [arr[i]]);
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }

        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/persons/:id`, auth.authorized, async (req, res) => {
        try {
            const cmd = `select t1.*, t2.first_name, t2.last_name, t2.insurance_number, t2.national_number  from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id  where t1.insurance_tamin_id_fk=${req.params.taminid}`;

            var [list] = await pp.query(cmd);

            var hash = await crypt.encrypt(cmd);

            res.status(200).send({
                list: list,
                hash: hash
            });
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/person/:id`, auth.authorized, async (req, res) => {
        try {
            var [item] = await pp.query('select t1.*,t3.code as job_code, t3.title as job_title, t2.first_name, t2.last_name from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id left join job_title as t3 on t1.job_id_fk = t3.id where t1.id=?', [req.params.id]);
            res.status(200).send(item[0]);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.post(`${prefix}/disk`, auth.authorized, async (req, res) => {
        try {
            if (req.body.id) {
                var code = jmoment().utc(true).format('jYYjMMjDDhhmmss');
                var [tamin] = await pp.query('select * from insurance_tamin where id=?', [req.body.id]);
                if (tamin.length == 1) {
                    var [tamin_personnel] = await pp.query('select * from insurance_tamin_personnel where insurance_tamin_id_fk=?', [req.body.id]);

                    var [contract] = await pp.query('select * from contract where id=?', [tamin[0].contract_id_fk]);

                    if (contract.length == 1) {


                        var total_salary_benefit_include = 0;
                        var total_insured = 0;
                        var total_employer = 0;
                        var total_jobless = 0;


                        for (let i = 0; i < tamin_personnel.length; i++) {
                            total_salary_benefit_include += parseInt(tamin_personnel[i].salary_benefit_include);
                        }

                        total_insured = parseInt(total_salary_benefit_include * 0.07);
                        total_employer = parseInt(total_salary_benefit_include * 0.20);
                        total_jobless = parseInt(total_salary_benefit_include * 0.03);

                        //insert
                        var [disk_id] = await pp.query('insert into insurance_tamin_disk (tamin_id_fk, total_benefit_include, total_insured, total_employer, total_jobless, code, date, personnel_id_fk, personnel_count, workshop_code, row, month, year) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                            req.body.id,
                            total_salary_benefit_include,
                            total_insured,
                            total_employer,
                            total_jobless,
                            code,
                            moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                            req.user.id,
                            tamin_personnel.length,
                            contract[0].workshop_code,
                            contract[0].row,
                            tamin[0].month,
                            tamin[0].year
                        ]);

                        res.status(200).send({
                            id: disk_id.insertId
                        });
                    }
                    else {
                        res.status(403).send('contract not found');
                    }

                }
                else {
                    res.status(403).send('incorrect id');
                }
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/disk/:id`, auth.authorized, async (req, res) => {
        try {
            var [disk] = await pp.query('select * from insurance_tamin_disk where id=?', [req.params.id]);

            if (disk.length == 1) {
                var [tamin] = await pp.query('select * from insurance_tamin where id=?', [disk[0].tamin_id_fk]);
                var [personnel] = await pp.query('select first_name, last_name from personnel where id=?', [disk[0].personnel_id_fk]);
                var [contract] = await pp.query('select * from contract where id=?', [tamin[0].contract_id_fk]);
                var [company] = await pp.query('select * from company where id=?', [contract[0].contractor_id]);

                res.status(200).send({
                    logo_url: company[0].logo_url,
                    indicator: disk[0].code,
                    date: disk[0].date,
                    company_name: company[0].name,
                    workshop_code: disk[0].workshop_code,
                    row: disk[0].row,
                    month: disk[0].month,
                    year: disk[0].year,
                    personnel_count: disk[0].personnel_count,
                    total_salary_benefit_include: disk[0].total_benefit_include,
                    total_insured: disk[0].total_insured,
                    total_employer: disk[0].total_employer,
                    total_jobless: disk[0].total_jobless,
                    name: `${personnel[0].first_name} ${personnel[0].last_name}`
                });
            }
            else {
                res.status(403).send('disk not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/status/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.status) {
                await pp.query('update insurance_tamin set status=? where id=?', [req.body.status, req.params.id]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.post(`${prefix}/compare`, auth.authorized, async (req, res) => {
        try {
            if (req.body.list1_id && req.body.list2_id) {
                if (req.body.list1 != req.body.list2_id) {

                    var bonus1, bonus2 = 0;
                    var housing1, housing2 = 0;


                    var [list1] = await pp.query('select t2.national_number, t2.insurance_number, t2.first_name, t2.last_name, t1.*, t3.title as job_title from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id left join job_title as t3 on t1.job_id_fk = t3.id where t1.insurance_tamin_id_fk=?', [req.body.list1_id]);

                    var [list2] = await pp.query('select t2.national_number, t2.insurance_number, t2.first_name, t2.last_name, t1.*, t3.title as job_title from insurance_tamin_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id left join job_title as t3 on t1.job_id_fk = t3.id where t1.insurance_tamin_id_fk=?', [req.body.list2_id]);

                    if (list1.length > 0) {
                        var [tamin1] = await pp.query('select * from insurance_tamin where id=?', [req.body.list1_id]);
                        if (tamin1.length > 0) {
                            var [variables1] = await pp.query('select * from hr_yearly_variable where year=?', [tamin1[0].year]);
                            if (variables1.length > 0) {
                                bonus1 = parseInt(variables1[0].bonus);
                                housing1 = parseInt(variables1[0].housing);
                            }
                        }
                    }

                    if (list2.length > 0) {
                        var [tamin2] = await pp.query('select * from insurance_tamin where id=?', [req.body.list2_id]);
                        if (tamin2.length > 0) {
                            var [variables2] = await pp.query('select * from hr_yearly_variable where year=?', [tamin2[0].year]);
                            if (variables2.length > 0) {
                                bonus2 = parseInt(variables2[0].bonus);
                                housing2 = parseInt(variables2[0].housing);
                            }
                        }
                    }


                    var l1Json = JSON.stringify(list1);
                    var l2Json = JSON.stringify(list2);

                    var l1 = Array.from(JSON.parse(l1Json));
                    var l2 = Array.from(JSON.parse(l2Json));


                    var output = [];

                    for (let i = 0; i < l1.length; i++) {
                        var m = {};

                        var person = l2.filter(item => item.national_number == l1[i].national_number);
                        if (person.length == 1) {
                            m['شماره بیمه'] = l1[i].insurance_number;
                            m['نام خانوادگی و نام'] = `${l1[i].last_name} ${l1[i].first_name}`;
                            m['توضیحات'] = 'تغییرات وجود دارد';
                            m['شروع بکار ۱'] = l1[i].start_date;
                            m['شروع بکار ۲'] = person[0].start_date;
                            m['خاتمه کار ۱'] = l1[i].end_date;
                            m['خاتمه کار ۲'] = person[0].end_date;
                            m['شغل ۱'] = l1[i].job_title;
                            m['شغل ۲'] = person[0].job_title;
                            m['روز کارکرد ۱'] = l1[i].total_work_day;
                            m['روز کارکرد ۲'] = person[0].total_work_day;
                            m['دستمزد روزانه ۱'] = l1[i].daily_salary;
                            m['دستمزد روزانه ۲'] = person[0].daily_salary;
                            m['دستمزد ماهانه ۱'] = l1[i].monthly_salary;
                            m['دستمزد ماهانه ۲'] = person[0].monthly_salary;
                            m['مزایای ماهیانه ۱'] = bonus1 + housing1;
                            m['مزایای ماهیانه ۲'] = bonus2 + housing2;
                            var salary_bonus_monthly1 = (parseInt(l1[i].daily_salary) * parseInt(l1[i].total_work_day)) + (bonus1 + housing1);
                            var salary_bonus_monthly2 = (parseInt(person[0].daily_salary) * parseInt(person[0].total_work_day)) + (bonus2 + housing2);
                            m['دستمزد و مزایای ماهیانه ۱'] = salary_bonus_monthly1;
                            m['دستمزد و مزایای ماهیانه ۲'] = salary_bonus_monthly2;
                            var notinclude_salary1 = parseInt(l1[i].salary_benefit_include_notinclude) - parseInt(l1[i].salary_benefit_include);
                            var notinclude_salary2 = parseInt(person[0].salary_benefit_include_notinclude) - parseInt(person[0].salary_benefit_include);
                            m['کل دستمزد ۱'] = salary_bonus_monthly1 + notinclude_salary1;
                            m['کل دستمزد ۲'] = salary_bonus_monthly2 + notinclude_salary2;
                            m['مبلغ سهم بیمه شده ۱'] = l1[i].insured_share;
                            m['مبلغ سهم بیمه شده ۲'] = person[0].insured_share;
                            m['نرخ سهم بیمه شده ۱'] = '7.00';
                            m['نرخ سهم بیمه شده ۲'] = '7.00';
                            m['مبلغ سهم بیکاری ۱'] = l1[i].jobless_share;
                            m['مبلغ سهم بیکاری ۲'] = person[0].jobless_share;
                            m['نرخ سهم بیکاری ۱'] = '3.00';
                            m['نرخ سهم بیکاری ۲'] = '3.00';
                            m['مبلغ سهم کارفرما ۱'] = l1[i].employer_share;
                            m['مبلغ سهم کارفرما ۲'] = person[0].employer_share;
                            m['نرخ سهم کارفرما ۱'] = '20.00';
                            m['نرخ سهم کارفرما ۲'] = '20.00';
                            m['مبلغ سهم مشاغل سخت ۱'] = l1[i].hard_job_share;
                            m['مبلغ سهم مشاغل سخت ۲'] = person[0].hard_job_share;
                            m['نرخ سهم مشاغل سخت ۱'] = '0';
                            m['نرخ سهم مشاغل سخت ۲'] = '0';
                            var total_insured1 = parseInt(l1[i].employer_share) + parseInt(l1[i].insured_share) + parseInt(l1[i].jobless_share);
                            var total_insured2 = parseInt(person[0].employer_share) + parseInt(person[0].insured_share) + parseInt(person[0].jobless_share);
                            m['جمع مبلغ حق بیمه ۱'] = total_insured1;
                            m['جمع مبلغ حق بیمه ۲'] = total_insured2;
                            m['نرخ مبلغ حق بیمه ۱'] = '30.00';
                            m['نرخ مبلغ حق بیمه ۲'] = '30.00';
                            output.push(m);
                        }
                        else {
                            m['شماره بیمه'] = '';
                            m['نام خانوادگی و نام'] = `${l1[i].last_name} ${l1[i].first_name}`;
                            m['توضیحات'] = 'در لیست دوم وجود ندارد';
                            m['شروع بکار ۱'] = '';
                            m['شروع بکار ۲'] = '';
                            m['خاتمه کار ۱'] = ''
                            m['خاتمه کار ۲'] = ''
                            m['شغل ۱'] = ''
                            m['شغل ۲'] = ''
                            m['روز کارکرد ۱'] = ''
                            m['روز کارکرد ۲'] = ''
                            m['دستمزد روزانه ۱'] = ''
                            m['دستمزد روزانه ۲'] = ''
                            m['دستمزد ماهانه ۱'] = ''
                            m['دستمزد ماهانه ۲'] = ''
                            m['مزایای ماهیانه ۱'] = ''
                            m['مزایای ماهیانه ۲'] = ''
                            m['دستمزد و مزایای ماهیانه ۱'] = ''
                            m['دستمزد و مزایای ماهیانه ۲'] = ''
                            m['کل دستمزد ۱'] = ''
                            m['کل دستمزد ۲'] = ''
                            m['مبلغ سهم بیمه شده ۱'] = ''
                            m['مبلغ سهم بیمه شده ۲'] = ''
                            m['نرخ سهم بیمه شده ۱'] = '';
                            m['نرخ سهم بیمه شده ۲'] = '';
                            m['مبلغ سهم بیکاری ۱'] = ''
                            m['مبلغ سهم بیکاری ۲'] = ''
                            m['نرخ سهم بیکاری ۱'] = '';
                            m['نرخ سهم بیکاری ۲'] = '';
                            m['مبلغ سهم کارفرما ۱'] = '';
                            m['مبلغ سهم کارفرما ۲'] = ''
                            m['نرخ سهم کارفرما ۱'] = '';
                            m['نرخ سهم کارفرما ۲'] = '';
                            m['مبلغ سهم مشاغل سخت ۱'] = ''
                            m['مبلغ سهم مشاغل سخت ۲'] = ''
                            m['نرخ سهم مشاغل سخت ۱'] = '';
                            m['نرخ سهم مشاغل سخت ۲'] = '';
                            m['جمع مبلغ حق بیمه ۱'] = '';
                            m['جمع مبلغ حق بیمه ۲'] = '';
                            m['نرخ مبلغ حق بیمه ۱'] = '';
                            m['نرخ مبلغ حق بیمه ۲'] = '';
                            output.push(m);
                        }
                    }



                    const xls = json2xls(output);
                    var filename = `${moment().utc(true).format('YYMMDDHHmmss')}.xls`;
                    res.xls(filename, output);
                }
                else {
                    res.status(403).send('list ids can not be same');
                }
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {

            res.status(403).send('error occured');
        }
    })

    app.post(`${prefix}/sum`, auth.authorized, async (req, res) => {
        try {
            if (req.body.contractId) {
                if (req.body.contractId == '-1') {
                    const [contracts] = await pp.query('select id from contract where contractor_id=?', [req.body.companyId]);
                    const arr = [];
                    for (let i = 0; i < contracts.length; i++) {
                        arr.push(contracts[i].id);
                    }


                    const cmd = `select sum(t1.total_share) as total from insurance_tamin_personnel as t1 inner join insurance_tamin as t2 on t1.insurance_tamin_id_fk = t2.id where  t2.contract_id_fk IN(${arr.toString()}) and (t2.year between ${Number(req.body.fromYear)} and ${Number(req.body.toYear)}) and (t2.month between ${Number(req.body.fromMonth)} and ${Number(req.body.toMonth)});`;


                    var [list] = await pp.query(cmd);
                    var total = 0;
                    if (list.length == 1) {
                        total = list[0].total;
                    }
                    res.status(200).send({
                        total: parseInt(total)
                    });
                }
                else {


                    if (req.body.fromMonth && req.body.toMonth && req.body.fromYear && req.body.toYear) {
                        const [contracts] = await pp.query('select * from insurance_tamin where year between ? and ? and month between ? and ? and contract_id_fk=? order by year,month;', [
                            Number(req.body.fromYear),
                            Number(req.body.toYear),
                            Number(req.body.fromMonth),
                            Number(req.body.toMonth),
                            req.body.contractId
                        ])


                        if (contracts.length == 0) {
                            return res.status(403).send('قرارداد مورد نظر در سامانه پیدا نشد');
                        }

                        const arr = [];
                        for (let i = 0; i < contracts.length; i++) {
                            arr.push(contracts[i].id);
                        }



                        const cmd = `select sum(t1.total_share) as total from insurance_tamin_personnel as t1 inner join insurance_tamin as t2 on t1.insurance_tamin_id_fk = t2.id where  t2.id IN (${arr.toString()});`;



                        var [list] = await pp.query(cmd);

                        var total = 0;
                        if (list.length == 1) {
                            total = list[0].total;
                        }
                        res.status(200).send({
                            total: parseInt(total)
                        });
                    }
                    else {
                        res.status(403).send('incomplete request');
                    }

                }
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })


    app.post(`${prefix}/copy`, auth.authorized, async (req, res) => {
        try {
            if (req.body.from_list && req.body.to_list) {
                var [list1] = await pp.query('select *  from insurance_tamin_personnel where id=?', [req.body.from_list]);

                if (list1.length == 0) {
                    res.status(403).send('یکی از لیست ها خالی از پرسنل میباشد');
                }
                else {
                    for (let i = 0; i < list1.length; i++) {
                        await pp.query('insert into insurance_tamin_personnel (insurance_tamin_id_fk, personnel_id_fk, start_date, end_date, total_work_day, daily_salary, monthly_salary, include_benefit, salary_benefit_include, salary_benefit_include_notinclude, insured_share, employer_share, jobless_share, hard_job_share, total_share, job_id_fk, description) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                            list1[i].insurance_tamin_id_fk,
                            list1[i].personnel_id_fk,
                            list1[i].start_date,
                            list1[i].end_date,
                            list1[i].total_work_day,
                            list1[i].daily_salary,
                            list1[i].monthly_salary,
                            list1[i].include_benefit,
                            list1[i].salary_benefit_include,
                            list1[i].salary_benefit_include_notinclude,
                            list1[i].insured_share,
                            list1[i].employer_share,
                            list1[i].jobless_share,
                            list1[i].hard_job_share,
                            list1[i].total_share,
                            list1[i].job_id_fk,
                            list1[i].description
                        ])
                    }
                    res.status(200).send('done');
                }
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.delete(`${prefix}/remove/all/:id`, auth.authorized, async (req, res) => {
        try {
            await pp.query('delete from insurance_tamin_personnel where insurance_tamin_id_fk=?', [req.params.id]);
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/report/person/:personnelId`, auth.authorized, async (req, res) => {
        try {
            const [list] = await pp.query('select t1.insurance_tamin_id_fk, t2.year, t2.month,  t3.workshop_code, t4.name from insurance_tamin_personnel as t1 inner join insurance_tamin as t2 on t1.insurance_tamin_id_fk = t2.id inner join contract as t3 on t2.contract_id_fk=t3.id left join company as t4 on t3.contractor_id = t4.id where t1.personnel_id_fk=? group by  t3.workshop_code', [
                req.params.personnelId
            ]);

            const output = [];

            

            for (let i = 0; i < list.length; i++) {

                const [years] = await pp.query(`select t1.personnel_id_fk, t1.total_work_day, t2.year, t2.month from insurance_tamin_personnel as t1
                                                inner join insurance_tamin as t2 on t1.insurance_tamin_id_fk = t2.id
                                                inner join contract as t3 on t2.contract_id_fk = t3.id
                                                where t3.workshop_code='${list[i].workshop_code}' and t1.personnel_id_fk=${req.params.personnelId}
                                                group by t2.year order by t2.year`);


               
                for(let j=0;j<years.length; j++) { 
                    const m = {
                        year: years[j].year,
                        workshop_code: list[i].workshop_code,
                        company_name: list[i].name,
                        work_days: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }

                    const [workdays] = await pp.query(`select t1.personnel_id_fk, t1.total_work_day, t2.year, t2.month from insurance_tamin_personnel as t1
                    inner join insurance_tamin as t2 on t1.insurance_tamin_id_fk = t2.id
                    inner join contract as t3 on t2.contract_id_fk = t3.id
                    where t3.workshop_code='${m.workshop_code}' and t1.personnel_id_fk=${req.params.personnelId} and t2.year = ${m.year}
                    group by  t2.month
                    order by t2.year, t2.month;`);

                    

                    for(k=0;k<workdays.length;k++) { 
                        m.work_days[Number(workdays[k].month) - 1]= Number(workdays[k].total_work_day);
                    }
                    output.push(m);

                }
                

            }
            res.status(200).send(output);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/report/individual/:personnelId`, auth.authorized, async (req, res) => {
        try {
            const [list] = await pp.query('select t1.id, t2.year, t2.month,t3.workshop_code,t3.row, t2.list_number, t3.subject, t1.total_work_day,t1.daily_salary, t1.monthly_salary, t1.include_benefit, t1.salary_benefit_include, t1.salary_benefit_include_notinclude, t1.total_share, t1.start_date, t1.end_date, t4.title, t4.code, t5.name from insurance_tamin_personnel as t1 inner join insurance_tamin as t2 on t1.insurance_tamin_id_fk=t2.id inner join contract as t3 on t2.contract_id_fk=t3.id inner join job_title as t4 on t1.job_id_fk=t4.id inner join company as t5 on t3.contractor_id = t5.id where t1.personnel_id_fk=?', [
                req.params.personnelId
            ]);

            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })
})
