const auth = require('../../../../../middlewares/auth');
const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const crypt = require('../../../../../helpers/crypt');
const permissionHelper = require('../../../../../helpers/permissions');
const { DBFFile } = require('dbffile');
const bimehHelper = require('../../../../../helpers/bimeh');
const path = require('path');
const { send } = require('process');
const {isInRoleOfContract} = require('../../../../../helpers/useraccess');

module.exports = ((app) => {
    let pp = app.get('pool').promise();

    var storageLegal = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './_uploads/company');
        },
        filename: function (req, file, cb) {
            var ext = '';
            var allow = true;
            switch (file.mimetype) {
                case 'image/jpg':
                case 'image/jpeg':
                    ext = 'jpg';
                    break
                case 'image/png':
                    ext = 'png';
                    break;
                default:
                    ext = 'txt';
                    allow = false;
                    break
            }

            if (file.mimetype == 'image/png' && file.size > 80000) {
                cb('file is too big', null);
                return;
            }
            else if (file.size > 100000) {
                cb('file is too big', null);
                return;
            }

            if (allow) {
                var name = `${moment().format('YYMMDDHHmmSS')}.${ext}`;
                cb(null, name);
            }
            else {
                cb('invalid file type', null);
            }
        }
    });
    let uploadLegal = multer({
        storage: storageLegal,
        fileFilter: function(req, file, cb) { 
            switch(file.mimetype) {
                case 'image/jpg':
                case 'image/jpeg':
                case 'image/png':
                    cb(null, true);
                    break
                default:
                    cb('file not allowed', false);
            }
        }
    });

    var legalUpload = uploadLegal.fields([
        {
            name: 'logo',
            maxCount: 1
        },
        {
            name: 'sign',
            maxCount: 1
        },
        {
            name: 'seal',
            maxCount: 1
        }
    ])
    app.post("/api/admin/personnel/legal", auth.isInRoles('legal/insert'), (req, res) => {
      //حقوقی
      legalUpload(req, res, async (err) => {
        if (err) {
          console.log("error: " + err);
          switch (err) {
            case "file not allowed":
              res.status(403).send("فایل معتبر نمیباشد");
              break;
            case "file is too big":
              res.status(403).send("حجم فایل بیش از حد مجاز میباشد");
              break;
            default:
          }
        } else {
          if (
            req.body.name &&
            req.body.register_number &&
            req.body.register_date &&
            req.body.national_id
          ) {
            var [
              duplicate,
            ] = await pp.query(
              "select id from company where register_number = ? or national_id = ?",
              [req.body.register_number, req.body.national_id]
            );

            if (duplicate.length == 0) {
              
              var logoFile =
                req.files != null && req.files["logo"] != null ? req.files["logo"][0] : null;
              var signFile =
                req.files != null && req.files["sign"] != null ? req.files["sign"][0] : null;
              var sealFile =
                req.files != null && req.files["seal"] != null ? req.files["seal"][0] : null;

              try {
                var [insert] = await pp.query(
                  "insert into company (name, register_number, register_date, national_id, finance_code, manager_id_fk, logo_url, sign_owners, sign_url, seal_url, phone, address, postal_code, email, description, approved, is_group) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    req.body.name,
                    req.body.register_number == "undefined"
                      ? null
                      : req.body.register_number,
                    req.body.register_date,
                    req.body.national_id,
                    req.body.finance_code,
                    req.body.manager_id,
                    logoFile != null
                      ? `/api/image/company/${logoFile.filename}`
                      : null,
                    req.body.sign_owners,
                    signFile != null
                      ? `/api/image/company/${signFile.filename}`
                      : null,
                    sealFile != null
                      ? `/api/image/company/${sealFile.filename}`
                      : null,
                    req.body.phone,
                    req.body.address,
                    req.body.postal_code,
                    req.body.email,
                    req.body.description,
                    false,
                    req.body.is_group == 'true' ? 1 : 0
                  ]
                );

                
                //check for contract
                var [contract_dup] = await pp.query('select id from contract where contractor_id = ?', [ 
                  insert.insertId
                ]);
                if(contract_dup.length == 0) { 
                  await pp.query('insert into contract (type, date, employer, subject, start_date, end_date, contractor_id, contractor_type, can_delete) values (?,?,?,?,?,?,?,?,?)', [
                    'main_non_civil',
                    moment(req.body.register_date).utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.body.name,
                    'دفتر ستاد',
                    moment(req.body.register_date).utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    moment(req.body.register_date).utc(true).add(100, 'years').format('YYYY/MM/DD 23:59:59'),
                    insert.insertId,
                    'company',
                    0
                  ]);
                }
                

                res.status(201).send("done");
              } catch (ex) {
                
                res
                  .status(403)
                  .send(
                    "خطایی رخ داده. لطفا به مدیر سامانه این مشکل را گزارش دهید"
                  );
              }
            } else {
              res
                .status(403)
                .send("اطلاعات وارد شده قبلا در سامانه ثبت شده است");
            }
          } else {
            res.status(403).send("incomplete request");
          }
        }
      });
    });


    app.get("/api/admin/personnel/legal/list", auth.authorized,async (req, res) => {
      
        var user = req.user;
        if (user.super) {
          const cmd = 'select t2.first_name, t2.last_name, t2.national_number, t2.mobile1, t1.phone, t1.email, t1.address, t1.postal_code,  t1.id, t1.name, t1.register_number, t1.national_id, t1.register_date,  t1.logo_url, t1.finance_code from company as t1 left join personnel as t2 on t1.manager_id_fk = t2.id order by t1.id asc';
          var hash = crypt.encrypt(cmd);
          hash = hash.toString().replace(/\//g, '__');
          var [list] = await pp.query(cmd);

          res.status(200).send({
            list: list,
            export: hash
          });
        } else {
          var [_access] = await pp.query("select company_id_fk from personnel_access where personnel_id_fk = ? group by company_id_fk",
            [req.user.id]
          );
          var access = [];
          for (let i = 0; i < _access.length; i++) {
            access.push(_access[i].company_id_fk);
          }

          var cmd = `select t2.first_name, t2.last_name, t1.id, t1.name, t1.register_number, t1.national_id, t1.logo_url, t1.finance_code from company as t1 left join personnel as t2 on t1.manager_id_fk = t2.id order by t1.id asc`;

          
          var [list] = await pp.query(cmd);
          res.status(200).send({
            list: list,
          });
        }
      }
    );

    app.get("/api/admin/personnel/legal/:id",auth.authorized, async (req, res) => {

        var [company] = await pp.query("select name, register_number, DATE(register_date) as register_date, national_id, finance_code, manager_id_fk, logo_url, sign_owners, sign_url, seal_url, phone, address, postal_code, email, description, is_group from company where id = ? order by id asc",[req.params.id]);

        var manager = null;
        if (company.length == 1) {
          if (company[0].manager_id_fk != null) {
            var [
              _manager,
            ] = await pp.query("select * from personnel where id=?", [
              company[0].manager_id_fk,
            ]);
            if (_manager.length == 1) {
              manager = {
                id: _manager[0].id,
                first_name: _manager[0].first_name,
                last_name: _manager[0].last_name,
                national_number: _manager[0].national_number,
                mobile: _manager[0].mobile1,
              };
            }
          }
          res.status(200).send({
            company: company[0],
            manager: manager,
          });
        } else {
          res.status(403).send("شرکت مورد نظر در سامانه پیدا نشد");
        }
      }
    );

    app.post("/api/admin/personnel/legal/edit",legalUpload, auth.isInRoles('legal/edit'), async (req, res) => {
      
        if (
          req.body.name &&
          req.body.register_number &&
          req.body.register_date &&
          req.body.national_id
        ) {
          var logoFile =
            req.files["logo"] != null ? req.files["logo"][0] : null;
          var signFile =
            req.files["sign"] != null ? req.files["sign"][0] : null;
          var sealFile =
            req.files["seal"] != null ? req.files["seal"][0] : null;

          if (logoFile != null) {
            switch (logoFile.mimetype) {
              case "image/jpeg":
              case "image/jpg":
              case "image/png":
                //delete previous file
                if (req.body.logo_old) {
                  fs.unlink(
                    "./_uploads/company/" + path.basename(req.body.logo_old),
                    (err) => {
                      console.log(err);
                    }
                  );

                  //update new file
                  await pp.query(
                    "update company set logo_url = ? where id = ?",
                    ["/api/image/company/" + logoFile.filename, req.body.id]
                  );
                }
                break;
              default:
                res.status(403).send("فقط فایل های JPG مجاز میباشند");
                return;
            }
          }
          if (signFile != null) {
            switch (signFile.mimetype) {
              case "image/jpeg":
              case "image/jpg":
              case "image/png":
                //delete previous file
                if (req.body.sign_old) {
                  fs.unlink(
                    "./_uploads/company/" + path.basename(req.body.sign_old),
                    (err) => {
                      console.log(err);
                    }
                  );

                  //update new file
                  await pp.query(
                    "update company set sign_url = ? where id = ?",
                    ["/api/image/company/" + signFile.filename, req.body.id]
                  );
                }
                break;
              default:
                res.status(403).send("فقط فایل های JPG مجاز میباشند");
                return;
            }
          }

          if (sealFile != null) {
            switch (sealFile.mimetype) {
              case "image/jpeg":
              case "image/jpg":
              case "image/png":
                //delete previous file
                if (req.body.seal_old) {
                  fs.unlink(
                    "./_uploads/company/" + path.basename(req.body.seal_old),
                    (err) => {
                      console.log(err);
                    }
                  );

                  //update new file
                  await pp.query(
                    "update company set seal_url = ? where id = ?",
                    ["/api/image/company/" + sealFile.filename, req.body.id]
                  );
                }
                break;
              default:
                res.status(403).send("فقط فایل های JPG مجاز میباشند");
                return;
            }
          }

          if(req.user.access.indexOf('legal/editcontact') > -1) { 
            await pp.query('update company set phone=?, address=?, postal_code=?, email=? where id = ?', [
              req.body.phone,
              req.body.address,
              req.body.postal_code,
              req.body.email,
              req.body.id
            ]);
          }

          

          await pp.query("update company set name=?, register_number=?, register_date=?, national_id=?, finance_code=?, manager_id_fk=?, sign_owners=?, description=?, is_group = ?, email=? where id=?",
            [
              req.body.name,
              req.body.register_number,
              req.body.register_date,
              req.body.national_id,
              req.body.finance_code,
              req.body.manager_id,
              req.body.sign_owners,
              req.body.description,
              req.body.is_group =='true' ? 1 : 0,
              req.body.email,
              req.body.id
            ]
          );

          //check for contract 
          //check for contract
          var [contract_dup] = await pp.query('select id from contract where contractor_id = ?', [ 
            req.body.id
          ]);
          if(contract_dup.length == 0) { 
            await pp.query('insert into contract (type, date, employer, subject, start_date, end_date, contractor_id, contractor_type, can_delete) values (?,?,?,?,?,?,?,?,?)', [
              'main_non_civil',
              moment(req.body.register_date).utc(true).format('YYYY/MM/DD HH:mm:ss'),
              req.body.name,
              'دفتر ستاد',
              moment(req.body.register_date).utc(true).format('YYYY/MM/DD HH:mm:ss'),
              moment(req.body.register_date).utc(true).add(100, 'years').format('YYYY/MM/DD 23:59:59'),
              insert.insertId,
              'company',
              0
            ]);
          }

          res.status(200).send("done");
        } else {
          res.status(403).send("incomplete request");
        }
      }
    );

    app.get("/api/admin/personnel/legal/check/nationalid/:number",
      auth.authorized,
      async (req, res) => {
        var [
          check,
        ] = await pp.query("select id from company where national_id = ?", [
          req.params.number,
        ]);
        if (check.length > 0) {
          res.status(403).send("available");
        } else {
          res.status(200).send("not available");
        }
      }
    );

    app.get("/api/admin/personnel/legal/check/financecode/:code",auth.authorized,
      async (req, res) => {
        var [
          check,
        ] = await pp.query("select id from company where finance_code = ?", [
          req.params.code,
        ]);
        if (check.length > 0) {
          res.status(403).send("available");
        } else {
          res.status(200).send("not available");
        }
      }
    );


    app.delete("/api/admin/personnel/legal/delete",auth.isInRoles('legal/delete'),async (req, res) => {
        if (req.body.data) {
          try {
            var array = req.body.data.map((x) => {
              return parseInt(x, 10);
            });
            for (let i = 0; i < array.length; i++) {
              await pp.query("delete from company where id = ?", [array[i], 1]);
            }
            res.status(200).send("done");
          } catch (ex) {
            console.log(ex);
            res.status(403).send("error occured");
          }
        } else {
          res.status(403).send("incomplete request");
        }
      }
    );


    app.post('/api/admin/personnel/legal/list/contracts', auth.authorized, async(req, res) => { 
      try{
        if(req.body.companyId && req.body.type ) { 

          let permission = '';

          switch(req.body.type) {
            case 'progress':
              permission = 'contract/progress-add-edit';
              break;
            case 'production':
              permission = 'contract/production-report-add-edit';
              break;
            case 'peyman':
              permission = 'contract/peyman-report-add-edit';
              break;
            default:
              throw new Error('unknown type');
          }

          let _cmd = `select contract_id_fk as cid from personnel_access where company_id_fk=${req.body.companyId} and personnel_id_fk=${req.user.id} and access like '${permission}'`;

          if(req.user.super) { 
            if(req.body.companyId == '-1') { 
              throw new Error('invalid company id');
            }
            else { 
              _cmd = `select id as cid from contract where contractor_id=${req.body.companyId} and (type='main_civil' or type='main_non_civil') and deleted is null`;
            }
          }
          else { 
            if(req.body.companyId == '-1') { 
              _cmd = `select contract_id_fk as cid from personnel_access where personnel_id_fk=${req.user.id} and access like '${permission}'`;
            }
          }
          
          let [contracts] = await pp.query(_cmd);


          const contractsArr = contracts.map((item) => {
            return item.cid
          });

          let cmd = `select t2.activity, t2.contractor_id, t2.employer, t2.start_date, t2.end_date, t2.id, t2.number,t2.row,t2.subject, t2.workshop_code, t3.name from personnel_access as t1 
          inner join contract as t2 on t1.contract_id_fk=t2.id
          inner join company as t3 on t1.company_id_fk = t3.id
          where t1.contract_id_fk in (${contractsArr.toString()}) and (t2.type='main_civil' or t2.type='main_non_civil')`;

          if(req.user.super) { 
            cmd = `select t2.activity, t2.contractor_id, t2.employer, t2.start_date, t2.end_date, t2.id, t2.number,t2.row,t2.subject, t2.workshop_code, t3.name from contract as t2
            inner join company as t3 on t2.contractor_id = t3.id
            where t2.id in (${contractsArr.toString()}) and (t2.type='main_civil' or t2.type='main_non_civil')`;
          }
          if(req.body.activity) { 
            cmd += ` and t2.activity = '${req.body.activity}'`;
          }

          cmd += ` group by t2.id`;

          const [list] = await pp.query(cmd);
          res.status(200).send(list);

        }
        else { 
          res.status(403).send('incomplete request');
        }
      }
      catch(err) {
        console.log(err);
        res.status(403).send('error occured');
      }
    })

})