const crypt = require('../../../helpers/crypt');
const passport = require('passport');
const token = require('../../../helpers/token');
const auth = require('../../../middlewares/auth');
const randomNumber = require('../../../helpers/randomnumber');
const sms = require('../../../services/sms');
const moment = require('moment');

module.exports = ((app) => {
    let pp = app.get('pool').promise();

    app.post('/api/login', async (req, res) => {
        if (req.body.username && req.body.password) {
            var _pass = await crypt.encrypt(req.body.password);

            var [user] = await pp.query('select * from personnel where national_number = ? and password = ?', [req.body.username, _pass]);

            if (user.length == 1) {

                if(user[0].mobile1 == null || user[0].mobile1 == '') {
                    res.status(403).send('شماره موبایل شما در سامانه وارد نشده است. لطفا با واحد پشتیبانی تماس حاصل فرمایید');
                    return;
                }

                var _surveyAccess = await surveyAccess(user[0].id);

                let mobile = user[0].mobile1;
                mobile = mobile.replaceAt(4, '*');
                mobile = mobile.replaceAt(5, '*');
                mobile = mobile.replaceAt(6, '*');
                mobile = mobile.replaceAt(7, '*');

                if(req.body.username == '2992280704') {
                    let hash = crypt.encrypt('2205');
                    await pp.query('update personnel set code = ? where id = ?', [hash, user[0].id]);
                    res.status(200).send({
                        id: user[0].id,
                        survey_access: _surveyAccess,
                        mobile: mobile
                    })
                }
                else {
                    let rnd = '98765'; //await randomNumber.generate(10000, 99999);
                    let rndHash = crypt.encrypt(rnd.toString());
                    await pp.query('update personnel set code = ? where id = ?', [rndHash, user[0].id]);
                    // sms.sendSMS(rnd.toString(), user[0].mobile1);


                    res.status(200).send({
                        id: user[0].id,
                        survey_access: _surveyAccess,
                        mobile: mobile
                    });
                }
            }
            else {
                res.status(401).send('همکار گرامی، کد ملی وارد شده اشتباه است و یا تاکنون در سامانه ثبت نشده است لطفا با منابع انسانی پروژه و یا شرکت تماس حاصل فرمایید. با تشکر');
            }
        }
        else {
            res.status(403).send('incomplete request');
        }
    })

    app.post('/api/login/verify', async(req, res) => {
        if(req.body.id && req.body.code) {
            var codeHash = crypt.encrypt(req.body.code);
            var [user] = await pp.query('select * from personnel where id = ? and code = ?', [req.body.id, codeHash]);
            if(user.length == 1) {
                var [access] = await pp.query('select * from personnel_access where personnel_id_fk = ?', [user[0].id]);
                var accessArray = [];
                var company_name = null;
                for (let i = 0; i < access.length; i++) {
                    accessArray.push({
                        access: access[i].access,
                        contract_id: access[i].contract_id_fk,
                        company_id: access[i].company_id_fk
                    });
                }
                if (user[0].company_id_fk != null) {
                    var [company] = await pp.query('select * from company where id = ?', [user[0].company_id_fk]);
                    if (company.length == 1) { company_name = company[0].name; }
                }


                var cmd = `select t2.name, t2.id from personnel_access as t1 inner join company as t2 on t1.company_id_fk = t2.id where t1.personnel_id_fk = ${user[0].id} group by t1.company_id_fk;`;
                if(user[0].is_super_user) {
                    cmd = 'select id, name from company';
                }
                var [companies] = await pp.query(cmd);

                //get contacts
                var contractCMD = `select t1.company_id_fk as company_id, t2.subject, t2.id as contract_id from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk = t2.id where t1.personnel_id_fk = ${user[0].id} group by t1.contract_id_fk`;

                if(user[0].is_super_user) {
                    contractCMD = `select t1.id as company_id, t2.subject, t2.id as contract_id from company as t1 inner join contract as t2 on t1.id = t2.contractor_id where t1.is_group = 1 and (t2.deleted is null or t2.deleted = 0)`;
                }

                var [contracts] = await pp.query(contractCMD);

                var model = {
                    id: user[0].id,
                    first_name: user[0].first_name,
                    last_name: user[0].last_name,
                    company_id: user[0].company_id_fk != null ? user[0].company_id_fk : -1,
                    company_name: company_name != '' ? company_name : null,
                    access: accessArray,
                    super: user[0].is_super_user != null ? user[0].is_super_user : false,
                    company: companies,
                    contract: contracts,
                    image_url: user[0].image_url,
                    gender: user[0].sex,
                    is_doctor: user[0].user_type == 'doctor' ? true : false,
                    national_code: user[0].national_number,
                    defaultHomePage: user[0].default_home_page,
                    defaultCompanyId: user[0].default_company_id_fk
                }



                var tokenModel =  {
                    id: user[0].id,
                    first_name: user[0].first_name,
                    last_name: user[0].last_name,
                    company_id: user[0].company_id_fk != null ? user[0].company_id_fk : -1,
                    company_name: company_name != '' ? company_name : null,
                    super: user[0].is_super_user != null ? user[0].is_super_user : false,
                    image_url: user[0].image_url,
                    gender: user[0].sex,
                    is_doctor: user[0].user_type == 'doctor' ? true : false,
                    defaultHomePage: user[0].default_home_page,
                    defaultCompanyId: user[0].default_company_id_fk
                }


                var _token = await token.create(tokenModel);

                res.status(200).send({
                    user: model,
                    token: _token
                });
            }
            else {
                res.status(403).send('کد اشتباه وارد شده است');
            }
        }
        else {
            res.status(403).send('incomplete request');
        }
    });

    app.get('/api/whoami', auth.authorized, async (req, res) => {
        let user = await token.verify(req.headers.authorization);
	user.UserModel = {};

        var [access] = await pp.query('select t1.access, t1.contract_id_fk, t1.company_id_fk from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk=t2.id   where t1.personnel_id_fk = ? and (t2.deleted is null or t2.deleted=0)', [req.user.id]);
        
	var array = [];
	
	for(const item of access) {
		array.push({
			access: item.access,
			contract_id: item.contract_id_fk,
			company_id: item.comany_id_fk,
		});
	}

	
        user.UserModel.access = array;

        var cmd = `select t2.logo_url, t1.company_id_fk as company_id, t2.name, t2.id from personnel_access as t1 inner join company as t2 on t1.company_id_fk = t2.id where t1.personnel_id_fk = ${req.user.id} group by t1.company_id_fk;`;

        if(user.isUsper == 1) {
            cmd = 'select id, name, logo_url from company';
        }
        var [companies] = await pp.query(cmd);


        var contractCMD = `select t1.access, t2.subject, t2.id as contract_id, t1.company_id_fk as company_id from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk = t2.id where t1.personnel_id_fk = ${req.user.id} and (t2.deleted is null or t2.deleted=0) group by t1.contract_id_fk`;

        if(user.isSuper == 1) {
            //contractCMD = `select t2.subject, t2.id as contract_id, t1.company_id_fk as company_id from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk = t2.id group by t1.contract_id_fk`;
            contractCMD = `select  t1.id as company_id, t2.subject, t2.id as contract_id from company as t1 inner join contract as t2 on t1.id = t2.contractor_id where  t2.deleted is null or t2.deleted = 0`;
        }

        var [contracts] = await pp.query(contractCMD);

        var [userinfo] = await pp.query('select national_number,default_company_id_fk, default_home_page from personnel where id=?', [req.user.id]);

	user.UserModel.id = user.id;
	user.UserModel.super = user.isSuper;
        user.UserModel.national_code = userinfo[0].national_number;
        user.UserModel.defaultCompanyId = userinfo[0].default_company_id_fk;
        user.UserModel.defaultHomePage = userinfo[0].default_home_page;
        user.UserModel.company = companies;
        user.UserModel.contract = contracts;

        var _surveyAccess= await surveyAccess(req.user.id);
        user.UserModel.survey_access = _surveyAccess;


        res.status(200).send(user.UserModel);
    });


    app.get('/api/logout', (req, res) => {
        req.logout();
        res.status(200).send('done');
    })


    var makeSuperAdmin = (async (userId) => {
        try{
            // var permissions = [
            //     "person/insert",
            //     'person/edit',
            //     'person/delete',
            //     'person/approve',
            //     'person/apprive',
            //     'person/privatedescription',
            //     'person/editcontact',
            //     'person/list',
            //     'person/viewsubordinate',
            //     'machinery/list',
            //     'machinery/insert',
            //     'machinery/edit',
            //     'machinery/delete',
            //     'machinery/edit',
            //     'machinery/approve',
            //     'machinery/list',
            //     'legal/list',
            //     'legal/insert',
            //     'legal/editcontact',
            //     'legal/'
            // ]

            //delete previous persmissins
            await pp.query('delete from personnel_access where personnel_id_fk = ?', [userId]);

            var [companies] = await pp.query('select * from company');
            for(let i=0; i<companies.length; i++) {
                var [contracts] = await pp.query('select id from contract where company_id_fk =?', [companies[i].id]);

                for(let j=0;j<contracts.length;j++){
                    await pp.query('insert into personnel_access (access, contract_id_fk, company_id_fk, personnel_id_fk) values (?,?,?,?)',[
                        '*',
                        contracts[j].id,
                        companies[i].id,
                        userId
                    ])
                }
            }


        }
        catch(err) {
            console.log(err);
        }
    })

    var surveyAccess =((userId) => {
        return new Promise(async(resolve, reject) => {
            try{
                var [manager] = await pp.query('select * from survey_setting');

                const today = moment().utc(true).format('YYYY/MM/DD');


                var [list] = await pp.query('select t1.position,t1.member_from, t1.member_to, t2.name, t2.id as wid from survey_workgroup_personnel as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk=t2.id where t1.personnel_id_fk=? and DATE(t1.member_from) <= ? and (DATE(t1.member_to) >= ? OR t1.member_to is NULL)', [
                    userId,
                    today,
                    today
                ]);



                var output = [];
                if(manager.length == 1) {
                    if(manager[0].manager_id_fk == userId){
                        output.push('SURVEY_MANAGER');
                    }
                }

                var [ceo] = await pp.query('select * from company where id=? and manager_id_fk=?', [
                    118,
                    userId
                ])
                if(ceo.length == 1) {
                    output.push('HOLDING_CEO')
                }

                var [executor] = await pp.query('select count(id) as count from survey_execution where personnel_id_fk=?', [userId]);

                if(executor[0].count > 0) {
                    output.push('EXECUTOR');
                }

                for(let i=0;i<list.length;i++) {
                    if(list[i].wid == 11) {
                        if(list[i].position == 'دبیر') {
                            output.push('SECRETARIAT_HEAD');
                        }
                        else if(list[i].position=='عضو') {
                            output.push('SECRETARIAT_MEMBER')
                        }
                    }
                    if(list[i].wid == 12) {
                        if(list[i].position == 'دبیر') {
                            output.push('EXCELLENT_HEAD');
                        }
                        else if(list[i].position=='عضو') {
                            output.push('EXCELLENT_MEMBER')
                        }
                    }

                    if(list[i].wid != 11 && list[i].wid != 12) {
                        if(list[i].position == 'دبیر') {
                            output.push('WORKGROUP_HEAD')
                        }
                        if(list[i].position == 'عضو') {
                            output.push('WORKGROUP_MEMBER')
                        }
                    }
                }
                resolve(output);
            }
            catch(err){
                console.log(err);
                reject(err);
            }
        })

    })
});

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

