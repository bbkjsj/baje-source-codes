const auth = require('../../../../../middlewares/auth');
const multer = require('multer');
const moment = require('moment');
const jmoment = require('jalali-moment');
const fs = require('fs');
const crypt = require('../../../../../helpers/crypt');
const permissionHelper = require('../../../../../helpers/permissions');
const { DBFFile } = require('dbffile');
const bimehHelper = require('../../../../../helpers/bimeh');
const XLSX = require('xlsx');
const excelReader = require('read-excel-file/node');
const codeMelli_Helper = require('../../../../../helpers/code_melli');
const UserAccess = require('../../../../../helpers/useraccess');
const path = require('path');
const banks = require('../../../../../helpers/banks');
const codeMelli = require('../../../../../helpers/code_melli');
const jalali = require('moment-jalaali');


module.exports = ((app) => {

  let pp = app.get('pool').promise();


  app.get('/api/admin/personnel/subordinates/:companyId/:contractId', auth.authorized, async (req, res) => {
    try {
      const companyId = req.params.companyId;
      const contractId = req.params.contractId;

      let page = 1;
      let size = 20;
      let total = 0;

      let output = {};

      let cmd = '';

      let filter = '';
      if (req.query.filter && req.query.fvalue) {

        switch (req.query.filter) {
          case 'main_person_firstname':
            filter = `t2.first_name LIKE '%${req.query.fvalue}%'`;
            break;
          case 'main_person_lastname':
            filter = `t2.last_name LIKE '%${req.query.fvalue}%'`;
            break;
          case 'main_nationalcode':
            filter = `t2.national_number LIKE '%${req.query.fvalue}%'`;
            break;
          default:
            filter = `t1.${req.query.filter} LIKE '%${req.query.fvalue}%'`;
            break;
        }
      }


      if (req.user.super) {
        console.log('is super');

        if (companyId == '-1' && contractId == '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id`;
          }
        }
        else if (companyId == '-1' && contractId != '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode  from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.contract_id_fk=${contractId} and ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode  from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.contract_id_fk=${contractId}`;
          }
        }
        else if (companyId != '-1' && contractId == '-1') {
          if (filter != '') {
            cmd = `select t1.* ,t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk=${companyId} and ${filter}`;
          }
          else {
            cmd = `select t1.* ,t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk=${companyId}`;
          }

        }
        else if (companyId != '-1' && contractId != '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.contract_id_fk=${contractId} and t2.company_id_fk=${companyId} and ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.contract_id_fk=${contractId} and t2.company_id_fk=${companyId}`;
          }
        }

        if (req.query.sort) {
          cmd += ` order by ${req.query.sort} ${req.query.stype}`;
        }

        if (req.query.page && req.query.size) {
          page = Number(req.query.page);
          size = Number(req.query.size);
          let offset = (page - 1) * size;
          offset = offset < 0 ? 0 : offset;



          let index = cmd.length;
          if (cmd.indexOf('order by') > -1) {
            index = cmd.indexOf('order by');
          }

          let countCMD = `select count(t1.id) as count ${cmd.substring(cmd.indexOf('from'), index)}`;

          console.log(countCMD);

          const [totalCount] = await pp.query(countCMD);
          total = totalCount[0].count;

          cmd += ` limit ${size} offset ${offset}`;
        }
      }
      else {


        const [myAccess] = await pp.query('select t1.contract_id_fk, t1.company_id_fk from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk = t2.id where t1.personnel_id_fk=? and t1.access=? and (t2.deleted is null or t2.deleted <> 1)', [req.user.id, 'person/viewsubordinate']);


        const _myAccess = JSON.parse(JSON.stringify(myAccess));


        if (companyId != '-1' || contractId != '-1') {
          let allowToContinue = [];
          if (companyId != '-1') {
            allowToContinue = _myAccess.filter(item => {
              return item.company_id_fk == companyId;
            });
          }

          if (contractId != '-1') {
            allowToContinue = _myAccess.filter(item => {
              return item.contract_id_fk == contractId;
            });
          }

          if (allowToContinue.length == 0) {
            return res.status(403).send('you are not authorized to view this list');
          }
        }

        const myCompanies = _myAccess.map(item => {
          return item.company_id_fk;
        })
        const myContracts = _myAccess.map(item => {
          return item.contract_id_fk;
        })




        if (companyId == '-1' && contractId == '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk IN (${myCompanies.toString()}) and t2.contract_id_fk IN (${myContracts.toString()}) and ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk IN (${myCompanies.toString()}) and t2.contract_id_fk IN (${myContracts.toString()})`;
          }

        }
        else if (companyId != '-1' && contractId == '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk=${companyId} and t2.contract_id_fk IN (${myContracts.toString()}) and ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk=${companyId} and t2.contract_id_fk IN (${myContracts.toString()})`;
          }


        }
        else if (companyId == '-1' && contractId != '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk IN (${myCompanies.toString()}) and t2.contract_id_fk=${contractId} and ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk IN (${myCompanies.toString()}) and t2.contract_id_fk=${contractId}`;
          }
        }
        else if (companyId != '-1' && contractId != '-1') {
          if (filter != '') {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk=${companyId} and t2.contract_id_fk=${contractId} and ${filter}`;
          }
          else {
            cmd = `select t1.*, t2.first_name as main_person_firstname, t2.last_name as main_person_lastname, t2.national_number as main_nationalcode from personnel_subordinate as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t2.company_id_fk=${companyId} and t2.contract_id_fk=${contractId}`;
          }
        }

        if (req.query.sort) {
          cmd += ` order by ${req.query.sort} ${req.query.stype}`;
        }

        if (req.query.page && req.query.size) {
          page = Number(req.query.page);
          size = Number(req.query.size);
          let offset = (page - 1) * size;
          offset = offset < 0 ? 0 : offset;



          let index = cmd.length;
          if (cmd.indexOf('order by') > -1) {
            index = cmd.indexOf('order by');
          }

          let countCMD = `select count(t1.id) as count ${cmd.substring(cmd.indexOf('from'), index)}`;

          const [totalCount] = await pp.query(countCMD);
          total = totalCount[0].count;

          cmd += ` limit ${size} offset ${offset}`;
        }

      }



      const [list] = await pp.query(cmd);
      output = JSON.parse(JSON.stringify(list));



      res.status(200).send({
        list: output,
        total: total,
        json: JSON.stringify(output)
      });
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  });


  app.get("/api/admin/personnel/permissions", auth.authorized, (req, res) => {
    var permissions = permissionHelper.permissions();
    res.status(200).send({
      permissions,
    });
  });


  var storagePersonnel = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './_uploads/personnel');
    },
    filename: function (req, file, cb) {
      var name = `${moment().format('YYMMDDHHmmSS')}.$${path.extname(file.originalname)}`;
      cb(null, name);
    }
  })

  let uploadPersonnel = multer({ storage: storagePersonnel });
  var personnelUpload = uploadPersonnel.fields([
    {
      name: 'national_card_front',
      maxCount: 1
    },
    {
      name: 'national_card_rear',
      maxCount: 1
    },
    {
      name: 'birth_certificate',
      maxCount: 1
    },
    {
      name: 'army_service_card',
      maxCount: 1
    },
    {
      name: 'person',
      maxCount: 1
    },
    {
      name: 'sign',
      maxCount: 1
    }
  ])


  app.post('/api/admin/personnel/person', personnelUpload, auth.authorized, async (req, res) => { //حقیقی

    if (await UserAccess.isInRoleOfContract(req.user, req.body.contract_id, 'person/insert', app.get('pool')) == false) {
      res.status(303).send('سطح دسترسی شما به این قسمت محدود میباشد. لطفا با مدیر سامانه هماهنگ فرمایید');
      return;
    }


    const [nationalNumberDuplicate] = await pp.query('select id from personnel where national_number = ?', [
      req.body.national_number
    ]);

    if (nationalNumberDuplicate.length > 0) {
      return res.status(405).send('کد ملی وارد شده قبلا در سامانه ثبت شده است');
    }

    var national_front = req.files['national_card_front'] != null ? req.files['national_card_front'][0] : null;
    var national_rear = req.files['national_card_rear'] != null ? req.files['national_card_rear'][0] : null;
    var birth_cert_file = req.files['birth_certificate'] != null ? req.files['birth_certificate'][0] : null;
    var army_service_file = req.files['army_service_card'] != null ? req.files['army_service_card'][0] : null;
    var person_file = req.files['person'] != null ? req.files['person'][0] : null;
    var sign_file = req.files['sign'] != null ? req.files['sign'][0] : null;


    if (national_front != null) {
      switch (national_front.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (national_rear != null) {
      switch (national_rear.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (birth_cert_file != null) {
      switch (birth_cert_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }


    if (army_service_file != null) {
      switch (army_service_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (person_file != null) {
      switch (person_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (sign_file != null) {
      switch (sign_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (req.body.first_name &&
      req.body.last_name &&
      req.body.father_name &&
      req.body.id_number &&
      req.body.sex &&
      req.body.birth_place &&
      req.body.nation &&
      req.body.national_number &&
      req.body.password &&
      req.body.contract_id) {


      if (req.body.mobile1) {
        //duplicate check on mobile 1
        var [mob] = await pp.query('select id from personnel where mobile1 = ? or mobile2 = ?', [req.body.mobile1, req.body.mobile1]);
        if (mob.length > 0) {
          res.status(405).send('شماره موبایل قبلا در سامانه وارد شده است');
          return;
        }
      }

      if (req.body.mobile2) {
        //duplicate on mobile 2
        var [mob] = await pp.query('select id from personnel where mobile1 = ? or mobile2 = ?', [req.body.mobile2, req.body.mobile2]);
        if (mob.length > 0) {
          res.status(405).send('شماره موبایل قبلا در سامانه وارد شده است');
          return;
        }
      }

      //check for duplication
      var [duplicate] = await pp.query('select id from personnel where mobile1 = ? or mobile2 = ? or national_number = ? or insurance_number = ?', [req.body.mobile, req.body.mobile, req.body.national_number, req.body.insurance_number]);



      if (duplicate.length == 0) {
        //create password
        var _pass = await crypt.encrypt(req.body.password);


        //get job code
        const [job] = await pp.query('select * from job_title where id=?', [req.body.job_title_id]);

        try {
          var personInsert = await pp.query('insert into personnel (birth_date, national_number, first_name, last_name, father_name, id_number, sex, birth_place, id_issue_place, nation, public_description, private_description, password, image_url, marital_status, army_service, education, job_title, insurance_number, personnel_id, job_type, job_status, mobile1, mobile2, phone, email, bank_account1, sheba1, bank_name1, bank_account2, sheba2, bank_name2, bank_account3, sheba3, bank_name3, bank_account4, sheba4, bank_name4, bank_account5, sheba5, bank_name5, national_card_front_url, national_card_rear_url, birth_certificate_url, army_service_card_url, company_id_fk, data_approved, address, sign_url, job_disable_description, job_disable_date,study_field, postal_code, contract_id_fk, isargar, shahid_name, veteran_percentage, frontline_year, frontline_month, frontline_day, shahid_was_colleague, captivity_year, captivity_month, captivity_day, history_total_day,insurance_share_employee, insurance_share_employer, insurance_share_unemployment, insurance_share_harmful, employeement_date, contract_start_date, contract_end_date, employeement_type) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            req.body.birth_date,
            req.body.national_number,
            req.body.first_name,
            req.body.last_name,
            req.body.father_name,
            req.body.id_number,
            req.body.sex == 'male' ? 'm' : 'f',
            req.body.birth_place,
            req.body.id_issue_place,
            req.body.nation,
            req.body.public_description,
            req.body.private_description,
            _pass,
            person_file != null ? `/api/image/personnel/${person_file.filename}` : null,
            req.body.marital_status,
            req.body.army_service,
            req.body.education_name,
            job.length == 1 ? job[0].code.toString() : null,
            req.body.insurance_number,
            req.body.personnel_id,
            req.body.job_type,
            req.body.job_status,
            req.body.mobile1,
            req.body.mobile2,
            req.body.phone,
            req.body.email,
            req.body.bank_account1,
            req.body.sheba1,
            req.body.bank_name1,
            req.body.bank_account2,
            req.body.sheba2,
            req.body.bank_name2,
            req.body.bank_account3,
            req.body.sheba3,
            req.body.bank_name3,
            req.body.bank_account4,
            req.body.sheba4,
            req.body.bank_name4,
            req.body.bank_account5,
            req.body.sheba5,
            req.body.bank_name5,
            national_front != null ? `/api/image/personnel/${national_front.filename}` : null,
            national_rear != null ? `/api/image/personnel/${national_rear.filename}` : null,
            birth_cert_file != null ? `/api/image/personnel/${birth_cert_file.filename}` : null,
            army_service_file != null ? `/api/image/personnel/${army_service_file.filename}` : null,
            req.body.company_id,
            false,
            req.body.address,
            sign_file != null ? `/api/image/personnel/${sign_file.filename}` : null,
            req.body.expire_reason,
            req.body.expire_time,
            req.body.study_field,
            req.body.postal_code,
            req.body.contract_id,
            req.body.isargar,
            req.body.shahid_name,
            req.body.veteran_percentage,
            req.body.frontline_year,
            req.body.frontline_month,
            req.body.frontline_day,
            req.body.shahid_was_colleague == null ? 0 : req.body.shahid_was_colleague,
            req.body.captivity_year,
            req.body.captivity_month,
            req.body.captivity_day,
            req.body.history_total_day,
            req.body.insurance_share_employee,
            req.body.insurance_share_employer,
            req.body.insurance_share_unemployment,
            req.body.insurance_share_harmful,
            req.body.employeement_date,
            req.body.contract_start_date,
            req.body.contract_end_date,
            req.body.employeement_type
          ]);

          //add subordinates
          var subordinates = JSON.parse(req.body.subordinates);

          if (subordinates.length > 0) {
            for (let i = 0; i < subordinates.length; i++) {
              pp.query('insert into personnel_subordinate (personnel_id_fk, first_name, last_name, relation, national_code, birth_date, issue_place, father_name, id_number, sponsorship_status, insurance_number, exit_sponsor_reason, exit_sponsor_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                personInsert[0].insertId,
                subordinates[i].first_name,
                subordinates[i].last_name,
                subordinates[i].rel,
                subordinates[i].national_id,
                subordinates[i].birth_day,
                subordinates[i].birth_day_place,
                subordinates[i].father_name,
                subordinates[i].national_number,
                subordinates[i].sponsorship_status,
                subordinates[i].insurance_number,
                subordinates[i].exit_sponsor_reason,
                subordinates[i].exit_sponsor_date
              ]);
            }
          }
          //eof subordinates

          //permission
          if (req.body.permissions) {
            //delete previous permissions
            await pp.query('delete from personnel_access where personnel_id_fk = ? and contract_id_fk = ?', [req.user.id, req.body.contract_id]);

            var obj = JSON.parse(req.body.permissions);
            for (let i = 0; i < obj.length; i++) {
              var item = obj[i];
              for (let j = 0; j < item.permissions.length; j++) {
                await pp.query('insert into personnel_access (personnel_id_fk, access, company_id_fk, contract_id_fk) values (?,?,?,?)', [
                  personInsert[0].insertId,
                  item.permissions[j],
                  item.company_id,
                  item.contract_id
                ]);
              }
            }

          }

          //eof permission

          res.status(201).send('done');
        }
        catch (_ex) {
          console.log(_ex);
          res.status(403).send('خطایی رخ داده. لطفا با مدیر سیستم تماس حاصل فرمایید')
        }

      }
      else {
        res.status(403).send('پرسنل با این مشخصات قبلا در سامانه وارد شده است');
      }
    }
    else {
      res.status(403).send('incomplete request');
    }

  });

  app.post("/api/admin/personnel/edit", personnelUpload, auth.authorized, async (req, res) => {

    if (await UserAccess.isInRoleOfContract(req.user, req.body.contract_id, 'person/edit', app.get('pool')) == false) {
      res.status(303).send('سطح دسترسی شما به این قسمت محدود میباشد. لطفا با مدیر سامانه هماهنگ فرمایید');
      return;
    }

    var national_front = req.files != undefined && req.files["national_card_front"] != null
      ? req.files["national_card_front"][0]
      : null;
    var national_rear = req.files != undefined &&
      req.files["national_card_rear"] != null
      ? req.files["national_card_rear"][0]
      : null;
    var birth_cert_file = req.files != undefined &&
      req.files["birth_certificate"] != null
      ? req.files["birth_certificate"][0]
      : null;
    var army_service_file = req.files != undefined &&
      req.files["army_service_card"] != null
      ? req.files["army_service_card"][0]
      : null;
    var person_file = req.files != undefined &&
      req.files["person"] != null ? req.files["person"][0] : null;
    var sign_file = req.files != undefined && req.files["sign"] != null ? req.files["sign"][0] : null;

    if (national_rear != null) {
      switch (national_rear.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }




    if (national_rear != null) {
      switch (national_rear.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (birth_cert_file != null) {
      switch (birth_cert_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }

    if (army_service_file != null) {
      switch (army_service_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }

    if (person_file != null) {
      switch (person_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }


    if (sign_file != null) {
      switch (sign_file.mimetype) {
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/png':
          break;
        default:
          res.status(403).send("فقط فایل های JPG/PNG مجاز میباشند");
          return;
      }
    }



    if (req.body.mobile1 || req.body.mobile2) {
      const [mobileDuplicate] = await pp.query('select mobile1,mobile2 from personnel where (id <> ?) and (mobile1=? or mobile1=? or mobile2=? or mobile2=?)', [
        req.body.id,
        req.body.mobile1,
        req.body.mobile2,
        req.body.mobile1,
        req.body.mobile2
      ]);

      if (mobileDuplicate.length > 0) {
        return res.status(405).send('شماره موبایل وارد شده قبلا در سامانه ثبت شده است');
      }
    }



    if (
      req.body.first_name &&
      req.body.last_name &&
      req.body.father_name &&
      req.body.id_number &&
      req.body.sex &&
      req.body.birth_place &&
      req.body.nation &&
      req.body.national_number
    ) {
      try {
        const [job] = await pp.query('select * from job_title where id=?', [req.body.job_title_id]);

        await pp.query("update personnel set birth_date=?, national_number=?, first_name=?, last_name=?, father_name=?, id_number=?, sex=?, birth_place=?, id_issue_place=?, nation=?, public_description=?, marital_status=?, army_service=?, education=?, job_title=?, insurance_number=?, personnel_id=?, job_type=?, job_status=?, bank_account1=?, sheba1=?, bank_name1=?, bank_account2=?, sheba2=?, bank_name2=?, bank_account3=?, sheba3=?, bank_name3=?, bank_account4=?, sheba4=?, bank_name4=?, bank_account5=?, sheba5=?, bank_name5=?, company_id_fk=?, job_disable_description=?, job_disable_date=?, study_field=?, job_title = ?, contract_id_fk = ?, isargar = ?, shahid_name=?, veteran_percentage=?, frontline_year=?, frontline_month=?, frontline_day=?, shahid_was_colleague=?, captivity_year=?, captivity_month=?, captivity_day=?, history_total_day=? , insurance_share_employee = ?, insurance_share_employer=?, insurance_share_unemployment=?, insurance_share_harmful=?, employeement_date=?, contract_start_date=?, contract_end_date=?, employeement_type=? where id = ?",
          [
            req.body.birth_date,
            req.body.national_number,
            req.body.first_name,
            req.body.last_name,
            req.body.father_name,
            req.body.id_number,
            req.body.sex == "male" ? "m" : "f",
            req.body.birth_place,
            req.body.id_issue_place,
            req.body.nation,
            req.body.public_description,
            req.body.marital_status,
            req.body.army_service,
            req.body.education,
            req.body.job_title,
            req.body.insurance_number,
            req.body.personnel_id,
            req.body.job_type,
            req.body.job_status,
            req.body.bank_account1,
            req.body.sheba1,
            req.body.bank_name1,
            req.body.bank_account2,
            req.body.sheba2,
            req.body.bank_name2,
            req.body.bank_account3,
            req.body.sheba3,
            req.body.bank_name3,
            req.body.bank_account4,
            req.body.sheba4,
            req.body.bank_name4,
            req.body.bank_account5,
            req.body.sheba5,
            req.body.bank_name5,
            req.body.company_id,
            req.body.expire_reason,
            req.body.expire_time,
            req.body.study_field,
            job.length == 1 ? job[0].code : null,
            req.body.contract_id,
            req.body.isargar,
            req.body.shahid_name,
            req.body.veteran_percentage,
            req.body.frontline_year,
            req.body.frontline_month,
            req.body.frontline_day,
            req.body.shahid_was_colleague == null ? 0 : req.body.shahid_was_colleague,
            req.body.captivity_year,
            req.body.captivity_month,
            req.body.captivity_day,
            req.body.history_total_day,
            req.body.insurance_share_employee,
            req.body.insurance_share_employer,
            req.body.insurance_share_unemployment,
            req.body.insurance_share_harmful,
            req.body.employeement_date,
            req.body.contract_start_date,
            req.body.contract_end_date,
            req.body.employeement_type,
            req.body.id,
          ]
        );

        //private decsription access and update
        if (await UserAccess.isInRoleOfContract(req.user, req.body.contract_id, 'person/privatedescription', app.get('pool')) == true) {
          await pp.query('update personnel set private_description = ? where id=?', [req.body.private_description, req.body.id]);
        }


        if (await UserAccess.isInRoleOfContract(req.user, req.body.contract_id, 'person/editcontact', app.get('pool')) == true) {
          await pp.query('update personnel set mobile1=?, mobile2=?, phone=?, address=?, postal_code=?, email=?, address=? where id=?', [
            req.body.mobile1,
            req.body.mobile2,
            req.body.phone,
            req.body.address,
            req.body.postal_code,
            req.body.email,
            req.body.address,
            req.body.id
          ]);
        }

        //TODO:update password
        if (req.body.password) {
          var pass = crypt.encrypt(req.body.password);
          await pp.query("update personnel set password = ? where id = ?", [
            pass,
            req.body.id,
          ]);
        }

        if (national_front != null) {
          //delete old file
          if (req.body.national_card_front_old) {
            var file = req.body.national_card_front_old.split("/");
            if (file.length == 5) {
              fs.unlink("./_uploads/personnel/" + file[4], (_e) => {
                console.log(_e);
              });
            }
          }
          await pp.query("update personnel set national_card_front_url =? where id = ?",
            ["/api/image/personnel/" + national_front.filename, req.body.id]
          );
        }

        if (national_rear) {
          if (req.body.national_card_rear_old) {
            var file = req.body.national_card_rear_old.split("/");
            if (file.length == 5) {
              fs.unlink("./_uploads/personnel/" + file[4], (_e) => {
                console.log(_e);
              });
            }
          }
          await pp.query(
            "update personnel set national_card_rear_url =? where id = ?",
            ["/api/image/personnel/" + national_rear.filename, req.body.id]
          );
        }

        if (birth_cert_file) {
          if (req.body.birth_cert_file_old) {
            var file = req.body.birth_cert_file_old.split("/");
            if (file.length == 5) {
              fs.unlink("./_uploads/personnel/" + file[4], (_e) => {
                console.log(_e);
              });
            }
          }
          await pp.query(
            "update personnel set birth_certificate_url =? where id = ?",
            [
              "/api/image/personnel/" + birth_cert_file.filename,
              req.body.id,
            ]
          );
        }

        if (army_service_file) {
          if (req.body.army_service_file) {
            var file = req.body.army_service_file_old.split("/");
            if (file.length == 5) {
              fs.unlink("./_uploads/personnel/" + file[4], (_e) => {
                console.log(_e);
              });
            }
          }
          await pp.query("update personnel set army_service_card_url =? where id = ?",
            [
              "/api/image/personnel/" + army_service_file.filename,
              req.body.id,
            ]
          );
        }

        if (person_file) {
          if (req.body.person_file) {
            var file = req.body.person_file_old.split("/");
            if (file.length == 5) {
              fs.unlink("./_uploads/personnel/" + file[4], (_e) => {
                console.log(_e);
              });
            }
          }
          await pp.query("update personnel set image_url =? where id = ?", [
            "/api/image/personnel/" + person_file.filename,
            req.body.id,
          ]);
        }

        if (sign_file) {
          if (req.body.sign_file) {
            var file = req.body.sign_file.split("/");
            if (file.length == 5) {
              fs.unlink("./_uploads/personnel/" + file[4], (_e) => {
                console.log(_e);
              });
            }
          }
          await pp.query("update personnel set sign_url =? where id = ?", [
            "/api/image/personnel/" + sign_file.filename,
            req.body.id,
          ]);
        }

        //delete previous subordinates
        // await pp.query(
        //   "delete from personnel_subordinate where personnel_id_fk = ?",
        //   [req.body.id]
        // );
        //subordinates

        var subordinates = JSON.parse(req.body.subordinates);


        if (subordinates.length > 0) {
          for (let i = 0; i < subordinates.length; i++) {
            //check if available
            const [subordinate] = await pp.query('select * from personnel_subordinate where id=?', [subordinates[i].id]);
            if (subordinate.length > 0) {
              await pp.query('update personnel_subordinate set relation=?, national_code=?, first_name=?, last_name=?, father_name=?, id_number=?, birth_date=?, issue_place=?, personnel_id_fk=?, sponsorship_status=?, insurance_number=?, exit_sponsor_reason=?, exit_sponsor_date=? where id=?', [
                subordinates[i].rel,
                subordinates[i].national_id,
                subordinates[i].first_name,
                subordinates[i].last_name,
                subordinates[i].father_name,
                subordinates[i].national_number,
                subordinates[i].birth_day,
                subordinates[i].birth_day_place,
                req.body.id,
                subordinates[i].sponsorship_status,
                subordinates[i].insurance_number,
                subordinates[i].exit_sponsor_reason,
                subordinates[i].exit_sponsor_date,
                subordinates[i].id
              ]);
            }
            else {
              await pp.query("insert into personnel_subordinate (relation, national_code, first_name, last_name, father_name, id_number, birth_date, issue_place, personnel_id_fk, sponsorship_status, insurance_number, exit_sponsor_reason, exit_sponsor_date) values (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)",
                [
                  subordinates[i].rel,
                  subordinates[i].national_id,
                  subordinates[i].first_name,
                  subordinates[i].last_name,
                  subordinates[i].father_name,
                  subordinates[i].national_number,
                  subordinates[i].birth_day,
                  subordinates[i].birth_day_place,
                  req.body.id,
                  subordinates[i].sponsorship_status,
                  subordinates[i].insurance_number,
                  subordinates[i].exit_sponsor_reason,
                  subordinates[i].exit_sponsor_date
                ]
              );
            }

          }
        }
        //end of subordinates

        //permissions
        if (req.body.permissions) {

          //delete previous permissions

          //permission
          var obj = JSON.parse(req.body.permissions);



          for (let i = 0; i < obj.length; i++) {
            //delete previous items
            await pp.query('delete from personnel_access where personnel_id_fk = ? and contract_id_fk = ?', [
              req.body.id,
              obj[i].contract_id
            ]);

            var item = obj[i];
            for (let j = 0; j < item.permissions.length; j++) {
              await pp.query('insert into personnel_access (personnel_id_fk, access, company_id_fk, contract_id_fk) values (?,?,?,?)', [
                req.body.id,
                item.permissions[j],
                item.company_id,
                item.contract_id
              ]);
            }
          }
        }
        //end of permissions

        res.status(200).send("done");
      } catch (err) {
        console.log(err);
        res
          .status(403)
          .send(
            "خطایی در ویرایش اطلاعات رخ داده است. لطفا به مدیر سامانه گزارش دهید"
          );
      }
    } else {
      res.status(403).send("incomplete request");
    }
  }
  );

  app.get("/api/admin/personnel/list/:id/:cid", auth.isInRoles('person/list'), async (req, res) => {


    var user = req.user;
    var condition = '';
    let size = 20;
    let page = 1;
    let sort = null;
    let total = 0;
    let filter = '';

    if (req.query.page) {
      page = Number(req.query.page);
    }

    if (req.query.size) {
      size = Number(req.query.size);
    }

    var arr = [];
    if (req.params.id != -1) {
      arr.push(req.params.id);
    }
    if (req.params.cid != -1) {
      arr.push(req.params.cid);
    }

    if (arr.length > 1) {
      condition = `where company_id_fk = ${arr[0]} and contract_id_fk = ${arr[1]}`;
    }
    else if (arr.length == 1) {
      if (req.params.id != -1) {
        condition = `where company_id_fk = ${req.params.id}`;
      }
      else if (req.params.cid != -1) {
        condition = `where contract_id_fk = ${req.params.cid}`;
      }
    }


    if (req.query.filter && req.query.fvalue) {
      switch (req.query.filter) {
        case 'contract_subject':
          filter = `t2.subject LIKE '%${req.query.fvalue}%'`;
          break;
        case 'company_name':
          filter = `t3.name LIKE '%${req.query.fvalue}%'`;
          break;
        default:
          filter = `t1.${req.query.filter} LIKE N'%${req.query.fvalue}%' or t1.${req.query.filter} LIKE N'%${req.query.fvalue.replace(/ی/g, 'ي')}%'`;
          break;
      }
    }

    if (user.super) {

      let cmd = '';

      if (condition.startsWith('where') && filter != '') {
        condition += ` and ${filter}`;
      }
      else {
        if (filter != '') {
          condition = `where ${filter}`;
        }

      }



      cmd = `select t2.subject as contract_subject, t3.name as company_name, t1.id, t1.contract_id_fk as contract_id, t1.first_name, t1.last_name, t1.mobile1, t1.father_name, t1.national_number, t1.insurance_number, t1.id_number, t1.birth_date, t1.image_url from personnel as t1 left join contract as t2 on t1.contract_id_fk = t2.id left join company as t3 on t1.company_id_fk = t3.id ${condition} `;


      if (req.query) {
        if (req.query.sort) {
          cmd += ` order by ${req.query.sort} ${req.query.stype}`;
        }

        if (req.query.page && req.query.size) {
          let offset = (page - 1) * size;
          offset = offset < 0 ? 0 : offset;

          //count total
          const [totalCounter] = await pp.query(`select COUNT(t1.id) as count from personnel as t1 left join contract as t2 on t1.contract_id_fk = t2.id left join company as t3 on t1.company_id_fk = t3.id ${condition}`);
          total = totalCounter[0].count;
          cmd += ` limit ${size} offset ${offset}`;
        }
      }

      var cmdHash = crypt.encrypt(cmd);
      cmdHash = cmdHash.toString().replace(/\//g, '__');
      var [list] = await pp.query(cmd);

      res.status(200).send({
        list: list,
        total: total,
        export: cmdHash
      });
    } else {


      var cmd = '';
      var condCounter = 0;
      if (req.params.id != -1) { condCounter++; }
      if (req.params.cid != -1) { condCounter++; }

      if (req.query.filter && req.query.fvalue) {
        switch (req.query.filter) {
          case 'contract_subject':
            filter = ` and t2.subject='${req.query.fvalue}'`;
            break;
          case 'company_name':
            filter = ` and t3.name='${req.query.fvalue}'`;
            break;
          case 'contract_id':
            filter = ` and t1.contract_id_fk='${req.query.fvalue}'`;
            break;
          default:
            filter = ` and t1.${req.query.filter}='${req.query.fvalue}'`;
            break;
        }
      }

      if (condCounter == 1) {
        if (req.params.id != -1) {
          cmd = `select t3.name as company_name, t2.subject as contract_subject,t1.image_url, t1.id, t1.contract_id_fk as contract_id,t1.birth_date, t1.first_name, t1.last_name, t1.mobile1, t1.father_name, t1.national_number from personnel as t1 left join contract as t2 on t1.contract_id_fk = t2.id left join company as t3 on t1.company_id_fk = t3.id where t1.company_id_fk = ${req.params.id} ${filter}`;
        }
        else if (req.params.cid != -1) {
          cmd = `select t2.subject as contract_subject, t3.name as company_name, t1.id, t1.image_url, t1.birth_date, t1.contract_id_fk as contract_id, t1.first_name, t1.last_name, t1.mobile1, t1.father_name, t1.national_number from personnel as t1 left join contract as t2 on t1.contract_id_fk = t2.id left join company as t3 on t1.company_id_fk = t3.id  where t1.contract_id_fk = ${req.params.cid} ${filter}`;
        }
      }
      else if (condCounter == 0) { //all are -1 and must check the access and roles
        var [access] = await pp.query(`select * from personnel_access where personnel_id_fk = ${req.user.id} and access='person/list'`);
        var companyAccess = [];
        var contractAccess = [];

        access.forEach(item => {
          companyAccess.push(item.company_id_fk);
          contractAccess.push(item.contract_id_fk);
        });

        var cmd = `select t2.subject as contract_subject, t3.name as company_name, t1.id, t1.image_url,  t1.contract_id_fk as contract_id, t1.birth_date,  t1.first_name, t1.last_name, t1.mobile1, t1.father_name, t1.national_number from personnel as t1 left join contract as t2 on t1.contract_id_fk = t2.id left join company as t3 on t1.company_id_fk = t3.id  where (t1.company_id_fk IN (${companyAccess.toString()}) or t1.contract_id_fk IN (${contractAccess.toString()})) ${filter}`;
      }
      else {
        cmd = `select t2.subject as contract_subject, t3.name as company_name,t1.image_url, t1.id, t1.birth_date,  t1.contract_id_fk as contract_id, t1.first_name, t1.last_name, t1.mobile1, t1.father_name, t1.national_number from personnel as t1 left join contract as t2 on t1.contract_id_fk = t2.id left join company as t3 on t1.company_id_fk = t3.id  where t1.company_id_fk = ${req.params.id} and t1.contract_id_fk=${req.params.cid} ${filter}`;
      }

      if (req.query.sort) {
        cmd += ` order by ${req.query.sort} ${req.query.stype}`;
      }


      if (req.query) {
        if (req.query.page && req.query.size) {
          let offset = (page - 1) * size;
          offset = offset < 0 ? 0 : offset;

          //count total
          let index = cmd.length;
          if (cmd.indexOf('order') > -1) {
            index = cmd.indexOf('order');
          }
          const totalCounterCMD = cmd.substring(cmd.indexOf('from'), index);
          const [totalCounter] = await pp.query(`select count(t1.id) as count ${totalCounterCMD}`);
          total = totalCounter[0].count;

          cmd += ` limit ${size} offset ${offset}`;
        }
      }


      var cmdHash = crypt.encrypt(cmd);


      cmdHash = cmdHash.toString().replace(/\//g, '__');
      var [list] = await pp.query(cmd);


      res.status(200).send({
        list: list,
        total: total,
        export: cmdHash
      });

    }
  });



  var bimehStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './_uploads/personnel/dbf')
    },
    filename: function (req, file, cb) {
      cb(null, `${moment().utc(true).format('YYMMDDHHmmss')}.dbf`);
    }
  })
  var bimehMulter = multer({ storage: bimehStorage });
  app.post("/api/admin/personnel/dbf",
    auth.authorized,
    bimehMulter.single("dbf_file"),
    async (req, res, next) => {
      if (req.body.company_id) {
        var records = null;
        try {
          if (req.file) {
            var dbfFile = await DBFFile.open(
              `${req.file.destination}/${req.file.filename}`
            );
            records = await dbfFile.readRecords();
          } else {
            res.status(403).send("incomplete request");
            return;
          }
        } catch (err) {
          console.log(err);
          res.status(403).send(err);
          return;
        } finally {
          //delete file
          fs.unlink(req.file.path, (delete_error) => {
            if (delete_error) {
              console.log(delete_error);
            } else {
              console.log("file deleted");
            }
          });
        }

        if (records != null) {
          var successCounters = 0;
          var totalRecords = 0;
          for (let record of records) {

            try {
              var first_name,
                last_name,
                father_name,
                id_number,
                insurance_number,
                birth_date,
                sex,
                origin,
                national_code,
                job_code;

              first_name = await bimehHelper.convert(record.DSW_FNAME);
              last_name = await bimehHelper.convert(record.DSW_LNAME);
              father_name = await bimehHelper.convert(record.DSW_DNAME);
              id_number = await bimehHelper.convert(record.DSW_IDNO);
              insurance_number = record.DSW_ID1;
              birth_date = jmoment(record.DSW_BDATE, "jYY/jMM/jDD")
                .utc(true)
                .format("YYYY/MM/DD 00:00:00");
              sex = await bimehHelper.convert(record.DSW_SEX);
              origin = await bimehHelper.convert(record.DSW_NAT);
              national_code = record.PER_NATCOD;
              var password = await crypt.encrypt(national_code);
              job_code = record.DSW_JOB;
              id_number = id_number.split("").reverse().join("");

              var birthPlace = await codeMelli.findPlaceOfBirth(national_code.substr(0, 3));

              //duplicate check
              var [count] = await pp.query('select id from personnel where national_number=?', [national_code]);
              if (count.length == 0) {
                //insert process
                await pp.query(
                  "insert into personnel (first_name, last_name, father_name, id_number, sex, nation, password, data_approved, national_number, company_id_fk, isargar, birth_date, marital_status, army_service, education, insurance_number, job_title, birth_place, id_issue_place, contract_id_fk, insurance_share_employee, insurance_share_employer, insurance_share_unemployment, insurance_share_harmful) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    first_name,
                    last_name,
                    father_name,
                    id_number,
                    sex == "مرد" ? "m" : "f",
                    origin == 'ایرانی' ? 'iranian' : 'non_iranian',
                    password,
                    false,
                    national_code,
                    req.body.company_id,
                    'none',
                    birth_date,
                    'single',
                    null,
                    'unknown',
                    insurance_number,
                    job_code,
                    birthPlace,
                    birthPlace,
                    req.body.contract_id,
                    1,
                    1,
                    1,
                    0
                  ]
                );
                successCounters++;
              }

            } catch (err) {
              console.log(err);
              res
                .status(403)
                .send(
                  "خطایی رخ داده است. لطفا با مدیر سامانه پیگیری فرمایید"
                );
              return;
            } finally {
              totalRecords++;
            }
          }

          res.status(200).send({
            success: successCounters,
            total: totalRecords,
          });
        } else {
          res.status(403).send("فایل ارسال شده شناسایی نشد");
          return;
        }
      } else {
        res.status(403).send("incomplete request");
      }
    }
  );

  var excelStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './_uploads/personnel/excel')
    },
    filename: function (req, file, cb) {
      cb(null, `${moment().utc(true).format('YYMMDDHHmmss')}.xls`);
    }
  })
  var excelMulter = multer({ storage: excelStorage });
  app.post("/api/admin/personnel/excel", excelMulter.single("excel_file"), async (req, res, next) => {
    try {

      if (req.body.company_id) {
        if (req.file) {



          excelReader(req.file.path, {
            sheet: 1,
          }).then(async (rows) => {
            var successCount = 0;
            var password = crypt.encrypt("12345");



            for (let i = 1; i < rows.length; i++) {

              var national_code = rows[i][0] != null ? rows[i][0] : '';
              var first_name = rows[i][1] != null ? rows[i][1] : '';
              var last_name = rows[i][2] != null ? rows[i][2] : '';
              var father_name = rows[i][3] != null ? rows[i][3] : '';
              var id_number = rows[i][4] != null ? rows[i][4] : '';
              var birth_date = rows[i][5] != null ? rows[i][5] : '';
              var gender = rows[i][6] != null ? rows[i][6] : '';
              gender = gender == 1 ? 'm' : 'f';
              var origin = rows[i][7] != null ? rows[i][7] : '';
              origin = origin == '1' ? 'iranian' : 'non_iranian';
              var public_description = rows[i][8] != null ? rows[i][8] : '';
              var private_desc = rows[i][9] != null ? rows[i][9] : '';
              var insurance_number = rows[i][10] != null ? rows[i][10] : '';
              var job_code = rows[i][11] != null ? rows[i][11] : '';
              var marital_code = rows[i][12] != null ? rows[i][12] : '0'; //1=married, 0=single
              var army_service_code = rows[i][13] != null ? rows[i][13] : '0'; //0=unknown, 1=
              var personel_number = rows[i][14] != null ? rows[i][14] : '';
              var status_code = rows[i][15] != null ? rows[i][15] : ''; //1 enable - 0 disable
              status_code = status_code == '1' ? 'active' : 'inactive';
              var mobile = rows[i][16] != null ? rows[i][16] : '';
              var address = rows[i][17] != null ? rows[i][17] : '';
              var postal_code = rows[i][18] != null ? rows[i][18] : '';
              var telephone = rows[i][19] != null ? rows[i][19] : '';
              var email = rows[i][20] != null ? rows[i][20] : '';
              var bank_account = rows[i][21] != null ? rows[i][21] : '';
              var bank_name = rows[i][22] != null ? banks.bankName(rows[i][22]) : '';
              var placeOfBirth = await codeMelli_Helper.findPlaceOfBirth(national_code.substr(0, 3));


              //**validations
              //job title
              var job_title = await pp.query('select title from job_title where code = ?', [job_code]);

              //national code
              if (national_code.length != 10) {

                continue;
              }

              var [national_dup] = await pp.query('select id from personnel where national_number = ?', [national_code]);

              if (national_dup.length > 0) {
                continue;
              }
              //end of national code

              //username/password
              var password = crypt.encrypt(national_code);

              //birth year
              var g_birthdate = '';
              var year = birth_date.toString().substr(0, 4);
              var month = birth_date.toString().substr(4, 2);
              var day = birth_date.toString().substr(6, 2);

              g_birthdate = jmoment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY/MM/DD 00:00:00');

              if (parseInt(year) > 1368) {
                id_number = national_code;
              }

              //insurance number
              if (insurance_number.length > 8) {
                continue;
              }

              if (insurance_number.toString().startsWith('00')) {
                continue
              }
              ///////////////

              //mobile duplication
              if (mobile) {
                if (mobile != '') {
                  var [mob_dup] = await pp.query('select id from personnel where mobile1 = ? or mobile2=?', [mobile, mobile]);
                  if (mob_dup.length > 0) {
                    continue;
                  }
                }
              }

              //check name
              if (first_name == '' || last_name == '') {
                continue;
              }

              //postal code
              if (postal_code.length != 10) {
                //continue; //must be checked
              }


              var army = '';
              switch (army_service_code.toString()) {
                case '0':
                  army = 'unknown';
                  break
                case '1':
                  army = 'army_done';
                  break;
                case '2':
                  army = 'medical';
                  break;
                case "3":
                  army = 'sponsorship';
                  break;
                case '4':
                  army = 'educational';
                  break;
                case '5':
                  army = 'none';
                  break;
                case '6':
                  army = 'purchased';
                  break
                case '7':
                  army = 'in_progress';
                  break;
                default:
                  army = 'error';
                  break
              }
              /* insert into database */
              var cmd = `insert into personnel (birth_date, national_number, first_name, last_name, father_name, id_number, sex, nation, public_description, private_description, password, marital_status, army_service, job_title, insurance_number, personnel_id, job_status, mobile1, phone, email, bank_account1, bank_name1, data_approved, address, postal_code, company_id_fk, birth_place, id_issue_place, contract_id_fk, isargar) values (
                    '${g_birthdate}',
                    '${national_code}',
                    '${first_name}',
                    '${last_name}',
                    '${father_name}',
                    '${id_number}',
                    '${gender}',
                    '${origin}',
                    '${public_description}',
                    '${private_desc}',
                    '${password}',
                    '${marital_code == '1' ? 'married' : 'single'}',
                    '${army}',
                    '${job_code}',
                    '${insurance_number}',
                    '${personel_number}',
                    '${status_code}',
                    '${mobile}',
                    '${telephone}',
                    '${email}',
                    '${bank_account}',
                    '${bank_name}',
                    '0',
                    '${address}',
                    '${postal_code}',
                    '${req.body.company_id}',
                    '${placeOfBirth}',
                    '${placeOfBirth}',
                    '${req.body.contract_id}',
                    'none'
                    );`;

              await pp.query(cmd);
              successCount++;
            }


            res.status(200).send({
              success: successCount,
              total: rows.length - 1,
            });

            //delete file
            if (req.file) {
              fs.unlink(req.file.path, (err) => {
                if (err) {
                  console.log('deleting file : ', err);
                }
              });
            }



          });
        } else {
          res.status(403).send("incomplete request");
        }
      } else {
        res.status(403).send("incomplete request");
      }
    } catch (ex) {
      res.status(403).send("خطایی رخ داده است");
      return;
    }
  }
  );



  app.post("/api/admin/subordinate/excel", auth.authorized, excelMulter.single('excel_file'), async (req, res, next) => {
    try {
      if (req.file) {

        excelReader(req.file.path, {
          sheet: 1
        }).then(async (rows) => {
          var successCount = 0;


          for (let i = 1; i < rows.length; i++) {

            let updateFatherName = false;
            let married = false;

            const natioanlCode = rows[i][0];
            const firstName = rows[i][1];
            const lastName = rows[i][2];
            const fatherName = rows[i][3];
            const shenasname = rows[i][4];
            const birthDateFarsi = rows[i][5];
            const parentNationalCode = rows[i][8];
            let relation = '';
            const sponsershipStatus = rows[i][11].toString() == '1' ? 'under_the_tutelage' : 'non_dependent';


            const issuePlace = await codeMelli_Helper.findPlaceOfBirth(natioanlCode.substr(0, 3));



            //relation
            switch (rows[i][10].toString()) {
              case '2':
                relation = 'wife';
                married = true;
                break;
              case '3':
                relation = 'brother';
                break;
              case '4':
                relation = 'sister';
                break;
              case '5':
                relation = 'father';
                updateFatherName = true;
                break;
              case '6':
                relation = 'mother';
                break;
              case '7':
                relation = 'son';
                married = true;
                break;
              case '8':
                relation = 'daughter';
                married = true;
                break;
              default:
                relation = 'unknown';
                break;
            }


            //check if parent is available
            const [personnel] = await pp.query('select id from personnel where national_number=?', [parentNationalCode]);



            if (personnel.length == 1) {

              console.log(married);

              //update father name
              if (updateFatherName) {
                await pp.query('update personnel set father_name = ? where id=?', [
                  firstName,
                  personnel[0].id
                ]);
              }


              if (married) {
                console.log(personnel[0]);
                await pp.query('update personnel set marital_status = ? where id=?', [
                  'married',
                  personnel[0].id
                ]);
              }

              //birthdate
              //birth year
              var gBirthdate = '';
              var year = birthDateFarsi.toString().substr(0, 4);
              var month = birthDateFarsi.toString().substr(4, 2);
              var day = birthDateFarsi.toString().substr(6, 2);

              gBirthdate = jmoment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY/MM/DD 00:00:00');

              //check for duplication
              const [dup] = await pp.query('select id from personnel_subordinate where national_code = ?', [natioanlCode]);

              if (dup.length == 0) {
                //insert into database
                const cmd = `insert into personnel_subordinate (personnel_id_fk, first_name, last_name, relation, national_code, sponsorship_status, father_name, id_number, birth_date, issue_place) values
                (
                  ${personnel[0].id},
                  '${firstName}',
                  '${lastName}',
                  '${relation}',
                  '${natioanlCode}',
                  '${sponsershipStatus}',
                  '${fatherName}',
                  '${shenasname}',
                  '${gBirthdate}',
                  '${issuePlace}'
                )
                `;



                await pp.query(cmd);

                successCount++;
              }

            }
          }

          res.status(200).send({
            success: successCount
          })
          if (req.file) {
            fs.unlink(req.file.path, (err) => {

              if (err == null) {
                console.log("excel file deleted");
              }
            });
          }

        })
          .catch(err => {
            res.status(403).send('error occured');
          });
      }
      else {
        res.status(403).send('no such file');
      }
    }
    catch (err) {

      res.status(403).send('error occured');
    }
  });


  app.post('/api/admin/personnel/tamin/dbf', auth.authorized, bimehMulter.single("dbf_file"), async (req, res, next) => {

    if (req.body.insurance_id) {
      var records = null;
      try {
        if (req.file) {
          var dbfFile = await DBFFile.open(
            `${req.file.destination}/${req.file.filename}`
          );
          records = await dbfFile.readRecords();
        } else {
          res.status(403).send("incomplete request");
          return;
        }
      } catch (err) {
        res.status(403).send(err);
        return;
      } finally {
        //delete file
        fs.unlink(req.file.path, (delete_error) => {


          if (delete_error) {
            console.log(delete_error);
          } else {
            console.log("file deleted");
          }
        });
      }

      var successCounters = 0;

      for (let record of records) {


        var personnelId = -1;

        if (personnelId == -1) {
          var [personnel] = await pp.query('select * from personnel where national_number = ?', [record.PER_NATCOD]);


          if (personnel.length == 0) {
            var first_name,
              last_name,
              father_name,
              id_number,
              insurance_number,
              birth_date,
              sex,
              origin,
              national_code,
              job_code;

            first_name = await bimehHelper.convert(record.DSW_FNAME);
            last_name = await bimehHelper.convert(record.DSW_LNAME);
            father_name = await bimehHelper.convert(record.DSW_DNAME);
            id_number = await bimehHelper.convert(record.DSW_IDNO);
            insurance_number = record.DSW_ID1;
            birth_date = jmoment(record.DSW_BDATE, "jYYYY/jMM/jDD")
              .utc(true)
              .format("YYYY/MM/DD 00:00:00");
            sex = await bimehHelper.convert(record.DSW_SEX);
            origin = await bimehHelper.convert(record.DSW_NAT);
            national_code = record.PER_NATCOD;
            var password = await crypt.encrypt(national_code);
            job_code = record.DSW_JOB;
            id_number = id_number.split("").reverse().join("");

            var birthPlace = await codeMelli.findPlaceOfBirth(national_code.substr(0, 3));

            const personnelInsert = await pp.query(
              "insert into personnel (first_name, last_name, father_name, id_number, sex, nation, password, data_approved, national_number, company_id_fk, isargar, birth_date, marital_status, army_service, education, insurance_number, job_title, birth_place, id_issue_place, contract_id_fk, insurance_share_employee, insurance_share_employer, insurance_share_unemployment, insurance_share_harmful) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                first_name,
                last_name,
                father_name,
                id_number,
                sex == "مرد" ? "m" : "f",
                origin == 'ایرانی' ? 'iranian' : 'non_iranian',
                password,
                false,
                national_code,
                req.body.company_id,
                'none',
                birth_date,
                'single',
                null,
                'unknown',
                insurance_number,
                job_code,
                birthPlace,
                birthPlace,
                req.body.contract_id,
                1,
                1,
                1,
                0
              ]
            );
            personnelId = personnelInsert[0].insertId;
          }
          else {
            personnelId = personnel[0].id;
          }
        }

        //dates
        let fromDate = ''
        let toDate = '';

        if (record.DSW_SDATE != '') {
          const pDate = jalali(record.DSW_SDATE, 'jYYYY/jM/jD');
          fromDate = pDate.format('YYYY/MM/DD 00:00:00');
        }

        if (record.DSW_EDATE != '') {
          const pDate = jalali(record.DSW_EDATE, 'jYYYY/jM/jD');
          toDate = pDate.format('YYYY/MM/DD 00:00:00');
        }
        //get job id
        let jobId = -1;

        const [job] = await pp.query('select id from job_title where code = ?', [record.DSW_JOB]);

        jobId = job.length == 1 ? job[0].id : 0;

        //insert insurance_tamin -> check duplicates
        const [tamin_dup] = await pp.query('select id from insurance_tamin_personnel where insurance_tamin_id_fk=? and personnel_id_fk=?', [
          req.body.insurance_id,
          personnelId
        ])


        if (tamin_dup.length == 0) {
          //must insert
          await pp.query('insert into insurance_tamin_personnel (insurance_tamin_id_fk, personnel_id_fk, start_date, end_date, total_work_day, daily_salary, monthly_salary, include_benefit, salary_benefit_include, salary_benefit_include_notinclude, insured_share, employer_share, jobless_share, hard_job_share, total_share, job_id_fk, description) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            req.body.insurance_id,
            personnelId,
            fromDate == '' ? null : fromDate,
            toDate == '' ? null : toDate,
            record.DSW_DD,
            record.DSW_ROOZ,
            record.DSW_MAH,
            record.DSW_MAZ,
            Math.ceil(Number(record.DSW_MAH).toFixed(2)) + Math.ceil(Number(record.DSW_MAZ).toFixed(2)), //salary benefit include
            Math.ceil(Number(record.DSW_TOTL).toFixed(2)), //salary benefit inc not inc
            Math.ceil((Number(record.DSW_MASH) * 0.07).toFixed(2)), //insured share
            Math.ceil((Number(record.DSW_MASH) * 0.20).toFixed(2)), //employer share
            Math.ceil((Number(record.DSW_MASH) * 0.03)), //jobless share
            0, //hard job share
            Math.ceil((Number(record.DSW_MASH) * 0.07).toFixed(2)) + Math.ceil((Number(record.DSW_MASH) * 0.20).toFixed(2)) + Math.ceil((Number(record.DSW_MASH) * 0.03).toFixed(2)), //total_share
            jobId,
            'وارد شده از طریق فایل گروهی'
          ]);
          successCounters++;
        }
      }

      res.status(200).send({
        success: successCounters
      });
    }
    else {
      res.status(403).send('incomplete request');
    }

  });


  app.post('/api/admin/personnel/search/byname', async (req, res) => {
    try {
      var [list] = await pp.query('select * from personnel where first_name =? or last_name=? or father_name = ?', [
        req.body.first_name,
        req.body.last_name,
        req.body.father_name
      ]);
      res.status(200).send(list);
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  })


  app.get("/api/admin/personnel/lookup/:id",
    auth.authorized,
    async (req, res) => {
      var [
        user,
      ] = await pp.query(
        "select id, first_name, last_name , job_title as job_code, insurance_number from personnel where national_number = ?",
        [req.params.id]
      );
      if (user.length > 0) {
        var [job] = await pp.query('select * from job_title where id=?', [user[0].job_code]);

        res.status(200).send({
          id: user[0].id,
          first_name: user[0].first_name,
          last_name: user[0].last_name,
          mobile1: user[0].mobile1,
          mobile2: user[0].mobile2,
          job_title: job.length == 1 ? job[0].title : null,
          job_code: job.length == 1 ? job[0].code : null,
          job_id: job.length == 1 ? job[0].id : null,
          insurance_number: user[0].insurance_number
        });
      } else {
        res.status(403).send("کد ملی وارد شده در سامانه ثبت نشده است");
      }
    }
  );

  app.get('/api/admin/personnel/lookup-in-contract/:nationalId/:contractId', auth.authorized, async(req, res) => {
    try{
      const [user] = await pp.query(
        "select id, first_name, last_name , job_title as job_code, insurance_number from personnel where national_number = ? and contract_id_fk = ?",
        [req.params.nationalId, req.params.contractId]);

        if (user.length > 0) {
          var [job] = await pp.query('select * from job_title where id=?', [user[0].job_code]);

          res.status(200).send({
            id: user[0].id,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            mobile1: user[0].mobile1,
            mobile2: user[0].mobile2,
            job_title: job.length == 1 ? job[0].title : null,
            job_code: job.length == 1 ? job[0].code : null,
            job_id: job.length == 1 ? job[0].id : null,
            insurance_number: user[0].insurance_number
          });
        } else {
          res.status(403).send("کد ملی وارد شده در سامانه ثبت نشده است");
        }
    }
    catch(err){
      res.status(400).send(err.toString());
    }
  });

  app.put('/api/admin/personnel/add/insurance/:personnel_id', auth.authorized, async (req, res) => {
    try {
      if (req.body.insurance_number) {
        await pp.query('update personnel set insurance_number=? where id=?', [
          req.body.insurance_number,
          req.params.personnel_id
        ]);
        res.status(200).send('done');
      }
      else {
        res.status(403).send('incomplete request');
      }
    }
    catch (err) {
      res.status(403).send('error occoured');
    }
  })

  app.put('/api/admin/personnel/add/job/:personnel_id', auth.authorized, async (req, res) => {

    try {
      await pp.query('update personnel set job_title=? where id=?', [
        req.body.job_id,
        req.params.personnel_id
      ]);
      res.status(200).send('done');
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  })

  app.get("/api/admin/personnel/lookup/insurance/:number",
    auth.authorized,
    async (req, res) => {
      var [
        user,
      ] = await pp.query(
        "select id, first_name, last_name from personnel where insurance_number = ?",
        [req.params.number]
      );
      if (user.length > 0) {
        res.status(200).send({
          id: user[0].id,
          first_name: user[0].first_name,
          last_name: user[0].last_name,
          mobile1: user[0].mobile1,
          mobile2: user[0].mobile2,
        });
      } else {
        res.status(403).send("شماره بیمه وارد شده در سامانه ثبت نشده است");
      }
    }
  );

  app.get("/api/admin/personnel/lookup/mobile/:number",
    auth.authorized,
    async (req, res) => {
      var [
        user,
      ] = await pp.query(
        "select id from personnel where mobile1 = ? or mobile2 = ?",
        [req.params.number, req.params.number]
      );
      if (user.length > 0) {
        res.status(403).send("mobile exists");
      } else {
        res.status(200).send("mobile is not exists");
      }
    }
  );

  app.get('/api/admin/personnel/lookup/codemelli/:code', async (req, res) => {
    try {
      var [user] = await pp.query('select id, first_name, last_name from personnel where national_number = ?', [req.params.code]);
      if (user.length == 1) {
        res.status(200).send(user[0]);
      }
      else {
        res.status(403).send('user not found');
      }
    }
    catch (err) {
      res.status(403).send(err);
    }
  })


  app.delete("/api/admin/personnel/delete", auth.isInRoles('person/delete'), async (req, res) => {
    if (req.body.data) {
      try {
        var array = req.body.data.map((x) => {
          return parseInt(x, 10);
        });

        const output = [];

        for (let i = 0; i < array.length; i++) {
          const depends = [];
          const m = {}
          if (array[i] != req.user.id) {
            let allowToDelete = true;

            //check dependecies
            const [damage_service] = await pp.query('select id from damage_service where personnel_id_fk=?', [array[i]]);
            if (damage_service.length > 0) {
              allowToDelete = false;
              depends.push('خدمات خسارت');
            }



            const [timeoff] = await pp.query('select id from personnel_timeoff where personnel_id_fk=?', [array[i]]);
            if (timeoff.length > 0) {
              allowToDelete = false;
              depends.push('مرخصی');
            }


            const [incident] = await pp.query('select id from incident_personnel where personnel_id_fk=?', [array[i]]);
            if (incident.length > 0) {
              allowToDelete = false;
              depends.push('حوادث');
            }



            const [imprest] = await pp.query('select id from imprest where personnel_id_fk=?', [array[i]]);
            if (imprest.length > 0) {
              allowToDelete = false;
              depends.push('مساعده');
            }


            const [mission] = await pp.query('select id from personnel_mission where personnel_id_fk=?', [array[i]]);
            if (mission.length > 0) {
              allowToDelete = false;
              depends.push('ماموریت');
            }


            const [ins_takmili] = await pp.query('select id from insurance_takmili_personnel where personnel_id_fk=?', [array[i]]);
            if (ins_takmili.length > 0) {
              allowToDelete = false;
              depends.push('بیمه تکمیلی');
            }

            const [ins_history] = await pp.query('select id from insurance_history_claim where personnel_id_fk=?', [array[i]]);
            if (ins_history.length > 0) {
              allowToDelete = false;
              depends.push('ادعای سابقه');
            }

            const [ins_omr] = await pp.query('select id from insurance where personnel_id_fk=? and type=?', [array[i], 'عمر و حادثه']);
            if (ins_omr.length > 0) {
              allowToDelete = false;
              depends.push('بیمه عمر و حادثه');
            }

            const [settle] = await pp.query('select id from settle where personnel_id_fk=?', [array[i]]);
            if (settle.length > 0) {
              allowToDelete = false;
              depends.push('تقاضای تسویه حساب');
            }

            const [tamin] = await pp.query('select id from insurance_tamin_personnel where personnel_id_fk=?', [array[i]]);
            if (tamin.length > 0) {
              allowToDelete = false;
              depends.push('بیمه تامین اجتماعی');
            }

            const [visit] = await pp.query('select id from doctor_visit where personnel_id_fk=?', [array[i]]);
            if (visit.length > 0) {
              allowToDelete = false;
              depends.push('معاینات پزشکی');
            }




            if (allowToDelete) {
              await pp.query("delete from personnel where id = ?", [
                array[i]
              ]);
            }

            m.depends = depends;
            m.id = array[i];
            output.push(m);
          }
        }
        res.status(200).send({
          output
        });
      } catch (ex) {
        console.log(ex);
        res.status(403).send("error occured");
      }
    } else {
      res.status(403).send("incomplete request");
    }
  }
  );

  app.delete("/api/admin/personnel/subordinate/delete", auth.isInRoles('person/delete'), async (req, res) => {
    try {
      if (req.body.ids) {
        const arr = req.body.ids;
        const output = [];

        for (let i = 0; i < arr.length; i++) {
          const allowToDelete = true;
          const [takmili] = await pp.query('select id from insurance_takmili_subordinate where subordinate_id_fk=?', [arr[i]]);
          if (takmili.length > 0) {
            allowToDelete = false;
          }


          if (allowToDelete) {
            await pp.query('delete from personnel_subordinate where id=?', [arr[i]]);
          }
          else {
            output.push({
              depends: 'بیمه تکمیلی',
              id: arr[i]
            });
          }
        }
        res.status(200).send(output);
      }
       else {
         res.status(400).send('incomplete request');
       }
    }
    catch (err) {
      throw err;
    }
  })

  app.post('/api/admin/personnel/service', auth.authorized, async (req, res) => {
    try {

      if (req.body.type && req.body.personnel_id) {
        const cmd = `insert into damage_service (personnel_id_fk, type, date, description, type_service_damage, type_reward_penalty, amount_reward_penalty, hr_approved, project_admin_approved, hr_admin_approved, manager_approved) values ('${req.body.personnel_id}', '${req.body.type}', '${req.body.date}', '${req.body.description}', '${req.body.type_service_damage}', '${req.body.type_reward_penalty}', '${req.body.amount_reward_penalty}', '0', '0', '0', '0');`;
        await pp.query(cmd);
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

  app.put('/api/admin/personnel/service/:id', auth.authorized, async (req, res) => {
    try {
      if (req.body.type && req.body.personnel_id) {
        await pp.query('update damage_service set type =?, description=?, type_service_damage=?, type_reward_penalty=?, amount_reward_penalty=? where id=?', [
          req.body.type,
          req.body.description,
          req.body.type_service_damage,
          req.body.type_reward_penalty,
          req.body.amount_reward_penalty,
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

  app.delete('/api/admin/personnel/service/:id', auth.authorized, async (req, res) => {
    try {
      await pp.query('delete from damage_service where id=?', [req.params.id]);
      res.status(200).send('done');
    }
    catch (err) {
      res.status(403).send('error occured');
    }
  })

  app.get('/api/admin/personnel/service/:type/:company_id/:contract_id', auth.authorized, async (req, res) => {
    try {
      var condition = '';

      var cmd = `select t1.id, concat(t2.first_name, ' ', t2.last_name) as name, t2.national_number, t1.type_service_damage, t1.date, IF(t1.manager_approved = 1 , 'تایید نهایی', IF(t1.hr_admin_approved = 1, 'تایید مدیر منابع انسانی', IF(t1.project_admin_approved = 1, 'تایید مدیر پروژه', IF(hr_approved = 1, 'تایید منابع انسانی', 'هنوز به تایید هیچ بخشی نرسیده')))) as status from damage_service as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.type = '${req.params.type}' {condition} order by t1.id asc`;

      if (req.params.company_id != '-1') {
        condition += `and t2.company_id_fk in (${req.params.company_id}) `
      }

      if (req.params.contract_id != '-1') {
        condition += `and t2.contract_id_fk in (${req.params.contract_id})`;
      }


      cmd = cmd.replace('{condition}', condition);


      const hash = await crypt.encrypt(cmd);
      var [list] = await pp.query(cmd);
      res.status(200).send({
        list: list,
        export: hash
      });
    }
    catch (err) {
      console.log(err);
      res.status(403).send(err);
    }
  });


  app.get("/api/admin/personnel/:id", auth.authorized, async (req, res) => {
    try {

      var [person] = await pp.query(
        "select contract.id as contract_id, contract.subject, personnel.id, birth_date, national_number, first_name, last_name, father_name, id_number, sex, birth_place, id_issue_place, nation, public_description, private_description, image_url, marital_status, army_service, education, job_title, insurance_number, personnel_id, job_type, job_status, mobile1, mobile2, phone, email, bank_account1, sheba1, bank_name1, bank_account2, sheba2, bank_name2, bank_account3, sheba3, bank_name3, bank_account4, sheba4, bank_name4, bank_account5, sheba5, bank_name5, national_card_front_url, national_card_rear_url, birth_certificate_url, army_service_card_url, company_id_fk as company_id, address, sign_url, job_disable_description, DATE(job_disable_date) as job_disable_date, study_field, postal_code, contract_id_fk as contract_id, isargar, shahid_name, veteran_percentage, frontline_year, frontline_month, frontline_day, shahid_was_colleague, captivity_year, captivity_month, captivity_day, history_total_day, insurance_share_employee, insurance_share_employer, insurance_share_unemployment, insurance_share_harmful, DATE(employeement_date) as eployeement_date, DATE(contract_start_date) as contract_start_date, DATE(contract_end_date) as contract_end_date, employeement_type  from personnel left join contract on personnel.contract_id_fk = contract.id where personnel.id = ?",
        [req.params.id]
      );

      //check for private description access
      if (req.user.super == 0 && req.user.access.indexOf('person/privatedescription') == -1) {
        person[0].private_description = '*****';
      }
      if (person.length > 0) {
        var access = [];

        //person access

        //get contracts
        var [_list] = await pp.query('select company_id_fk, contract_id_fk from personnel_access where personnel_id_fk = ? group by contract_id_fk', [req.params.id]);

        for (let i = 0; i < _list.length; i++) {
          var [_access] = await pp.query('select * from personnel_access where personnel_id_fk = ? and contract_id_fk = ?', [req.params.id, _list[i].contract_id_fk]);

          var model = {
            company_id: _list[i].company_id_fk,
            contract_id: _list[i].contract_id_fk
          }
          var accessArray = [];
          for (let j = 0; j < _access.length; j++) {
            accessArray.push(_access[j].access);
          }
          model.permissions = accessArray
          access.push(model);
        }


        //job
        var [job] = await pp.query("select title, code from job_title where code=?", [
          person[0].job_title,
        ]);

        //company name
        var [company_info] = await pp.query("select * from company where id = ?", [person[0].company_id]);



        if (req.user.super == 1 || req.user.access.find(x => x.access == 'person/viewsubordinate') != null) {
          //subordinates

          var [subordinates] = await pp.query(
            "select id, personnel_id_fk,  first_name as name, last_name, relation,national_code as national_id, sponsorship_status, sponsor_description, DATE(sponsor_date) as sponsor_date, father_name, id_number as national_number, DATE(birth_date) as birth_day, issue_place as birth_day_place, DATE(exit_sponsor_date) as exit_sponsor_date, insurance_number, exit_sponsor_reason from personnel_subordinate where personnel_id_fk = ?",
            [person[0].id]
          );
          res.status(200).send({
            person: person[0],
            access: access,
            job: job[0],
            subordinates: subordinates,
            company: company_info.length > 0 ? company_info[0] : null,
          });
        }
        else {
          res.status(200).send({
            person: person[0],
            access: access,
            job: job[0],
            subordinates: 'no access',
            company: company_info.length > 0 ? company_info[0] : null,
          });
        }
      } else {
        res.status(403).send("شخص حقیقی در سامانه پیدا نشد");
      }
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }

  });


  var kosooratHoghooghStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './_uploads/personnel/excel')
    },
    filename: function (req, file, cb) {
      cb(null, `${moment().utc(true).format('YYMMDDHHmmss')}.xls`);
    }
  })
  var kosooratMulter = multer({ storage: kosooratHoghooghStorage })
  app.post('/api/admin/personnel/salary/deduct', kosooratMulter.single('file'), auth.authorized, async (req, res) => {
    try {
      if (req.file) {
        excelReader("./" + req.file.path, {
          sheet: 1,
        }).then(async (rows) => {
          var response = [];
          for (let i = 1; i < rows.length; i++) {
            var [person] = await pp.query('select * from personnel where national_number=?', [rows[i][0]]);
            if (person.length == 1) {
              await pp.query('insert into personnel_salary_deduction (personnel_id_fk, contract_code, period, insurance_amount) values (?,?,?,?)', [
                person[0].id,
                rows[i][1],
                rows[i][2],
                rows[i][3]
              ]);
              response.push({
                index: 1,
                message: 'ثبت شد'
              });
            }
            else {
              response.push({
                index: i,
                message: 'کد ملی معتبر نیست'
              });
            }
          }
          res.status(200).send(response);
        });
      }
      else {
        res.status(403).send('incomplete request');
      }
    }
    catch (err) {
      res.status(403).send('error occured');
    }
    finally {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err == null) {
            console.log("excel file deleted");
          }
        });
      }
    }
  })
})

