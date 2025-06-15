
const auth = require('./../../../../middlewares/auth');
const excelReader = require('read-excel-file/node');
const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const crypt = require('../../../../helpers/crypt');
const { isInRoleOfContract } = require('../../../../helpers/useraccess');


module.exports = ((app) => {
  let pp = app.get('pool').promise();

  app.get("/api/admin/vehicle/references", auth.authorized, async (req, res) => {
    var [styles] = await pp.query("select * from vehicle_style");
    var [systems] = await pp.query("select * from vehicle_system");
    var [types] = await pp.query("select * from vehicle_type");
    var [contracts] = await pp.query("select id, subject from contract");

    res.status(200).send({
      style: styles,
      system: systems,
      type: types,
      contract: contracts,
    });
  }
  );


  var imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './_uploads/vehicle/img')
    },
    filename: function (req, file, cb) {
      var name = `${moment().format('YYMMHDDHHmmSSS')}.jpg`;
      cb(null, name);
    }
  })

  var imgMulter = multer({
    storage: imgStorage,
    fileFilter: (req, file, cb) => {
      switch (file.mimetype) {
        case 'image/jpg':
        case 'image/jpeg':
          cb(null, true);
          break;
        default:
          cb('incorrect file type', false);
      }
    }
  })
  var vehicleUploadFields = imgMulter.fields([
    {
      name: 'vehicle_card', //card_url
      maxCount: 1
    },
    {
      name: 'vehicle_green_card', //green_card
      maxCount: 1
    },
    {
      name: 'own_doc', //ownership_document_url
      maxCount: 1
    }
  ]);

  app.post("/api/admin/vehicle/add", auth.authorized, async (req, res) => {

    vehicleUploadFields(req, res, async (err) => {
      if (await isInRoleOfContract(req.user, req.body.contract_id, 'machinery/insert', app.get('pool')) == false) {
        res.status(303).send('دسترسی شما به این قسمت محدود شده است');
        return;
      }

      if (err) {
        switch (err) {
          case 'incorrect file type':
            res.status(403).send('فقط فایل های JPG مجاز میباشند');
            break;
          default:
          //do nothing
        }
      }
      else {
        if (
          req.body.status &&
          req.body.code &&
          req.body.type_id &&
          req.body.system_id &&
          req.body.style_id &&
          req.body.engine_number &&
          req.body.chassis_number &&
          req.body.made_year &&
          req.body.contract_id
        ) {
          //duplicate
          var [duplicate,] = await pp.query(
            "select id from vehicle where organization_code = ?",
            [req.body.code]
          );
          if (duplicate.length > 0) {
            res
              .status(403)
              .send("وسیله نقلیه دیگری با این کد در سامانه ثبت شده است");
          } else {
            //create code for vehicle
            //TODO

            //check files
            let vehicle_card = null;
            let vehicle_green_card = null;
            let vehicle_own_document = null;
            if (req.files != undefined) {
              if (req.files['vehicle_card'] != null) {
                vehicle_card = req.files['vehicle_card'];
              }

              if (req.files['vehicle_green_card'] != null) {
                vehicle_green_card = req.files['vehicle_green_card']
              }

              if (req.files['own_doc'] != null) {
                vehicle_own_document = req.files['own_doc']
              }
            }


            await pp.query(
              "insert into vehicle (status, organization_code, type_id_fk, system_id_fk, style_id_fk, plaque1, plaque2, plaque3, plaque4, engine_number, chassis_number, vin_number, serial_number, made_year, color, gearbox, price, contract_id_fk, description, card_url, green_card_url, ownership_document_url, owner_id_fk, owner_type) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                req.body.status,
                req.body.code,
                req.body.type_id,
                req.body.system_id,
                req.body.style_id,
                req.body.pelak1,
                req.body.pelak2,
                req.body.pelak3,
                req.body.pelak4,
                req.body.engine_number,
                req.body.chassis_number,
                req.body.vin,
                req.body.serial_number,
                req.body.made_year,
                req.body.color,
                req.body.gearbox,
                req.body.price,
                req.body.contract_id,
                req.body.description,
                vehicle_card != null ? `/api/image/vehicle/${vehicle_card[0].filename}` : null,
                vehicle_green_card != null ? `/api/image/vehicle/${vehicle_green_card[0].filename}` : null,
                vehicle_own_document != null ? `/api/image/vehicle/${vehicle_own_document[0].filename}` : null,
                req.body.owner_id,
                req.body.owner_type
              ]
            );
            res.status(200).send('ثبت با موفقیت انجام شد');
          }
        } else {
          res.status(403).send("incomplete request");
        }
      }
    });
  });

  app.post("/api/admin/vehicle/edit", auth.authorized, vehicleUploadFields,  async (req, res) => {
    try {
      if (await isInRoleOfContract(req.user, req.body.contract_id, 'machinery/edit', app.get('pool')) == false) {
        res.status(303).send('دسترسی شما به این قسمت محدود شده است');
        return;
      }

      let vehicle_card = null;
      let vehicle_green_card = null;
      let vehicle_own_document = null;

      if (req.files != undefined) {
        if (req.files['vehicle_card'] != null) {
          vehicle_card = req.files['vehicle_card'];
        }

        if (req.files['vehicle_green_card'] != null) {
          vehicle_green_card = req.files['vehicle_green_card']
        }

        if (req.files['own_doc'] != null) {
          vehicle_own_document = req.files['own_doc']
        }
      }


      if (
        req.body.id
      ) {
        let cmd = 'update vehicle set ';
        if(req.body.status) {
          cmd += `status = '${req.body.status}' ,`
        }
        if(req.body.code) {
          cmd += `organization_code = '${req.body.code}' ,`
        }
        if(req.body.type_id) {
          cmd += `type_id_fk = ${req.body.type_id} ,`;
        }
        if(req.body.system_id) {
          cmd += `system_id_fk = ${req.body.system_id} ,`;
        }
        if(req.body.plaque1) {
          cmd += `plaque1 = '${req.body.plaque1}' ,`
        }
        if(req.body.plaque2) {
          cmd += `plaque2 = '${req.body.plaque2}' ,`;
        }
        if(req.body.plaque3) {
          cmd += `plaque3 = '${req.body.plaque3}',`
        }
        if(req.body.plaque4) {
          cmd += `plaque4 = '${req.body.plaque4}',`
        }
        if(req.body.engine_number) {
          cmd += `engine_number = '${req.body.engine_number}',`
        }
        if(req.body.chassis_number) {
          cmd += `chassis_number = '${req.body.chassis_number}',`
        }
        if(req.body.vin) {
          cmd += `vin_number = '${req.body.vin}' ,`
        }
        if(req.body.serial_number) {
          cmd += `serial_number = '${req.body.serial_number}',`
        }
        if(req.body.made_year)  {
          cmd += `made_year = '${req.body.made_year}',`
        }
        if(req.body.color) {
          cmd += `color = '${req.body.color}' ,`
        }
        if(req.body.gearbox) {
          cmd += `gearbox = '${req.body.gearbox}' ,`
        }
        if(req.body.price) {
          cmd += `price = ${req.body.price}, `
        }
        if(req.body.contract_id) {
          cmd += `contract_id_fk = ${req.body.contract_id},`
        }
        if(req.body.description) {
          cmd += `description = '${req.body.description}' ,`
        }
        if(req.body.owner_id) {
          cmd += `owner_id_fk = ${req.body.owner_id} ,`
        }
        if(req.body.owner_type) {
          cmd += `owner_type = '${req.body.owner_type}',`
        }
        if(vehicle_card) {
          cmd += `card_url = '/api/image/vehicle/${vehicle_card[0].filename}',`
        }
        if(vehicle_green_card) {
          cmd += `green_card_url = '/api/image/${vehicle_green_card[0].filename}',`
        }
        if(vehicle_own_document) {
          cmd += `owenrship_document_url = '/api/image/${vehicle_own_document[0].filename}' ,`
        }
        if(cmd[cmd.length - 1] === ',') {
          cmd = cmd.substring(0, cmd.length - 1);
        }
        cmd += ` where id = ${req.body.id} ;`;
        console.log(cmd);
        await pp.query(cmd);
        res.status(200).send("ویرایش با موفقیت ذخیره شد");
      } else {
        res.status(403).send("incomplete request");
      }

    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  });

  app.post("/api/admin/vehicle/type", auth.authorized, async (req, res) => {
    if (req.body.title && req.body.code) {
      var [duplicate] = await pp.query(
        "select * from vehicle_type where code = ? or title = ?",
        [req.body.code, req.body.title]
      );
      if (duplicate.length > 0) {
        return res.status(403).send("نوع نقلیه قبلا در سامانه وارد شده است");
      } else {
        await pp.query(
          "insert into vehicle_type (title, code, pelak) values (?, ?, ?)",
          [req.body.title, req.body.code, req.body.pelak]
        );
        res.status(201).send("done");
      }
    } else {
      res.status(403).send("incomplete request");
    }
  });


  app.get("/api/admin/vehicle/type/list", auth.authorized, async (req, res) => {
    var [list] = await pp.query(
      "select * from vehicle_type order by code;"
    );
    res.status(200).send({
      list: list,
    });
  }
  );

  var systemLogoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './_uploads/vehicle/system/logo');
    },
    filename: function (req, file, cb) {
      var name = `${moment().format('YYMMDDHHmmSS')}.jpg`;
      cb(null, name);
    }
  });
  var vehicleLogoMulter = multer({ storage: systemLogoStorage });
  app.post("/api/admin/vehicle/system", auth.authorized, vehicleLogoMulter.single('file'), async (req, res) => {

    if (req.body.title && req.body.type_id) {
      var [
        duplicate,
      ] = await pp.query("select * from vehicle_system where title = ? and type_id_fk = ?", [
        req.body.title,
        req.body.type_id
      ]);

      if (duplicate.length > 0) {
        res.status(403).send("سیستم نقلیه قبلا در سامانه وارد شده است");
      } else {
        await pp.query("insert into vehicle_system (title, type_id_fk, en_title, logo) values (?, ?,?,?)", [
          req.body.title,
          req.body.type_id,
          req.body.en_title,
          req.file != null ? `/api/file/vehicle-system/${req.file.filename}` : null,
        ]);
        res.status(201).send("done");
      }
    } else {
      res.status(403).send("incomplete request");
    }
  });

  app.put('/api/admin/vehicle/system/:id', auth.authorized, vehicleLogoMulter.single('file'), async (req, res) => {
    try {
      if (req.body.title && req.body.type_id) {
        await pp.query('update vehicle_system set title=?, type_id_fk=?, en_title=?, logo=? where id=?', [
          req.body.title,
          req.body.type_id,
          req.body.en_title,
          req.file != null ? `/api/file/vehicle-system/${req.file.filename}` : null,
          req.params.id
        ]);
        res.status(200).send('done');
      }
      else {
        res.status(403).send('incomplete request');
      }
    }
    catch (err) {
      res.status(400).send('error occured');
    }
  })

  app.get("/api/admin/vehicle/system/list", auth.authorized, async (req, res) => {
    var [list] = await pp.query(
      "select t1.logo, t1.en_title, t1.id, t1.title, t2.title as type_title  from vehicle_system as t1 inner join vehicle_type as t2 on t1.type_id_fk = t2.id order by t1.title"
    );
    res.status(200).send({
      list: list,
    });
  }
  );

  app.post("/api/admin/vehicle/style", auth.authorized, async (req, res) => {
    if (req.body.title && req.body.system_id) {
      var [
        duplicate,
      ] = await pp.query("select * from vehicle_style where title = ? and system_id_fk=?", [
        req.body.title,
        req.body.system_id
      ]);
      if (duplicate.length > 0) {
        res.status(403).send("تیپ نقلیه قبلا در سامانه وارد شده است");
      } else {
        await pp.query("insert into vehicle_style (title, system_id_fk) values (?, ?)", [
          req.body.title,
          req.body.system_id
        ]);
        res.status(201).send("done");
      }
    } else {
      res.status(403).send("incomplete request");
    }
  });

  app.get("/api/admin/vehicle/style/list", auth.authorized, async (req, res) => {
    var [list] = await pp.query(
      "select t3.title as type, t1.id, t1.title, t2.title as system_title from vehicle_style as t1 inner join vehicle_system as t2 on t1.system_id_fk = t2.id inner join vehicle_type as t3 on t2.type_id_fk = t3.id order by t2.title"
    );
    res.status(200).send({
      list: list,
    });
  }
  );

  app.get('/api/admin/vehicle/list/:company_id/:contract_id', auth.isInRoles('machinery/list'), async (req, res) => {

    var cmd = '';
    if (req.params.contract_id == -1 && req.params.company_id == -1) {
      if (req.user.super) {
        cmd = `select t1.id, t1.contract_id_fk as contract_id, t2.title as type, t3.title as system,
        t4.title as style, t1.organization_code, t6.name, t5.subject, t1.chassis_number,
        t1.engine_number, t1.plaque1, t1.plaque2, t1.plaque3, t1.plaque4,
        t7.first_name as owner_first_name, t7.last_name as owner_last_name,
        t8.name as owner_company_name
        from vehicle as t1
        inner join vehicle_type as t2 on t1.type_id_fk = t2.id
        inner join vehicle_system as t3 on t1.system_id_fk = t3.id
        inner join vehicle_style as t4 on t1.style_id_fk = t4.id
        inner join contract as t5 on t1.contract_id_fk = t5.id
        inner join company as t6 on t5.contractor_id = t6.id
        left join personnel as t7 on t1.owner_id_fk = t7.id
        left join company as t8 on t1.owner_id_fk = t8.id`;
      }
      else {
        cmd = `select  t1.id, t1.contract_id_fk as contract_id, t2.title as type, t3.title as system, t4.title as style, t1.organization_code, t6.name,
        t8.first_name as owner_first_name, t8.last_name as owner_last_name,
        t.name as owner_company_name,
        t5.subject, t1.chassis_number, t1.engine_number, t1.plaque1, t1.plaque2, t1.plaque3, t1.plaque4 from vehicle as t1 inner join vehicle_type as t2 on t1.type_id_fk = t2.id inner join vehicle_system as t3 on t1.system_id_fk = t3.id inner join vehicle_style as t4 on t1.style_id_fk = t4.id inner join contract as t5 on t1.contract_id_fk = t5.id inner join company as t6 on t5.contractor_id = t6.id inner join personnel_access as t7 on t5.id = t7.contract_id_fk
        left join personnel as t8 on t1.owner_id_fk = t8.id
        left join company as t9 on t1.owner_id_fk = t9.id
        where t7.personnel_id_fk = ${req.user.id} and t7.access = 'machinery/list'`;
      }

    }
    else if (req.params.contract_id == -1) {

      if (req.user.super) {
        cmd = `select  t1.id, t1.contract_id_fk as contract_id, t2.title as type,
        t7.first_name as owner_first_name, t7.last_name as owner_last_name,
        t8.name as owner_company_name,
        t3.title as system, t4.title as style, t1.organization_code, t6.name, t5.subject, t1.chassis_number, t1.engine_number, t1.plaque1, t1.plaque2, t1.plaque3, t1.plaque4 from vehicle as t1 inner join vehicle_type as t2 on t1.type_id_fk = t2.id inner join vehicle_system as t3 on t1.system_id_fk = t3.id inner join vehicle_style as t4 on t1.style_id_fk = t4.id inner join contract as t5 on t1.contract_id_fk = t5.id inner join company as t6 on t5.contractor_id = t6.id
        left join personnel as t7 on t1.owner_id_fk = t7.id
        left join company as t8 on t1.owner_id_fk = t8.id
        where  t6.id = ${req.params.company_id}`;
      }
      else {
        cmd = `select t7.access,  t1.id, t1.contract_id_fk as contract_id, t2.title as type, t3.title as system, t4.title as style, t1.organization_code, t6.name, t5.subject, t1.chassis_number, t1.engine_number, t1.plaque1, t1.plaque2, t1.plaque3, t1.plaque4,
        t8.first_name as owner_first_name, t8.last_name as owner_last_name,
        t9.name as owner_company_name,
        from vehicle as t1 inner join vehicle_type as t2 on t1.type_id_fk = t2.id inner join vehicle_system as t3 on t1.system_id_fk = t3.id inner join vehicle_style as t4 on t1.style_id_fk = t4.id inner join contract as t5 on t1.contract_id_fk = t5.id inner join company as t6 on t5.contractor_id = t6.id inner join personnel_access as t7 on t5.id = t7.contract_id_fk
        left join personnel as t8 on t1.owner_id_fk = t8.id
        left join company as t9 on t1.owner_id_fk = t9.id
        where t7.access = 'machinery/list' and t7.personnel_id_fk=${req.user.id} and t6.id = ${req.params.company_id}`;
      }

    }
    else {
      if (req.user.super) {
        cmd = `select t1.id,t1.contract_id_fk as contract_id,
        t7.first_name as owner_first_name, t7.last_name as owner_last_name,
        t8.name as owner_company_name,
        t2.title as type, t3.title as system, t4.title as style, t1.organization_code, t6.name, t5.subject, t1.chassis_number, t1.engine_number, t1.plaque1, t1.plaque2, t1.plaque3, t1.plaque4 from vehicle as t1 inner join vehicle_type as t2 on t1.type_id_fk = t2.id inner join vehicle_system as t3 on t1.system_id_fk = t3.id inner join vehicle_style as t4 on t1.style_id_fk = t4.id inner join contract as t5 on t1.contract_id_fk = t5.id inner join company as t6 on t5.contractor_id = t6.id
        left join personnel as t7 on t1.owner_id_fk = t7.id
        left join company as t8 on t1.owner_id_fk = t8.id
        where t1.contract_id_fk = ${req.params.contract_id}`;
      }
      else {
        cmd = `select t1.id, t1.contract_id_fk as contract_id, t2.title as type, t3.title as system, t4.title as style, t1.organization_code, t6.name, t5.subject, t1.chassis_number, t1.engine_number, t1.plaque1, t1.plaque2, t1.plaque3,
        t8.first_name as owner_first_name, t8.last_name as owner_last_name,
        t9.name as owner_company_name,
        t1.plaque4 from vehicle as t1 inner join vehicle_type as t2 on t1.type_id_fk = t2.id inner join vehicle_system as t3 on t1.system_id_fk = t3.id inner join vehicle_style as t4 on t1.style_id_fk = t4.id inner join contract as t5 on t1.contract_id_fk = t5.id inner join company as t6 on t5.contractor_id = t6.id inner join personnel_access as t7 on t5.id = t7.contract_id_fk
        left join personnel as t8 on t1.owner_id_fk = t8.id
        left join company as t9 on t1.owner_id_fk = t9.id
        where t1.contract_id_fk = ${req.params.contract_id} and t7.access='machinery/list'`;
      }

    }


    var [list] = await pp.query(cmd);
    var hash = crypt.encrypt(cmd);
    hash = hash.replace(/\//g, '__');
    res.status(200).send({
      list: list,
      export: hash
    });
  })


  app.get("/api/admin/vehicle/:id", auth.authorized, async (req, res) => {

    var [vehicle] = await pp.query(
      "select t2.first_name as owner_first_name, t2.last_name as owner_last_name,t2.national_number as owner_national_code, t2.id as owner_id, t3.name as owner_compnay_name,t3.national_id as owner_company_national_id, t3.id as owner_company_id, t1.status, t1.organization_code as code, t1.type_id_fk, t1.system_id_fk, t1.style_id_fk, t1.plaque1 as pelak1, t1.plaque2 as pelak2, t1.plaque3 as pelak3 , t1.plaque4 as pelak4, t1.engine_number, t1.chassis_number, t1.vin_number as vin, t1.serial_number, t1.made_year, t1.color, t1.gearbox, t1.price, t1.contract_id_fk, t1.description, t1.card_url, t1.green_card_url, t1.ownership_document_url  from vehicle as t1 left join personnel as t2 on t1.owner_id_fk = t2.id left join company as t3 on t1.owner_id_fk = t3.id  where t1.id = ?",
      [req.params.id]
    );

    if (vehicle.length == 1) {
      var [type] = await pp.query("select * from vehicle_type where id = ?", [
        vehicle[0].type_id_fk,
      ]);
      var [style] = await pp.query("select * from vehicle_style where id = ?", [vehicle[0].style_id_fk]);
      var [system] = await pp.query("select * from vehicle_system where id = ?", [
        vehicle[0].system_id_fk,
      ]);

      var pelak = true;
      if (
        vehicle[0].pelak1 == -1 &&
        vehicle[0].pelak3 == -1 &&
        vehicle[0].pelak4 == -1
      ) {
        pelak = false;
      }

      res.status(200).send({
        vehicle: vehicle[0],
        style: style[0],
        system: system[0],
        type: type[0],
        pelak: pelak,
      });
    } else {
      res.status(403).send("نقلیه در سامانه پیدا نشد");
    }
  });



  var excelStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './_uploads/vehicle');
    },
    filename: function (req, file, cb) {
      var name = `${moment().format('YYMMDDHHmmSS')}.xlsx`;
      cb(null, name);
    }
  });
  var vehicleMulter = multer({ storage: excelStorage });
  app.post("/api/admin/vehicle/add/excel", auth.authorized, vehicleMulter.single("file"), async (req, res) => {
    if (req.body.id == null) {
      res.status(403).send('incomplete request');
      return;
    }
    if (req.file) {
      if (req.file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        excelReader("./" + req.file.path, {
          sheet: 1,
        }).then(async (rows) => {

          var successCount = 0;

          for (let i = 1; i < rows.length; i++) {

            //duplicate
            var [duplicate] = await pp.query('select id from vehicle where organization_code=?', [rows[i][0]]);

            if (duplicate.length == 0) {
              //insert rows
              try {
                var status = "";
                switch (rows[i][15].toString()) {
                  case "1":
                    status = "enable";
                    break;
                  case "2":
                    status = "ready";
                    break;
                  case "3":
                    status = "auction";
                    break;
                  case "0":
                    status = "disable";
                    break;
                  default:
                    status = "error";
                }

                await pp.query(
                  "insert into vehicle (status, organization_code, type_id_fk, system_id_fk, style_id_fk, plaque1, plaque2, plaque3, plaque4, engine_number, chassis_number, serial_number, made_year, vin_number, color, gearbox, price, contract_id_fk, description) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  [
                    status,
                    rows[i][0],
                    rows[i][1],
                    rows[i][2],
                    rows[i][3],
                    rows[i][7] != "" ? rows[i][7] : -1,
                    rows[i][6] != "" ? rows[i][6] : "",
                    rows[i][5] != "" ? rows[i][5] : -1,
                    rows[i][4] != "" ? rows[i][4] : -1,
                    rows[i][8],
                    rows[i][9],
                    rows[i][10],
                    rows[i][11],
                    rows[i][12],
                    rows[i][13],
                    rows[i][14] == "0" ? "auto" : "manual",
                    rows[i][16],
                    req.body.id,
                    rows[i][17],
                  ]
                );
                successCount++;
              } catch (err) {
                console.log(err);
              }
            }

          }

          fs.unlink("./" + req.file.path, (err) => {
            if (err) {
              console.log(err);
            }
          });

          res.status(201).send({
            total: rows.length,
            success: successCount,
          });
        });
      } else {
        res.status(403).send("فقط فایل xlsx مورد قبول میباشد");
      }
    } else {
      res.status(403).send("incomplete request");
    }
  }
  );


  app.get('/api/admin/vehicle/systems/:typeid', auth.authorized, async (req, res) => {
    var [list] = await pp.query('select * from vehicle_system where type_id_fk = ?', [req.params.typeid]);
    res.status(200).send({ list: list });
  })

  app.get('/api/admin/vehicle/styles/:systemid', auth.authorized, async (req, res) => {
    var [list] = await pp.query('select * from vehicle_style where system_id_fk = ?', [req.params.systemid]);
    res.status(200).send({ list: list });
  });

  app.delete('/api/admin/vehicle', auth.authorized, async (req, res) => {
    if (req.body.list) {
      var array = req.body.list;
      var pool = app.get('pool');
      for (let i = 0; i < array.length; i++) {
        //each item must be check with user access
        if (await isInRoleOfContract(req.user, array[i].cid, 'machinery/delete', pool)) {
          //delete the item
          await pp.query('delete from vehicle where id = ?', array[i].id);
        }
      }
      res.status(200).send('done');
    } else {
      res.status(403).send('incomplete request');
    }
  })

  app.delete('/api/admin/vehicle/style', auth.authorized, async (req, res) => {
    if (req.body.id) {
      var arr = req.body.id;
      const deleteIds = [];
      for (let i = 0; i < arr.length; i++) {
        const [count] = await pp.query('select id from vehicle where style_id_fk = ?', [arr[i]]);
        if (count.length == 0) {
          await pp.query('delete from vehicle_style where id = ?', [arr[i]]);
          deleteIds.push(arr[i]);
        }
      }
      res.status(200).send({
        deletedIds: deleteIds
      });
    }
    else {
      res.status(403).send('incomplete request');
    }
  });

  app.delete('/api/admin/vehicle/system', auth.authorized, async (req, res) => {
    if (req.body.id) {
      var arr = req.body.id;
      const deletedIds = [];
      for (let i = 0; i < arr.length; i++) {
        const [count] = await pp.query('select id from vehicle where system_id_fk = ?', [arr[i]]);
        if (count.length == 0) {
          await pp.query('delete from vehicle_system where id = ?', [arr[i]]);
          deletedIds.push(arr[i]);
        }
      }
      res.status(200).send({
        deletedIds: deletedIds
      });
    }
    else {
      res.status(403).send('incomplete request');
    }
    res.status(200).send('done');
  });

  app.delete('/api/admin/vehicle/type', auth.authorized, async (req, res) => {
    if (req.body.id) {
      var arr = req.body.id;
      const _arr = [];
      for (let i = 0; i < arr.length; i++) {
        const [count] = await pp.query('select id from vehicle where type_id_fk = ?', [arr[i]]);
        if (count.length == 0) {
          await pp.query('delete from vehicle_type where id = ?', [arr[i]]);
          _arr.push(arr[i]);
        }
      }
      res.status(200).send({
        deletedIds: _arr
      });
    }
    else {
      res.status(403).send('incomplete request');
    }
    res.status(200).send('done');
  });

  app.get('/api/admin/vehicle/lookup/:orgcode', auth.authorized, async (req, res) => {
    try {
      var [vehicle] = await pp.query('select t1.id, t2.title as type, t3.title as system, t4.title as style from vehicle as t1 left join vehicle_type as t2 on t1.type_id_fk = t2.id left join vehicle_system as t3 on t1.system_id_fk = t3.id left join vehicle_style as t4 on t1.style_id_fk = t4.id where t1.organization_code = ?', [req.params.orgcode]);
      if (vehicle.length == 1) {
        res.status(200).send(vehicle[0]);
      }
      else {
        res.status(404).send('ماشین آلات پیدا نشد');
      }
    }
    catch (err) {
      res.status(403).send(err);
    }
  })


  app.post('/api/admin/vehicle/report/activity', auth.authorized, async (req, res) => {
    try {
      if (req.body.contracts && req.body.start_date && req.body.end_date) {
        const cmd = `select t1.subject, t1.id as contract_id_fk, t2.name, t2.id as company_id from contract as t1 inner join company as t2 on t1.contractor_id = t2.id where t1.id in (${req.body.contracts.toString()})`;

        const [contracts] = await pp.query(cmd);

        const output = [];

        for (let i = 0; i < contracts.length; i++) {

          const [list] = await pp.query('select * from contract_peyman_report where contract_id_fk=? and (DATE(date) between ? and ?)', [
            contracts[i].contract_id_fk,
            req.body.start_date,
            req.body.end_date
          ]);

          const m = {
            company_id: contracts[i].company_id,
            contract_name: contracts[i].subject,
            contract_id_fk: contracts[i].contract_id_fk,
            company_name: contracts[i].name,
            reports: list
          }
          output.push(m);
        }

        res.status(200).send(output);
      }
      else {
        res.status(403).send('incomplete request');
      }
    }
    catch (err) {
      console.log(err);
      res.status(403).send('incomplete request');
    }
  })

  app.post('/api/admin/vehicle/report/status/daily', auth.authorized, async (req, res) => {
    try {
      if (req.body.contracts && req.body.report_date) {
        const [list] = await pp.query('select t1.*, t2.subject as contract_name, t3.name as company_name, t3.id as company_id from contract_peyman_report as t1 inner join contract as t2 on t1.contract_id_fk = t2.id inner join company as t3 on t2.contractor_id = t3.id where t1.contract_id_fk in (?) and DATE(t1.date) = ?', [
          req.body.contracts,
          req.body.report_date
        ]);
        res.status(200).send(list);
      }
      else {
        res.status(403).send('incomplete request');
      }
    }
    catch (err) {
      res.status(403).send('error occured');
      console.log(err);
    }
  })

  app.post('/api/admin/vehicle/report/status/average', auth.authorized, async (req, res) => {
    try {
      if (req.body.companies && req.body.report_date) {
        let cmd = `SELECT
        avg(t1.disabled_car_no_part_quantity) as total_disabled_car_no_part_average,
        avg(t1.active_car_quantity) as total_active_average,
        avg(t1.disabled_car_no_tier_quantity) as total_disabled_car_no_tier_average,
        t2.contract_id_fk,
        t2.company_id_fk,
        t3.name as company_name,
        DATE(t1.date) as date
        from contract_peyman_report as t1
        inner join personnel_access as t2 on t1.contract_id_fk = t2.contract_id_fk
        inner join company as t3 on t2.company_id_fk = t3.id
        inner join contract as t4 on t2.contract_id_fk = t4.id
        where t2.company_id_fk in (${req.body.companies.toString()})
        and DATE(t1.date) = '${req.body.report_date}'
        and t2.access = 'contract/dashboard-report'
        and t2.personnel_id_fk=${req.user.id}
        and (t4.type = 'main_civil' or t4.type='main_non_civil')
        group by t2.company_id_fk`;


        if (req.user.super) {

          cmd = `SELECT
          avg(t1.disabled_car_no_part_quantity) as total_disabled_car_no_part_average,
          avg(t1.active_car_quantity) as total_active_average,
          avg(t1.disabled_car_no_tier_quantity) as total_disabled_car_no_tier_average,
          t2.id,
          t2.contractor_id,
          t3.name as company_name,
          DATE(t1.date) as date
          from contract as t2
          left join contract_peyman_report as t1 on t1.contract_id_fk = t2.id
          inner join company as t3 on t2.contractor_id = t3.id
          where t2.contractor_id in (${req.body.companies.toString()})
          and (t2.type = 'main_civil' or t2.type='main_non_civil')
          and DATE(t1.date) = '${req.body.report_date}' group by t2.contractor_id`;
        }
        const [list] = await pp.query(cmd);


        res.status(200).send(list);
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


})