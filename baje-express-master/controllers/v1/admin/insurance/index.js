const auth = require('../../../../middlewares/auth');
const multer = require('multer');
const excelReader = require('read-excel-file/node');
const moment = require('moment');
const jmoment = require('jalali-moment');
const fs = require('fs');
const path = require('path');
const json2xls = require('json2xls');
const crypt = require('../../../../helpers/crypt');
const { sendInsuranceApproval } = require('../../../../services/sms');

module.exports = ((app) => {
    const prefix = '/api/insurance';
    const pp = app.get('pool').promise();


    var test = multer.diskStorage({
        destination: './_uploads/insurance',
        filename: function (req, file, cb) {
            var filename = `${moment().utc(true).format('YYMMDDhhmmss')}.jpg`;
            cb(null, filename);
        }
    });
    var testMulter = multer({ storage: test });

    app.post(`${prefix}/amir`, testMulter.single('file'), (req, res) => { 
        res.send('done');
    });

    var addInsuranceStorage = multer.diskStorage({
        destination: './_uploads/insurance',
        filename: function (req, file, cb) {
            var filename = `${moment().utc(true).format('YYMMDDhhmmss')}.pdf`;
            cb(null, filename);
        }
    });

    var addInsuranceMulter = multer({ storage: addInsuranceStorage })
    app.post(`${prefix}`, addInsuranceMulter.single('file'), auth.authorized, async (req, res) => {
        try {
            if (req.body.type && req.body.insurer_main && req.body.insurer_company && req.body.contract_number && req.body.contract_issue_date && req.body.contract_date_from_date && req.body.to_date) {
                var filepath = '';
                if (req.file) {
                    filepath = `/api/file/insurance/${req.file.filename}`;
                }

                await pp.query('insert into insurance (type, insurer_main, insurer_company, contract_number, contract_issue_date, contract_date_from_date, to_date, main_insured, spouse_insured, doughter_insured, son_insured, father_insured, mother_insured, description, company_id_fk, approved, pdf_file_url, insurer_main_company_id_fk, change_deadline_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);', [
                    req.body.type,
                    req.body.insurer_main,
                    req.body.insurer_company,
                    req.body.contract_number,
                    req.body.contract_issue_date,
                    req.body.contract_date_from_date,
                    req.body.to_date,
                    req.body.main_insured != null ? req.body.main_insured : -1,
                    req.body.spouse_insured != null ? req.body.spouse_insured : -1,
                    req.body.doughter_insured != null ? req.body.doughter_insured : -1,
                    req.body.son_insured != null ? req.body.son_insured : -1,
                    req.body.father_insured != null ? req.body.father_insured : -1,
                    req.body.mother_insured != null ? req.body.mother_insured : -1,
                    req.body.description,
                    req.body.company_id,
                    false,
                    filepath,
                    req.body.insurer_main_company_id,
                    req.body.change_deadline_date
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send(err);
        }
    });

    app.put(`${prefix}/:id`, addInsuranceMulter.single('file'), auth.authorized, async (req, res) => {
        try {

            if (req.body.type && req.body.insurer_main && req.body.insurer_company && req.body.contract_number && req.body.contract_issue_date && req.body.contract_date_from_date && req.body.to_date) {

                var filepath = '';
                if (req.file) {
                    filepath = `/api/file/insurance/${req.file.filename}`;
                }

                await pp.query('update insurance set type=? , insurer_main = ? , insurer_company= ?, contract_number=?, contract_issue_date=?, contract_date_from_date=?, to_date=?, main_insured=?, spouse_insured=?, doughter_insured=?, son_insured=?, father_insured=?, mother_insured=?, description=?, company_id_fk=?, approved=?, pdf_file_url=?, insurer_main_company_id_fk=?, change_deadline_date=? where id=?', [
                    req.body.type,
                    req.body.insurer_main,
                    req.body.insurer_company,
                    req.body.contract_number,
                    req.body.contract_issue_date,
                    req.body.contract_date_from_date,
                    req.body.to_date,
                    req.body.main_insured != null ? req.body.main_insured : -1,
                    req.body.spouse_insured != null ? req.body.spouse_insured : -1,
                    req.body.doughter_insured != null ? req.body.doughter_insured : -1,
                    req.body.son_insured != null ? req.body.son_insured : -1,
                    req.body.father_insured != null ? req.body.father_insured : -1,
                    req.body.mother_insured != null ? req.body.mother_insured : -1,
                    req.body.description,
                    req.body.company_id,
                    false,
                    filepath,
                    req.body.insurer_main_company_id,
                    req.body.change_deadline_date,
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

    app.get(`${prefix}/pdf/:id`, async (req, res) => {
        var [item] = await pp.query('select pdf_file_url from insurance where id=?', [req.params.id]);
        if (item.length == 1) {
            if (item[0].pdf_file_url) {
                res.sendFile(`/var/www/baje724/${item[0].pdf_file_url}`);
            }
            else {
                res.status(403).send('file not found');
            }
        }
        else {
            res.status(403).send('file not found');
        }
    });


    

    app.delete(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    //check for personnel under takmili insurance
                    var [list] = await pp.query('select id from insurance_takmili_personnel where insurance_id_fk=? and is_deleted is null', [arr[i]]);
                    if (list.length == 0) {
                        await pp.query('delete from insurance where id = ?', [arr[i]]);
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

    app.get(`${prefix}/list/:companyId/:filter`, auth.authorized, async (req, res) => {
        try {
            let cmd = `select t1.*, t2.sign_url, t2.logo_url , concat(t3.first_name,' ', t3.last_name) as manager_name  from insurance as t1 left join insurance_takmili_personnel as t4 on t1.id = t4.insurance_id_fk left join company as t2 on t1.company_id_fk=t2.id left join personnel as t3 on t2.manager_id_fk=t3.id where `;
            const filter = [];

            if (req.params.filter == 'takmili') {
                filter.push(`type='تکمیلی'`);
            }
            else {
                filter.push(`type='عمر و حادثه'`);
            }
            if (req.user.super) {
                if (req.params.companyId != '-1') {
                    filter.push(`t1.company_id_fk=${req.params.companyId}`);
                }
            }
            else {
                if (req.params.companyId == '-1') {
                    const [myCompanies] = await pp.query('select company_id_fk from personnel_access where personnel_id_fk=? and not(company_id_fk is null) group by company_id_fk', [req.user.id]);

                    if(myCompanies.length > 0) {
                        const arr = [];
                        for (let i = 0; i < myCompanies.length; i++) {
                            arr.push(myCompanies[i].company_id_fk);
                        }
                        filter.push(`t1.company_id_fk in(${arr.toString()})`);
                    }

                }
                else {
                    filter.push(`t1.company_id_fk = ${req.params.companyId}`);
                }
            }

            for (let i = 0; i < filter.length; i++) {
                cmd += ` t1.${filter[i]} `;

                if (i < filter.length - 1) {
                    cmd += ' and';
                }
            }



            cmd += ' group by t1.id order by t1.contract_date_from_date desc';


            console.log(cmd);

            const [list] = await pp.query(cmd);

            for (let i=0;i<list.length;i++) { 
                const item = list[i];
                const [ppl] = await pp.query('select id from insurance_takmili_personnel where insurance_id_fk=?',[list[i].id]);
                item.numberOfMembers = ppl.length;
                list[i] = item;
            }
            const hash = await crypt.encrypt(cmd);
            res.status(200).send({
                list: list,
                hash: hash
            });


        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.*, t2.name as company_name, t2.sign_url, t2.logo_url, t3.first_name as manager_firstname, t3.last_name as manager_lastname from insurance as t1 inner join company as t2 on t1.company_id_fk = t2.id left join personnel as t3 on t2.manager_id_fk = t3.id where t1.id=?', [req.params.id]);
            if (list.length == 1) {
                res.status(200).send(list[0]);
            }
            else {
                res.status(403).send('insurance not found');
            }
        }
        catch (err) {
            
            res.status(403).send('error occured');
        }
    })

    app.post(`${prefix}/person/check`, async (req, res) => {
        try {
            if (req.body.national_number) {
                var [person] = await pp.query('select mobile1, company_id_fk, t2.name as company_name, t1.id, birth_date, first_name, last_name, national_number, bank_account1, sheba1, bank_name1, bank_account2, sheba2, bank_name2, bank_account3, sheba3, bank_name3, bank_account4, sheba4, bank_name4, bank_account5, sheba5, bank_name5  from personnel as t1 left join company as t2 on company_id_fk=t2.id where national_number = ?', [req.body.national_number]);

                var [subordinate] = await pp.query('select t1.birth_date, t1.id, t1.personnel_id_fk, t1.first_name, t1.last_name, t1.national_code as national_number, t1.relation from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.national_number=?', [req.body.national_number]);

                res.status(200).send({
                    person: JSON.parse(JSON.stringify(person)),
                    subordinate: subordinate
                });
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

    app.delete(`${prefix}/takmili/remove/all/:id`, auth.authorized, async (req, res) => {
        try {
            await pp.query('delete from insurance_takmili_personnel where insurance_id_fk=?', [req.params.id]);
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    var addPersonStorage = multer.diskStorage({
        destination: './_uploads/insurance',
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
    var addPersonMulter = multer({ storage: addPersonStorage })
    app.post(`${prefix}/persons/add/file`, addPersonMulter.single('file'), async (req, res) => {
        try {
            if (req.body.insurance_id) {
                var response = [];
                if (req.file) {
                    excelReader(`./${req.file.path}`, {
                        sheet: 1
                    }).then(async (rows) => {
                        for (let i = 1; i < rows.length; i++) {
                            var _m = {
                                index: i,
                                message: ''
                            }
                            //check for main
                            var [person] = await pp.query('select id from personnel where national_number=?', [rows[i][0]]);

                            //check for subordinate
                            var [sub] = await pp.query('select * from personnel_subordinate where national_code = ?', [rows[i][0]]);

                            
                            if (person.length == 0) {
                                _m.index = i;
                                _m.message = `ردیف ${i} شماره ملی در سامانه ثبت نشده است`;
                                response.push(_m);
                                continue;
                            }

                            if (sub.length > 0) {
                                if (sub.length > 1) {
                                    _m.index = i;
                                    _m.message = 'فرد نمیتواند تبعی چند نفر باشد';
                                    response.push(_m);
                                    continue;
                                }
                                else if (sub.length == 1) {
                                    if (sub[0].personnel_id_fk == person[0].id) {
                                        _m.index = i;
                                        _m.message = 'فرد نمیتواند هم تبعی باشد هم اصلی';
                                        response.push(_m);
                                        continue;
                                    }
                                }
                            }


                            //convert date
                            var from_date = rows[i][1];
                            var to_date = rows[i][2];

                            from_date = jmoment(from_date, 'jYYYY-jMM-jDD').format('YYYY/MM/DD');
                            to_date = jmoment(to_date, 'jYYYY-jMM-jDD').format('YYYY/MM/DD');


                            if (person.length > 0) {
                                await pp.query('insert into insurance_takmili_personnel (personnel_id_fk, start_date, end_date, insurance_id_fk, main_insurer_personnel_id_fk, is_approved) values (?,?,?,?,?,?)', [
                                    person[0].id,
                                    from_date,
                                    to_date,
                                    req.body.insurance_id,
                                    person[0].id,
                                    0
                                ]);
                                _m.index = i;
                                _m.message = 'ثبت شد';
                                response.push(_m);
                            }
                        }
                        res.status(200).send(response);
                    }).catch(err => {
                        console.log(err);
                        res.status(403).send('error occured');
                    })
                }
                else {
                    res.status(403).send('incomplete request');
                }
            }
            else {
                res.status(403).send('incomplete request');
            }

        }
        catch (err) {
            res.status(403).send(err);
        }
        finally {

            fs.unlink(`./${req.file.path}`, (err) => {
                if (err) { console.log('error while deleting file'); }
                else {
                    console.log('excel file deleted');
                }
            });
        }

    });


    app.post(`${prefix}/person/add`, async (req, res) => {
        try {


            if(req.body.mobile_number) {
                const [mobile1Dup] = await pp.query('select id from personnel where id <> ? and (mobile1=? or mobile2=?)', [
                    req.body.personnel_id,
                    req.body.mobile_number,
                    req.body.mobile_number
                ]);
    
                if(mobile1Dup.length> 0) {
                    return res.status(400).send('شماره موبایل قبلا در سیستم ثبت شده است')
                }
            }

            if(req.body.sheba1){
                const [dupSheba] = await pp.query('select id from personnel where id <> ? and (sheba1=? or sheba2=? or sheba3=? or sheba4=? or sheba5=?)',[
                    req.body.personnel_id,
                    req.body.sheba1,
                    req.body.sheba1,
                    req.body.sheba1,
                    req.body.sheba1,
                    req.body.sheba1
                ])

                if(dupSheba.length > 0) { 
                    return res.status(400).send('شماره شبا قبلا در سامانه وارد شده است');
                }
            }
            
            if (req.body.personnel_id && req.body.insurance_id && req.body.start_date && req.body.end_date) {

                //check duplication
                if(req.body.start_date && req.body.end_date) {
                    const [duplicate] = await pp.query('select * from insurance_takmili_personnel where personnel_id_fk = ? and end_date >= ? and is_deleted <> 1', [
                        req.body.personnel_id,
                        req.body.end_date
                    ]);
                    
                    if(duplicate.length > 0) { 
                        return res.status(400).send('دوره بیمه تکمیلی کاربر هنوز به اتمام نرسیده');
                    }
                }

               
                const [insert] = await pp.query('insert into insurance_takmili_personnel (personnel_id_fk, start_date, end_date, insurance_id_fk,description, main_insurer_personnel_id_fk, is_approved) value (?,?,?,?,?,?,?)', [
                    req.body.personnel_id,
                    req.body.start_date != null ? req.body.start_date : null,
                    req.body.end_date != null ? req.body.end_date : null,
                    req.body.insurance_id,
                    req.body.description,
                    req.body.main_insurer_personnel_id,
                    0
                ]);

                
                if (req.body.bank_account1 && req.body.bank_name1 && req.body.sheba1 && req.body.mobile_number) {
                    const [person] = await pp.query('select * from personnel where id=?', [req.body.personnel_id]);
                    await pp.query('update personnel set bank_account1=?, bank_name1=?, sheba1=?, mobile1=? where id=?', [
                        req.body.bank_account1,
                        req.body.bank_name1,
                        req.body.sheba1,
                        req.body.mobile_number,
                        req.body.personnel_id
                    ]);
                }

                if (req.body.subordinates) {
                    const arr = req.body.subordinates;

                    for (let i = 0; i < arr.length; i++) {

                        await pp.query('insert into insurance_takmili_subordinate (start_date, end_date, subordinate_id_fk, description,status, insurance_id_fk, insurance_takmili_subordinate_id_fk) values (?,?,?,?,?,?,?)', [
                            arr[i].start_date,
                            arr[i].end_date,
                            arr[i].personnel_id,
                            arr[i].description,
                            arr[i].status,
                            req.body.insurance_id,
                            insert.insertId
                        ]);
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
    })

    app.put(`${prefix}/person/edit/:id`, async (req, res) => {
        try {
            if (req.body.personnel_id && req.body.insurance_id) {
                await pp.query('update insurance_takmili_personnel set personnel_id_fk=?, start_date=?, end_date=?, insurance_id_fk=?,description=?, main_insurer_personnel_id_fk=?, is_approved=? where id=?', [
                    req.body.personnel_id,
                    req.body.start_date != null ? req.body.start_date : null,
                    req.body.end_date != null ? req.body.end_date : null,
                    req.body.insurance_id,
                    req.body.description,
                    req.body.main_insurer_personnel_id,
                    0,
                    req.params.id
                ]);
                if (req.body.bank_account1 && req.body.bank_name1 && req.body.sheba1 && req.body.mobile_number) {
                    const [person] = await pp.query('select * from personnel where id=?', [req.body.personnel_id]);
                    await pp.query('update personnel set bank_account1=?, bank_name1=?, sheba1=?, mobile1=? where id=?', [
                        req.body.bank_account1,
                        req.body.bank_name1,
                        req.body.sheba1,
                        req.body.mobile_number,
                        req.body.personnel_id
                    ]);
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

    app.put(`${prefix}/person/subordinate/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.start_date && req.body.end_date) {
                await pp.query('update insurance_takmili_subordinate set start_date=?, end_date=?, description=? where id=?', [
                    req.body.start_date,
                    req.body.end_date,
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
            res.status(403).send('error occured');
        }
    })

    app.post(`${prefix}/person/subordinate`, auth.authorized, async (req, res) => {
        try {

            if(req.body.subordinateId && req.body.insuranceId && req.body.startDate && req.body.endDate && req.body.personnel_id) {
                //find insurance first
                const [insurance] = await pp.query('select * from insurance_takmili_personnel where personnel_id_fk = ? and insurance_id_fk=?', [req.body.personnel_id, req.body.insuranceId]);
                if(insurance.length>0)  { 
                    await pp.query('insert into insurance_takmili_subordinate (subordinate_id_fk, insurance_id_fk, start_date, end_date, description, insurance_takmili_subordinate_id_fk) values (?,?,?,?,?,?)', [
                        req.body.subordinateId,
                        req.body.insuranceId,
                        req.body.startDate,
                        req.body.endDate,
                        req.body.description,
                        insurance[0].id
                    ]);
                } 
                else { 
                    res.status(400).send('insurance could not be found');
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
    })

    app.delete(`${prefix}/person/delete`, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    const [main] = await pp.query('select * from insurance_takmili_personnel where id=?', [arr[i]]);

                    await pp.query('update insurance_takmili_personnel set is_deleted=? where id=?', [1, arr[i]]);
                    if (main.length == 1) {
                        const [subordinates] = await pp.query('select t1.* from insurance_takmili_subordinate as t1 inner join personnel_subordinate as t2 on t1.subordinate_id_fk=t2.id where t2.personnel_id_fk=? and t1.insurance_id_fk=?', [
                            main[0].personnel_id_fk,
                            main[0].insurance_id_fk
                        ]);

                        for (let i = 0; i < subordinates.length; i++) {
                            await pp.query('delete from insurance_takmili_subordinate where id=?', [subordinates[i].id]);
                        }
                    }

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

    app.post(`${prefix}/person/copy`, async (req, res) => {
        try {
            if (req.body.from_id && req.body.to_id) {
                //check for ids
                var [from_id] = await pp.query('select * from insurance where id=?', [req.body.from_id]);
                var [to_id] = await pp.query('select * from insurance where id=?', [req.body.to_id]);

                if (from_id.length == 0) {
                    res.status(403).send({
                        message: 'شناسه بیمه مبدا معتبر نمیباشد'
                    });
                }
                else if (to_id.length == 0) { res.status(403).send({ message: 'شناسه بیمه مقصد معتبر نمیباشد' }); }
                else {
                    var [from_list] = await pp.query('select * from insurance_takmili_personnel where insurance_id_fk = ?', [req.body.from_id]);
                    for (let i = 0; i < from_list.length; i++) {
                        //insert with new list
                        await pp.query('insert into insurance_takmili_personnel (personnel_id_fk, start_date, end_date, description, insurance_id_fk, main_insurer_personnel_id_fk, is_approved) values (?,?,?,?,?,?,?)', [
                            from_list[i].personnel_id_fk,
                            to_id[0].contract_date_from_date,
                            to_id[0].to_date,
                            from_list[i].description,
                            req.body.to_id,
                            from_list[i].main_insurer_personnel_id_fk,
                            0
                        ]);
                    }

                    res.status(200).send({
                        message: `${from_list.length} نفر به لیست بیمه جدید منتقل شدند.`
                    });
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

    app.get(`${prefix}/persons/:insuranceid`, async (req, res) => {
        try {

            var [main_personnels] = await pp.query('select t1.id,t1.description, t1.is_approved, t1.personnel_id_fk, t1.main_insurer_personnel_id_fk as main_id, t1.start_date, t1.end_date, t1.description, t2.first_name as main_first_name, t2.last_name as main_last_name, t2.national_number as main_national_number, t2.mobile1 as mobile_number, t2.sheba1, t2.insurance_number, t2.bank_account1, t2.bank_name1 from insurance_takmili_personnel as t1 left join personnel as t2 on t1.main_insurer_personnel_id_fk = t2.id where t1.insurance_id_fk = ? and (t1.is_deleted is null or t1.is_deleted=?)', [req.params.insuranceid, 0]);


            var output = [];

            for (let i = 0; i < main_personnels.length; i++) {
                var [subordinates] = await pp.query('select t2.*,t1.start_date, t1.end_date,  t1.id as insurance_record_id, t1.description  from insurance_takmili_subordinate as t1 inner join personnel_subordinate as t2 on t1.subordinate_id_fk = t2.id where t1.insurance_id_fk=? and t2.personnel_id_fk=?', [
                    req.params.insuranceid,
                    main_personnels[i].personnel_id_fk
                ]);

                var _m = {
                    id: main_personnels[i].id,
                    main_id: main_personnels[i].main_id,
                    main_name: `${main_personnels[i].main_first_name} ${main_personnels[i].main_last_name}`,
                    main_first_name : main_personnels[i].main_first_name,
                    main_last_name: main_personnels[i].main_last_name,
                    main_national_number: main_personnels[i].main_national_number,
                    start_date: main_personnels[i].start_date,
                    end_date: main_personnels[i].end_date,
                    sub_id: '',
                    sub_name: '',
                    sub_natinal_number: '',
                    relation: '',
                    is_approved: main_personnels[i].is_approved,
                    description: main_personnels[i].description,
                    mobile_number: main_personnels[i].mobile_number,
                    sheba: main_personnels[i].sheba1,
                    bank_name: main_personnels[i].bank_name1,
                    insurance_number: main_personnels[i].insurance_number,
                    bank_account: main_personnels[i].bank_account1
                }

                _m.subordinates = [];
                output.push(_m);


                //subordinates
                for (let j = 0; j < subordinates.length; j++) {
                    var _s = {
                        id: subordinates[j].insurance_record_id,
                        main_id: main_personnels[i].main_id,
                        main_name: `${main_personnels[i].main_first_name} ${main_personnels[i].main_last_name}`,
                        main_national_number: main_personnels[i].main_national_number,
                        start_date: subordinates[j].start_date,
                        end_date: subordinates[j].end_date,
                        sub_id: subordinates[j].id,
                        sub_name: `${subordinates[j].first_name} ${subordinates[j].last_name}`,
                        sub_natinal_number: subordinates[j].national_code,
                        relation: subordinates[j].relation,
                        is_approved: main_personnels[i].is_approved,
                        description: subordinates[j].description,
                        mobile_number: main_personnels[i].mobile_number,
                        sheba: main_personnels[i].sheba1,
                        bank_name: main_personnels[i].bank_name1,
                        insurance_number: main_personnels[i].insurance_number,
                        bank_account: main_personnels[i].bank_account1,
                        sponsor_status: subordinates[j].sponsorship_status,
                        id_number: subordinates[j].id_number,
                        father_name: subordinates[j].father_name,
                        birth_date: jmoment(subordinates[j].birth_date).format('jYYYY/jMM/jDD'),
                        birth_date_day: jmoment(subordinates[j].birth_date).format('jDD'),
                        birth_date_month: jmoment(subordinates[j].birth_date).format('jMM'),
                        birth_date_year: jmoment(subordinates[j].birth_date).format('jYYYY'),
                    }
                    _m.subordinates.push(_s);
                    output.push(_s);
                }
            }

            res.status(200).send({
                list: output,
                json: JSON.stringify(output)
            });

        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/persons/:id/status`, async (req, res) => {
        if (req.body.is_approved != null) {
            try {
                await pp.query('update insurance_takmili_personnel set is_approved = ? where id=?', [
                    req.body.is_approved == 'true' ? 1 : 0, req.params.id]);

                if (req.body.is_approved == 'true') {

                    const [insurance] = await pp.query('select t2.first_name, t2.last_name, t2.mobile1 from insurance_takmili_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id=?', [
                        req.params.id
                    ]);

                    if (insurance.length == 1) {
                        //must send sms
                        sendInsuranceApproval(insurance[0].first_name, insurance[0].last_name , insurance[0].mobile1);
                    }

                }
                res.status(200).send('done');
            }
            catch (err) {
                res.status(403).send('error occured');
            }
        }
        else {
            res.status(403).send('incomplete request');
        }
    })

    app.get(`${prefix}/history/:type/:personnel_id/`, async (req, res) => {
        try {
            var [list] = await pp.query('select t3.type, t3.contract_number, t3.insurer_main, t1.id, t1.personnel_id_fk, t1.main_insurer_personnel_id_fk as main_id, t1.start_date, t1.end_date, t1.description, t2.first_name , t2.last_name, t2.national_number from insurance_takmili_personnel as t1 left join personnel as t2 on t1.main_insurer_personnel_id_fk = t2.id inner join insurance as t3 on t1.insurance_id_fk = t3.id where t1.main_insurer_personnel_id_fk = ? and t3.type=? order by t1.start_date DESC, t3.contract_number DESC', [req.params.personnel_id,
                req.params.type == 'takmili' ? 'عمر و حادثه' : 'تکمیلی'
            ]);
            
            var output = [];
            for (let i = 0; i < list.length; i++) {
                var relation = 'main';
                var code_meli = list[i].national_number;

                if (list[i].personnel_id_fk != list[i].main_id) {
                    var [sub] = await pp.query('select * from personnel_subordinate where id = ?', [list[i].personnel_id_fk]);
                    if (sub.length > 0) {
                        relation = sub[0].relation;
                        code_meli = sub[0].national_code;
                    }
                }


                var _m = {
                    id: list[i].id,
                    national_number: code_meli,
                    relation: relation,
                    contract_number: list[i].contract_number,
                    insurance_type: list[i].type,
                    insurer: list[i].insurer_main,
                    start_date: list[i].start_date,
                    end_date: list[i].end_date,
                    description: list[i].description,
                    first_name: list[i].first_name,
                    last_name: list[i].last_name
                }
                output.push(_m);
            }


            res.status(200).send(output);
        }
        catch (err) {
            res.status(403).send(err);
        }
    })

    app.post(`${prefix}/introletter`, async (req, res) => {
        try {
            if (req.body.person && req.body.company_id && req.body.type && req.body.insurance_id) {
                //insert into db to get indicator number
                var [insert] = await pp.query('insert into insurance_introletter (personnel_id_fk, company_id_fk, subordinates, date, type, insurance_id_fk) values (?,?,?,?,?,?)', [
                    req.body.person,
                    req.body.company_id,
                    req.body.subordinates != null ? req.body.subordinates.toString() : null,
                    moment().utc(true).format('YYYY-MM-DD HH:mm:ss'),
                    req.body.type,
                    req.body.insurance_id
                ]);

                const indicatorNumber = insert.insertId;

                res.status(200).send({
                    id: indicatorNumber
                });
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

    app.get(`${prefix}/introletter/:id`, async (req, res) => {
        try {
            var [entity] = await pp.query('select * from insurance_introletter where id=?', [req.params.id]);
            if (entity.length == 1) {
                var [company] = await pp.query('select t1.*, t2.first_name, t2.last_name from company as t1 left join personnel as t2 on t1.manager_id_fk = t2.id where t1.id = ?', [entity[0].company_id_fk]);


                var [person] = await pp.query('select * from personnel where id=?', [entity[0].personnel_id_fk]);
                var [insurance] = await pp.query('select t1.*  from insurance as t1  where id=?', [entity[0].insurance_id_fk]);

                var type = entity[0].type;
                var subordinates = entity[0].subordinates != null ? entity[0].subordinates.toString().split(',') : null;
                var p1 = '';

                p1 = `شرکت محترم ${insurance[0].insurer_main}\n\n`;

                console.log(person[0]);

                if (type == 'add') {
                    if (subordinates != null) {
                        p1 += `با سلام\n\nاحتراما خواهشمند است نسبت به افزودن پرسنل جدید، و افراد تحت تکفل ایشان به شرح جدول ذیل، به قرارداد بیمه تکمیلی درمان فی مابین به شماره ${insurance[0].contract_number} اقدام و نتیجه را به این شرکت اعلام فرمایید.`

                        var list = [];
                        var m = {
                            fullname: `${person[0].first_name} ${person[0].last_name}`,
                            father_name: person[0].father_name,
                            birth_date: person[0].birth_date,
                            issue_place: person[0].id_issue_place == null ? '-' : person[0].id_issue_place,
                            id_number: person[0].id_number,
                            national_number: person[0].national_number,
                            relation: 'main'
                        }
                        list.push(m);
                        for (let i = 0; i < subordinates.length; i++) {
                            var [sub] = await pp.query('select * from personnel_subordinate where id=?', [subordinates[i]]);
                            if (sub.length > 0) {
                                var _m = {
                                    fullname: `${sub[0].first_name} ${sub[0].last_name}`,
                                    father_name: sub[0].father_name,
                                    birth_date: sub[0].birth_date,
                                    id_number: sub[0].id_number,
                                    national_number: sub[0].national_code,
                                    issue_place: sub[0].issue_place,
                                    relation: sub[0].relation
                                }
                                list.push(_m);
                            }

                        }

                        res.status(200).send({
                            indicator_number: req.params.id,
                            date: jmoment(entity[0].date).utc(true).format('jYYYY/jMM/jDD'),
                            logo: company[0].logo_url,
                            sign: company[0].sign_url,
                            content: p1,
                            main_national_number: person[0].national_number,
                            main_start_date: insurance[0].contract_date_from_date,
                            manager_name: `${company[0].first_name} ${company[0].last_name}`,
                            list: list,
                            personnel_number: person[0].personnel_id,
                            mobile: person[0].mobile1,
                            sheba: person[0].sheba1,
                            insurance_number: person[0].insurance_number
                        });
                    }
                    else {
                        p1 += `با سلام\n\nاحتراما به پیوست تصویر شناسنامه ${person[0].first_name} ${person[0].last_name} خدمتتان تقدیم میشود. خواهشمند است نسبت به افزودن نامبرده به قرارداد بیمه تکمیلی درمان فیمابین به شماره ${insurance[0].contract_number} اقدام و نتیجه را به این شرکت اعلام فرمایید.`;
                        res.status(200).send({
                            indicator_number: req.params.id,
                            date: jmoment(entity[0].date).utc(true).format('jYYYY/jMM/jDD'),
                            logo: company[0].logo_url,
                            sign: company[0].sign_url,
                            content: p1,
                            main_national_number: person[0].national_number,
                            main_start_date: insurance[0].contract_date_from_date,
                            manager_name: `${company[0].first_name} ${company[0].last_name}`,
                            personnel_number: person[0].personnel_id,
                            mobile: person[0].mobile1,
                            sheba: person[0].sheba1,
                            insurance_number: person[0].insurance_number
                        })
                    }

                }
                else if (type == 'remove') {
                    var [person_takmili] = await pp.query('select * from insurance_takmili_personnel where personnel_id_fk = ?', [person[0].id]);

                    if (subordinates != null) {
                        p1 += `باسلام\n\nاحتراما خواهشمند است نسبت به حذف ${person[0].first_name} ${person[0].last_name} و افراد تحت تکفل از قرارداد بیمه تکمیلی درمان فی مابین به شماره ${insurance[0].contract_number} اقدام و نتیجه را به این شرکت اعلام فرمایید.`
                        res.status(200).send({
                            indicator_number: req.params.id,
                            date: jmoment(entity[0].date).utc(true).format('jYYYY/jMM/jDD'),
                            logo: company[0].logo_url,
                            content: p1,
                            main_national_number: person[0].national_number,
                            main_remove_date: person_takmili[0].end_date,
                            manager_name: `${company[0].first_name} ${company[0].last_name}`,
                            sign: company[0].sign_url,
                            mobile: person[0].mobile1,
                            sheba: person[0].sheba1,
                            insurance_number: person[0].insurance_number
                        })
                    }
                    else {
                        p1 += `باسلام\n\nاحتراما خواهشمند است نسبت به حذف ${person[0].first_name} ${person[0].last_name} از قرارداد بیمه تکمیلی درمان فی مابین به شماره ${insurance[0].contract_number} اقدام و نتیجه را به این شرکت اعلام فرمایید.`
                        res.status(200).send({
                            indicator_number: req.params.id,
                            date: jmoment(entity[0].date).utc(true).format('jYYYY/jMM/jDD'),
                            logo: company[0].logo_url,
                            content: p1,
                            main_national_number: person[0].national_number,
                            main_remove_date: person_takmili[0].end_date,
                            manager_name: `${company[0].first_name} ${company[0].last_name}`,
                            sign: company[0].sign_url,
                            mobile: person[0].mobile1,
                            sheba: person[0].sheba1,
                            insurance_number: person[0].insurance_number
                        })
                    }
                }
            }
            else {
                res.status(403).send('not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/main/report`, async (req, res) => {
        try {
            var [list] = await pp.query('select t2.id, t2.national_number, t2.first_name, t2.last_name from insurance_takmili_personnel as t1 inner join personnel as t2 on t1.main_insurer_personnel_id_fk = t2.id');

            var output = [];

            //get periods
            var [periods] = await pp.query('select period from personnel_salary_deduction group by period');

            for (let i = 0; i < list.length; i++) {
                var m = {};
                m['کد ملی'] = list[i].national_number;
                m['نام و نام خانوادگی'] = `${list[i].first_name} ${list[i].last_name}`;

                for (let k = 0; k < periods.length; k++) {
                    m[periods[k].period] = '';
                }
                var [item] = await pp.query('select * from personnel_salary_deduction where personnel_id_fk = ?', [list[i].id]);
                for (let j = 0; j < item.length; j++) {
                    m[item[j].period] = item[j].insurance_amount;
                }
                output.push(m)
            }
            const xls = json2xls(output);
            var filename = `${jmoment().utc(true).format('jYY-jMM-jDD-HH-mm')}.xlsx`;
            res.xls(filename, output);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/detail/:id`, async (req, res) => {
        try {
            var [insurance] = await pp.query('select * from insurance where id=?', [req.params.id]);



            var from_date = jmoment.from(insurance[0].contract_date_from_date, 'en', 'YYYY-MM-DD');
            var to_date = jmoment.from(insurance[0].to_date, 'en', 'YYYY-MM-DD');

            var output = [];

            var tajamo = 0;
            var tajamo_kosoorat = 0;
            while (true) {
                var fd = from_date.format('YYYY/MM');
                var [add_count] = await pp.query("select count(id) as count from insurance_takmili_personnel where DATE_FORMAT(DATE(start_date), '%Y/%m') = ? and is_deleted is null and insurance_id_fk=?", [
                    fd,
                    req.params.id
                ]);

                var [del_count] = await pp.query("select count(id) as count from insurance_takmili_personnel where DATE_FORMAT(DATE(start_date), '%Y/%m') = ? and (not(is_deleted is null) or is_deleted = ?) and insurance_id_fk=?", [
                    fd,
                    1,
                    req.params.id
                ]);

                var [month_count] = await pp.query("select count(id) as count from insurance_takmili_personnel where DATE(start_date) >= ? and DATE(end_date) <= ?  and (not(is_deleted is null) or is_deleted = ?) and insurance_id_fk=?", [
                    from_date.format('YYYY-MM-DD'),
                    to_date.format('YYYY-MM-DD'),
                    0,
                    req.params.id
                ]);
                tajamo += parseInt(month_count[0].count);
                tajamo_kosoorat += parseInt(del_count[0].count);

                var m = {};
                m[from_date.format('jYYYY-jMM')] = {
                    'جمع اضافات': add_count[0].count,
                    'جمع کسورات': del_count[0].count,
                    'تعداد این ماه': month_count[0].count,
                    'تعداد تجمعی تا آن ماه': tajamo,
                    'جمع مبلغ کسورات': parseInt(insurance[0].main_insured) * month_count[0].count
                }


                output.push(m);
                if (from_date.add(1, 'month').format('jYYYY/jMM') >= to_date.format('jYYYY/jMM')) {
                    break;
                }
            }

            res.status(200).send(output);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.delete(`${prefix}/takmili/subordinate/remove`, auth.authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                const arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    await pp.query('delete from insurance_takmili_subordinate where id=?', [arr[i]]);
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

    app.put(`${prefix}/approve/:id`, auth.authorized, async (req, res) => {
        try {
            
            await pp.query('update insurance set approved = ? where id=?', [
                Number(req.body.approve),
                req.params.id
            ]);

            res.status(200).send('done');
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })
})
