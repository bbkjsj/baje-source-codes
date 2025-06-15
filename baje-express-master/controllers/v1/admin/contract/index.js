const auth = require('../../../../middlewares/auth');
const crypt = require('../../../../helpers/crypt');
const moment = require('moment');

module.exports = ((app) => {
  let pp = app.get('pool').promise();


  app.post('/api/admin/contract/list', auth.isInRoles('contract/list'), async (req, res) => {

    if (req.body.id && req.body.type) {
      switch (req.body.type) {
        case "main":
          var cmd = `select DATE(t1.date) as date,t1.row, DATE(t1.start_date) AS start_date, DATE(t1.end_date) as end_date, t1.id as id, t1.number, t1.subject, t1.employer, t2.name, t3.name as employer1, t1.workshop_code, t1.type, t1.contractor_id, t1.activity from contract as t1 left join company as t2 on t1.contractor_id = t2.id left join company as t3 on t1.employer_id = t3.id where t1.contractor_id = ${req.body.id} and t1.deleted is null;`;
          if (req.body.id == -1) {
            cmd = `select DATE(t1.date) as date,t1.row, DATE(t1.start_date) AS start_date, DATE(t1.end_date) as end_date, t1.id as id, t1.number, t1.subject, t1.employer, t2.name, t3.name as employer1, t1.workshop_code, t1.type, t1.contractor_id, t1.activity from contract as t1 left join company as t2 on t1.contractor_id = t2.id left join company as t3 on t1.employer_id = t3.id where t1.deleted is null`;
          }

          var hash = crypt.encrypt(cmd);
          hash = hash.toString().replace(/\//g, '__');
          var [list] = await pp.query(cmd);
          res.status(200).send({
            list: list,
            export: hash
          });
          break;
        case "sub":
          var cmd1 = `select DATE(t1.date) as date, DATE(t1.start_date) AS start_date, DATE(t1.end_date) as end_date, t1.id as id, t1.number as number,   t1.subject, t3.name as employer, CONCAT(t2.first_name,t2.last_name) as  name, t1.workshop_code, t1.type, t1.activity from contract as t1 left join personnel as t2 on t1.contractor_id = t2.id left join company as t3 on t1.employer_id = t3.id where t1.employer_id = ${req.body.id} and  t1.deleted is null`;
          if (req.body.id == -1) {

            cmd1 = `select DATE(t1.date) as date, DATE(t1.start_date) AS start_date, DATE(t1.end_date) as end_date, t1.id as id, t1.number as number,   t1.subject, t3.name as employer, CONCAT(t2.first_name,t2.last_name) as  name, t1.workshop_code, t1.type from contract as t1 left join personnel as t2 on t1.contractor_id = t2.id left join company as t3 on t1.employer_id = t3.id where  t1.deleted is null`;
          }

          const hash1 = crypt.encrypt(cmd1);
          var [list1] = await pp.query(cmd1);
          res.status(200).send({
            list: list1,
            export: hash1
          });
          break;
        default:
          res.status(400).send("unknown contract type");
      }
    }
    else {
      res.status(403).send('incomplete request');
    }

  });

  app.get('/api/admin/contract/search/:phrase', auth.authorized, async (req, res) => {
    if (req.headers.cid) {
      var [search] = await pp.query("select contractor_id, type, DATE(date) as date, DATE(start_date) as start_date, DATE(end_date) as end_date, id, subject, number, code from contract where (contractor_id = ?) and (type = ? or type = ?) and (deleted is null) and (subject like ? or number like ? or code like ?)",
        [
          req.headers.cid,
          "main_civil",
          "main_non_civil",
          "%" + req.params.phrase + "%",
          "%" + req.params.phrase + "%",
          "%" + req.params.phrase + "%",
        ]
      );
      res.status(200).send({
        list: search
      });
    }
    else {
      res.status(403).send('search request is incomplete');
    }
  });


  app.get('/api/admin/contract/contractor/lookup/:number', auth.authorized, async (req, res) => {
    var [list] = await pp.query('select id, first_name, last_name, national_number from personnel where national_number = ?', [req.params.number]);
    var [list1] = await pp.query('select id, name, national_id from company where national_id = ?', [req.params.number]);

    var output = [];

    for (let i = 0; i < list.length; i++) {
      var _m = {
        id: list[i].id,
        name: list[i].first_name + ' ' + list[i].last_name,
        number: list[i].national_number,
        type: 'personnel'
      }
      output.push(_m);
    }

    for (let i = 0; i < list1.length; i++) {
      var _m = {
        id: list1[i].id,
        name: list1[i].name,
        number: list1[i].national_id,
        type: 'company'
      }
      output.push(_m);
    }

    res.status(200).send({
      list: output
    });
  });

  app.post("/api/admin/contract/add", auth.isInRoles('contract/insert'), async (req, res) => {
    if (req.body.type && req.body.subject) {
      try {
        if (req.body.contractor_id == req.body.employer_id) {
          res.status(403).send('پیمانکار و کارفرما نمیتوانند یکی باشند');
          return;
        }
        if (req.body.workshop_code) {
          //کنترل کد کارگاهی در قرارداد
          var [workshop_duplicate] = await pp.query('select contractor_id from contract where workshop_code = ?', [req.body.workshop_code]);
          for (let i = 0; i < workshop_duplicate.length; i++) {
            if (workshop_duplicate[i].contractor_id != req.body.contractor_id) {
              res.status(403).send('کد کارگاهی وارد شده قبلا برای شرکت دیگری ثبت شده است');
              return;
            }
          }

          //کنترل ردیف پیمان
          if (req.body.row) {
            var [rp] = await pp.query('select id from contract where contractor_id = ? and workshop_code=? and row = ?', [req.body.contractor_id, req.body.workshop_code, req.body.row]);
            if (rp.length > 0) {
              res.status(403).send('شماره پیمان وارد شده قبلا برای این شرکت ثبت شده است');
              return;
            }
          }
        }

        if (req.body.contract_number && req.body.contractor_id) {
          var [number_duplicate] = await pp.query('select id from contract where contractor_id=? and number=?', [req.body.contractor_id, req.body.contract_number]);
          if (number_duplicate.length > 0) {
            res.status(403).send('شماره قرارداد وارد شده قبلا در سامانه ثبت شده است');
            return;
          }
        }

        const contract = await pp.query("insert into contract (number, type, date, employer, contractor, subject, start_date, end_date, initial_amount, workshop_code, row, supervision, manager_id, employer_id, boss_id, contractor_type, contractor_id, main_contract_id_fk, activity) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            req.body.contract_number,
            req.body.type,
            req.body.contract_date,
            req.body.employer,
            req.body.contractor,
            req.body.subject,
            req.body.start_date,
            req.body.finish_date,
            req.body.initial_amount,
            req.body.workshop_code,
            req.body.row != null ? req.body.row : null,
            req.body.supervision,
            req.body.manager_id,
            req.body.employer_id,
            req.body.boss_id,
            req.body.contractor_type,
            req.body.contractor_id,
            req.body.main_contract_id,
            req.body.activity
          ]
        );

        //calculate progress among days
        const fromDate = moment(req.body.start_date);
        const toDate = moment(req.body.finish_date);

        const diff = toDate.diff(fromDate, 'days');


        for (let i = 0; i < diff + 1; i++) {
          const d = moment(req.body.start_date).utc(true).add(i, 'day').format('YYYY/MM/DD');


          await pp.query('insert into contract_progress (contract_id_fk, date, real_progress, program_progress) values (?,?,?,?)', [
            contract[0].insertId,
            d,
            0,
            0
          ]);

          if (req.body.activity == 'mineral') {
            await pp.query('insert into contract_production_report (stone_tonnage, dust_tonnage, stone_load_quantity, dust_load_quantity, contract_id_fk, date) values (?,?,?,?,?,?)', [
              0,
              0,
              0,
              0,
              contract[0].insertId,
              d
            ]);
          }

          if (req.body.type == 'main_civil' || req.body.type == 'main_non_civil') {
            await pp.query('insert into contract_peyman_report (contract_id_fk, date, disabled_car_no_tier_quantity, disabled_car_no_part_quantity, active_car_quantity, ready_to_work_factor) values (?,?,?,?,?,?)', [
              contract[0].insertId,
              d,
              0,
              0,
              0,
              0
            ]);
          }
        }


        //add permission to manager
        if (req.body.manager_id) {
          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.company_id,
            'contract/progress-add-edit',
            contract[0].insertId
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.company_id,
            'contract/progress-approve',
            contract[0].insertId
          ]);

          if (req.body.activity == 'mineral') {
            await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
              req.body.manager_id,
              req.body.company_id,
              'contract/production-report-add-edit',
              contract[0].insertId
            ]);

            await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
              req.body.manager_id,
              req.body.company_id,
              'contract/production-report-approve',
              contract[0].insertId
            ]);
          }
          if (req.body.type == 'main_civil' || req.body.type == 'main_non_civil') {
            await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
              req.body.manager_id,
              req.body.company_id,
              'contract/peyman-report-add-edit',
              contract[0].insertId
            ]);

            await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
              req.body.manager_id,
              req.body.company_id,
              'contract/peyman-report-approve',
              contract[0].insertId
            ]);

            await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
              req.body.manager_id,
              req.body.company_id,
              'contract/dashboard-report',
              contract[0].insertId
            ]);
            
          }
        }

        res.status(201).send({
          contractId: contract[0].insertId
        });
      } catch (err) {
        console.log(err);
        res
          .status(403)
          .send(
            "ثبت اطلاعات قرارداد با مشکل مواجه شده است. لطفا این مشکل را به مدیر سامانه گزارش دهید"
          );
      }
    } else {
      res.status(403).send("incomplete request");
    }
  });

  app.post('/api/admin/contract/edit', auth.isInRoles('contract/edit'), async (req, res) => {

    try {

      if (req.body.id) {
        if (req.body.contractor_id == req.body.employer_id) {
          res.status(403).send('پیمانکار و کارفرما نمیتوانند یکی باشند');
          return;
        }

        if (req.body.id == req.body.main_contract_id) {
          res.status(403).send('قرارداد با قرارداد اصلی مشابه است');
          return;
        }


        //check main contracts
        var [child_contracts] = await pp.query('select id from contract where main_contract_id_fk = ?', [req.body.id]);

        if (child_contracts.length > 0) {
          if (req.body.contractor_id != req.body.old_contractor_id) {
            res.status(403).send('امکان تغییر پیمانکار در این قرارداد وجود ندارد');
            return;
          }
        }

        const [oldContract] = await pp.query('select * from contract where id=?', [req.body.id]);

        

        await pp.query('update contract set type=?, number=?, date=?, employer=?, contractor=?, subject=?, start_date=?, end_date=?, initial_amount=?, workshop_code=?, row=?, supervision=?, manager_id=?, employer_id=?, boss_id=?, contractor_type=?, contractor_id=?, main_contract_id_fk=?, activity=? where id=?', [
          req.body.type != null ? req.body.type : null,
          req.body.contract_number != null ? req.body.contract_number : null,
          req.body.contract_date != null ? req.body.contract_date : null,
          req.body.employer != null ? req.body.employer : null,
          req.body.contractor != null ? req.body.contractor : null,
          req.body.subject,
          req.body.start_date,
          req.body.finish_date,
          req.body.initial_amount != null ? req.body.initial_amount : null,
          req.body.workshop_code != null ? req.body.workshop_code : null,
          req.body.row != null ? req.body.row : null,
          req.body.supervision,
          req.body.manager_id,
          req.body.employer_id,
          req.body.boss_id,
          req.body.contractor_type,
          req.body.contractor_id,
          req.body.main_contract_id,
          req.body.activity,
          req.body.id
        ]);

        //remove old progress
        await pp.query('delete from contract_progress where contract_id_fk=?', [req.body.id]);

        //remove old production report
        await pp.query('delete from contract_production_report where contract_id_fk=?', [req.body.id]);

        //remove old peyman report
        await pp.query('delete from contract_peyman_report where contract_id_fk=?', [req.body.id]);

        //calculate progress among days
        const fromDate = moment(req.body.start_date);
        const toDate = moment(req.body.finish_date);

        const diff = toDate.diff(fromDate, 'days');


        for (let i = 0; i < diff + 1; i++) {
          const d = moment(req.body.start_date).utc(true).add(i, 'day').format('YYYY/MM/DD');


          await pp.query('insert into contract_progress (contract_id_fk, date, real_progress, program_progress) values (?,?,?,?)', [
            req.body.id,
            d,
            0,
            0
          ]);

          if (req.body.activity == 'mineral') {
            await pp.query('insert into contract_production_report (stone_tonnage, dust_tonnage, stone_load_quantity, dust_load_quantity, contract_id_fk, date) values (?,?,?,?,?,?)', [
              0,
              0,
              0,
              0,
              req.body.id,
              d
            ]);
          }

          if (req.body.type == 'main_non_civil' || req.body.type == 'main_civil') {
            await pp.query('insert into contract_peyman_report (contract_id_fk, date, disabled_car_no_tier_quantity, disabled_car_no_part_quantity, active_car_quantity, ready_to_work_factor) values (?,?,?,?,?,?)', [
              req.body.id,
              d,
              0,
              0,
              0,
              0
            ]);
          }
        }

        //add permission to manager
        await pp.query('delete from personnel_access where personnel_id_fk=? and contract_id_fk=? and company_id_fk=? and (access=? or access=? or access=? or access=? or access=? or access=? or access=?)', [
          oldContract[0].manager_id,
          req.body.id,
          req.body.contractor_id,
          'contract/progress-add-edit',
          'contract/progress-approve',
          'contract/production-report-add-edit',
          'contract/production-report-approve',
          'contract/peyman-report-add-edit',
          'contract/peyman-report-approve',
          'contract/dashboard-report'
        ]);


        if (req.body.manager_id) {
          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/progress-add-edit',
            req.body.id
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/progress-approve',
            req.body.id
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/production-report-add-edit',
            req.body.id
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/production-report-approve',
            req.body.id
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/peyman-report-add-edit',
            req.body.id
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/peyman-report-approve',
            req.body.id
          ]);

          await pp.query('insert into personnel_access (personnel_id_fk, company_id_fk, access, contract_id_fk) values (?,?,?,?)', [
            req.body.manager_id,
            req.body.contractor_id,
            'contract/dashboard-report',
            req.body.id
          ]);

        }
        res.status(200).send('done');
      }
      else {
        res.status(403).send('incomplete request');
      }

    }
    catch (err) {
      console.log(err);
      res.status(403).send('خطایی در بروزرسانی اطلاعات رخ داده. لطفا مجددا سعی کنید');
    }
  });


  app.get("/api/admin/contract/:id", auth.authorized, async (req, res) => {
    var [type] = await pp.query('select contractor_type from contract where id = ?', [req.params.id]);

    if (type.length == 1) {
      switch (type[0].contractor_type) {
        case 'personnel':
          var [contract] = await pp.query(
            "select t1.activity, t1.contractor_type, t1.main_contract_id_fk as main_contract_id, t1.contractor_id, DATE_FORMAT(t1.date, '%Y/%m/%d') as date, DATE_FORMAT(t1.start_date, '%Y/%m/%d') as start_date, DATE_FORMAT(t1.end_date, '%Y/%m/%d') as end_date, t1.initial_amount, t1.row,t1.supervision,  t1.id, t1.number as number,  t1.subject, t3.id as employer_id, t3.name as employer, CONCAT(t2.first_name,?,t2.last_name) as name, t2.national_number, t1.workshop_code, t1.type, t4.id as manager_id, CONCAT(t4.first_name, ?, t4.last_name) as manager_name, t4.national_number as manager_national_num,t5.id as boss_id,  CONCAT(t5.first_name,?,t5.last_name) as boss, t5.national_number as boss_national_num, t3.national_id from contract as t1 inner join personnel as t2 on t1.contractor_id = t2.id left join company as t3 on t1.employer_id = t3.id left join personnel as t4 on t1.manager_id = t4.id left join personnel as t5 on t1.boss_id = t5.id where t1.id = ?",
            [" ", ' ', ' ', req.params.id]);
          if (contract.length == 1) {
            res.status(200).send({ contract: contract[0] });
            return
          }
          else {
            res.status(403).send('قرارداد در سامانه پیدا نشد');
          }
          break
        case 'company':
          var [
            contract,
          ] = await pp.query(
            "select t2.national_id, t1.activity, t1.contractor_type, t1.main_contract_id_fk as main_contract_id, t1.contractor_id, DATE_FORMAT(t1.date, '%Y/%m/%d') as date, DATE_FORMAT(t1.start_date, '%Y/%m/%d') as start_date, DATE_FORMAT(t1.end_date, '%Y/%m/%d') as end_date, t1.id ,t1.initial_amount, t1.row,t1.supervision, t1.number as number, t1.subject, t1.employer, t2.name, t3.id as employer1_id, t3.name as employer1, t1.workshop_code, t1.type, t4.id as manager_id, CONCAT(t4.first_name, ?, t4.last_name) as manager, t4.national_number as manager_national_num,t5.id as boss_id,  CONCAT(t5.first_name, ?, t5.last_name) as boss, t5.national_number as boss_national_num from contract as t1 inner join company as t2 on t1.contractor_id = t2.id left join company as t3 on t1.employer_id = t3.id left join personnel as t4 on t1.manager_id = t4.id left join personnel as t5 on t1.boss_id = t5.id where t1.id = ?",
            [" ", " ", req.params.id]
          );
          if (contract.length == 1) {
            res.status(200).send({
              contract: contract[0]
            })
            return
          }
          else {
            res.status(403).send('قرارداد در سامانه وارد نشده است');
          }
          break
        default:
          break;
      }
    }
    else {
      res.status(403).send('قرارداد در سامانه پیدا نشد');
    }

  });


  app.delete("/api/admin/contract", auth.isInRoles('contract/delete'), async (req, res) => {

    if (req.body.id) {
      var _arr = req.body.id;


      for (let i = 0; i < _arr.length; i++) {
        await pp.query("update contract set deleted = ? where id = ? and (can_delete <> ? or can_delete is null)", [
          true,
          _arr[i],
          0
        ]);
      }
      res.status(200).send('done');
    }
    else {
      res.status(403).send('incomplete request');
    }
  });


  app.get('/api/admin/contract/find/:code/:raw/:companyId', auth.authorized, async (req, res) => {
    try {

      if (req.params.companyId != "-1") {
        var [list] = await pp.query('select * from contract where row=? and workshop_code=? and contractor_id=?', [
          req.params.raw,
          req.params.code,
          req.params.companyId
        ])
        if (list.length == 1) {

          var [insurance] = await pp.query('select * from insurance_tamin where contract_id_fk = ? order by id desc limit 1', [
            list[0].id
          ]);

          res.status(200).send({
            item: list[0],
            insurance: insurance[0]
          });
        }
        else {
          res.status(403).send("contract has not been found");
        }
      }
      else {
        var [list] = await pp.query('select * from contract where row=? and workshop_code=?', [
          req.params.raw,
          req.params.code
        ])
        if (list.length == 1) {

          var [insurance] = await pp.query('select * from insurance_tamin where contract_id_fk = ? order by year desc, month desc', [
            list[0].id
          ]);

          res.status(200).send({
            item: list[0],
            insurance: insurance[0]
          });
        }
        else {
          res.status(403).send("contract has not been found");
        }
      }
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  });

  app.get('/api/admin/contract/progress/:contractId', auth.authorized, async (req, res) => {
    try {
      const [contract] = await pp.query('select t1.*, t2.first_name as manager_firstname, t2.last_name as manager_lastname from contract as t1 inner join personnel as t2 on t1.manager_id = t2.id  where t1.id=?', [req.params.contractId]);

      const cmd = `select * from contract_progress where contract_id_fk=${req.params.contractId}`;
      const [list] = await pp.query(cmd);
      const hash = await crypt.encrypt(cmd);

      const [progress_operator] = await pp.query("select t1.personnel_id_fk as pid, t1.contract_id_fk as cid, t2.first_name, t2.last_name, (select count(id) from personnel_access where contract_id_fk=cid and personnel_id_fk=pid and access='contract/progress-approve') as count from personnel_access as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id where  t1.contract_id_fk=? and t1.access=? having count=0", [
        req.params.contractId,
        'contract/progress-add-edit'
      ]);


      res.status(200).send({
        contract: contract[0],
        operator: progress_operator.length > 0 ? progress_operator[0] : null,
        list: list,
        hash: hash
      });
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  })

  app.get('/api/admin/contract/production-report/:contractId', auth.authorized, async (req, res) => {
    try {
      const [contract] = await pp.query('select t1.*, t2.first_name as manager_firstname, t2.last_name as manager_lastname from contract as t1 inner join personnel as t2 on t1.manager_id = t2.id  where t1.id=?', [req.params.contractId]);

      const cmd = `select * from contract_production_report where contract_id_fk=${req.params.contractId}`;
      const [list] = await pp.query(cmd);
      const hash = await crypt.encrypt(cmd);

      const [progress_operator] = await pp.query("select t1.personnel_id_fk as pid, t1.contract_id_fk as cid, t2.first_name, t2.last_name, (select count(id) from personnel_access where contract_id_fk=cid and personnel_id_fk=pid and access='contract/production-report-approve') as count from personnel_access as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id where  t1.contract_id_fk=? and t1.access=? having count=0", [
        req.params.contractId,
        'contract/production-report-add-edit'
      ]);

      const finalList = JSON.parse(JSON.stringify(list));
      let total_tonnage = 0;
      let total_load = 0;

      for (let i = 0; i < finalList.length; i++) {
        finalList[i].total_tonnage = Number(finalList[i].stone_tonnage) + Number(finalList[i].dust_tonnage);
        finalList[i].total_load = Number(finalList[i].stone_load_quantity) + Number(finalList[i].dust_load_quantity);
        finalList[i].stone_tonnage_avg = Number(finalList[i].stone_tonnage) / Number(finalList[i].stone_load_quantity);
        finalList[i].dust_tonnage_avg = Number(finalList[i].dust_tonnage) / Number(finalList[i].dust_load_quantity);
      }

      res.status(200).send({
        contract: contract[0],
        operator: progress_operator.length > 0 ? progress_operator[0] : null,
        list: finalList,
        hash: hash
      });
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  })

  app.get('/api/admin/contract/peyman-report/:contractId', auth.authorized, async (req, res) => {
    try {
      const [contract] = await pp.query('select t1.*, t2.first_name as manager_firstname, t2.last_name as manager_lastname from contract as t1 inner join personnel as t2 on t1.manager_id = t2.id  where t1.id=?', [req.params.contractId]);

      const cmd = `select edit_by_admin, DATE(date) as date, sum(disabled_car_no_tier_quantity) as total_disabled_car_no_tier, sum(disabled_car_no_part_quantity) as total_disabled_car_no_part, sum(disabled_car_no_tier_quantity + disabled_car_no_part_quantity) as total_disable, sum(active_car_quantity) as total_active, sum(disabled_car_no_tier_quantity + disabled_car_no_part_quantity + active_car_quantity) as total_car, sum(disabled_car_no_tier_quantity + disabled_car_no_part_quantity + active_car_quantity + ready_to_work_car_quantity) as total_baje_cars, ready_to_work_factor, id, contract_id_fk, status from contract_peyman_report where contract_id_fk=${req.params.contractId} group by DATE(date) `;

      const [list] = await pp.query(cmd);
      const hash = await crypt.encrypt(cmd);

      const [progress_operator] = await pp.query("select t1.personnel_id_fk as pid, t1.contract_id_fk as cid, t2.first_name, t2.last_name, (select count(id) from personnel_access where contract_id_fk=cid and personnel_id_fk=pid and access='contract/peyman-report-approve') as count from personnel_access as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id where  t1.contract_id_fk=? and t1.access=? having count=0", [
        req.params.contractId,
        'contract/peyman-report-add-edit'
      ]);



      // for(let i=0;i<finalList.length;i++) { 
      //   finalList[i].total_tonnage = Number(finalList[i].stone_tonnage) + Number(finalList[i].dust_tonnage);
      //   finalList[i].total_load = Number(finalList[i].stone_load_quantity) + Number(finalList[i].dust_load_quantity);
      //   finalList[i].stone_tonnage_avg = Number(finalList[i].stone_tonnage) / Number(finalList[i].stone_load_quantity);
      //   finalList[i].dust_tonnage_avg = Number(finalList[i].dust_tonnage) / Number(finalList[i].dust_load_quantity);
      // }

      res.status(200).send({
        contract: contract[0],
        operator: progress_operator.length > 0 ? progress_operator[0] : null,
        list: list,
        hash: hash
      });
    }
    catch (err) {
      console.log(err);
      res.status(403).send('error occured');
    }
  });


  app.put('/api/admin/contract/progress', auth.authorized, async (req, res) => {
    try {
      if (req.body.contractId) {
        const arr = req.body.data;

        for (let i = 0; i < arr.length; i++) {
          if ((arr[i].program_progress || arr[i].status || arr[i].real_progress) && arr[i].id) {
            let filter = '';
            let isAdmin = false;

            if (arr[i].program_progress) {
              isAdmin = true;
              filter = `program_progress = ${arr[i].program_progress}`;
            }

            if (arr[i].real_progress) {
              isAdmin = true;
              filter += `,real_progress=${arr[i].real_progress}`;
            }

            if (arr[i].status) {
              filter += `,status='${arr[i].status}'`;
            }

            if (filter.startsWith(',')) {
              filter = filter.substring(1, filter.length);
            }



            await pp.query(`update contract_progress set ${filter} where id=${arr[i].id}`);

            //if manager, edit_by_admin must be 1
            if (isAdmin) {
              const [contractAdmin] = await pp.query('select * from contract where manager_id=? and id=?', [req.user.id, req.body.contractId]);
              if (contractAdmin.length > 0) {
                await pp.query('update contract_progress set edit_by_admin=1 where id=?', [arr[i].id]);
              }
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
      console.log(err);
      res.status(403).send('error occured');
    }
  })

  app.post('/api/admin/contract/filter/type', auth.authorized, async (req, res) => {
    try {
      if (req.body.type && req.body.activity && req.body.companyId) {
        if (req.body.type == 'main') {
          req.body.type = 'main_civil'
        };


        if (req.user.super) {
          if (req.body.companyId == '-1') {
            const cmd = `select * from contract where activity='${req.body.activity}' and type='${req.body.type}' and contractor_type='company'`;
            const [list] = await pp.query(cmd);
            const hash = await crypt.encrypt(JSON.stringify(cmd));
            res.status(200).send({
              list: list,
              hash: hash
            });
          }
          else {
            const cmd = `select * from contract where activity='${req.body.activity}' and type='${req.body.type}' and contractor_type='company' and contractor_id=${req.body.companyId}`;
            const [list] = await pp.query(cmd);
            const hash = await crypt.encrypt(cmd);
            res.status(200).send({
              list: list,
              hash: hash
            });
          }
        }
        else {
          const [myAccess] = await pp.query('select * from personnel_access where access=? and personnel_id_fk=?', ['contract/list', req.user.id]);

          const contracts = [];
          const companies = [];
          myAccess.forEach(item => {
            contracts.push(item.contract_id_fk);
            companies.push(item.company_id_fk);
          });



          if (req.body.companyId == '-1') {
            const cmd = `select * from contract where activity='${req.body.activity}' and type='${req.body.type}' and id IN (${contracts.toString()})`;
            const [list] = await pp.query(cmd);
            const hash = await crypt.encrypt(cmd);
            res.status(200).send({
              list: list,
              hash: hash
            });
          }
          else {
            if (companies.indexOf(parseInt(req.body.companyId)) > -1) {
              const cmd = `select * from contract where activity='${req.body.activity}' and type='${req.body.type}' and contractor_type='company' and contractor_id=${req.body.companyId}`;
              const [list] = await pp.query(cmd);
              const hash = await crypt.encrypt(cmd);
              res.status(200).send({
                list: list,
                hash: hash
              });
            }
            else {
              res.status(403).send('you do not have permission to list contracts of this company');
            }
          }
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

  app.put('/api/admin/contract/production/report', auth.authorized, async (req, res) => {
    try {
      if (req.body.contractId) {
        const arr = req.body.data;

        for (let i = 0; i < arr.length; i++) {
          if ((arr[i].stone_tonnage || arr[i].dust_tonnage || arr[i].stone_load_quantity || arr[i].dust_load_quantity || arr[i].status) && arr[i].id) {
            let filter = '';
            let isAdmin = false;

            if (arr[i].stone_tonnage) {
              isAdmin = true;
              filter = `stone_tonnage = ${arr[i].stone_tonnage}`;
            }

            if (arr[i].dust_tonnage) {
              isAdmin = true;
              filter += `,dust_tonnage=${arr[i].dust_tonnage}`;
            }

            if (arr[i].stone_load_quantity) {
              isAdmin = true;
              filter += `,stone_load_quantity='${arr[i].stone_load_quantity}'`;
            }

            if (arr[i].dust_load_quantity) {
              isAdmin = true;
              filter += `,dust_load_quantity='${arr[i].dust_load_quantity}'`;
            }

            if (arr[i].status) {
              filter += `,status='${arr[i].status}'`;
            }

            if (arr[i].description) {
              isAdmin = true;
              filter += `,description='${arr[i].description}'`;
            }

            if (filter.startsWith(',')) {
              filter = filter.substring(1, filter.length);
            }


            await pp.query(`update contract_production_report set ${filter} where id=${arr[i].id}`);

            //if manager, edit_by_admin must be 1
            if (isAdmin) {
              const [contractAdmin] = await pp.query('select * from contract where manager_id=? and id=?', [req.user.id, req.body.contractId]);
              if (contractAdmin.length > 0) {
                await pp.query('update contract_production_report set edit_by_admin=1 where id=?', [arr[i].id]);
              }
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
      console.log(err);
      res.status(403).send('error occured');
    }
  })

  app.put('/api/admin/contract/peyman/report', auth.authorized, async (req, res) => {
    try {
      if (req.body.contractId) {
        const arr = req.body.data;

        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id) {
            let filter = '';
            let isAdmin = false;

            if (arr[i].disabled_car_no_tier_quantity) {
              isAdmin = true;
              filter = `disabled_car_no_tier_quantity = ${arr[i].disabled_car_no_tier_quantity}`;
            }

            if (arr[i].ready_to_work_car_quantity) {
              isAdmin = true;
              filter = `ready_to_work_car_quantity = ${arr[i].ready_to_work_car_quantity}`;
            }

            if (arr[i].disabled_car_no_part_quantity) {
              isAdmin = true;
              filter += `,disabled_car_no_part_quantity=${arr[i].disabled_car_no_part_quantity}`;
            }

            if (arr[i].active_car_quantity) {
              isAdmin = true;
              filter += `,active_car_quantity=${arr[i].active_car_quantity}`;
            }

            if (arr[i].ready_to_work_factor) {
              isAdmin = true;
              filter += `,ready_to_work_factor=${arr[i].ready_to_work_factor}`;
            }

            if (arr[i].status) {
              filter += `,status='${arr[i].status}'`;
            }

            if (arr[i].description) {
              isAdmin = true;
              filter += `, description='${arr[i].description}'`
            }

            if (filter.startsWith(',')) {
              filter = filter.substring(1, filter.length);
            }

            await pp.query(`update contract_peyman_report set ${filter} where id=${arr[i].id}`);

            if (isAdmin) {
              const [contractAdmin] = await pp.query('select * from contract where manager_id=? and id=?', [req.user.id, req.body.contractId]);
              if (contractAdmin.length > 0) {
                await pp.query('update contract_peyman_report set edit_by_admin=1 where id=?', [arr[i].id]);
              }
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
      console.log(err);
      res.status(403).send('error occured');
    }
  })
  app.get('/api/admin/contract/production/detail/:id', auth.authorized, async (req, res) => {
    try {
      const [item] = await pp.query('select * from contract_production_report where id=?', [req.params.id]);
      res.status(200).send(item[0]);
    }
    catch (err) {
      throw err;
    }
  })

  app.get('/api/admin/contract/peyman/detail/:id', auth.authorized, async (req, res) => {
    try {
      const [item] = await pp.query('select * from contract_peyman_report where id=?', [req.params.id]);
      res.status(200).send(item[0]);
    }
    catch (err) {
      throw err;
    }
  })

  app.post('/api/admin/contract/report/dashboard/access', auth.authorized, async (req, res) => {
    try {
      if (req.body.start_date && req.body.end_date) {
        
        //check user contracts
        let cmd = `select t3.id, t3.name as company_name  from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk=t2.id inner join company as t3 on t1.company_id_fk = t3.id where t1.access='contract/dashboard-report' and DATE(t2.start_date) <= '${req.body.start_date}' and DATE(end_date) >= '${req.body.end_date}' and (type='main_civil' or type='main_non_civil') and t1.personnel_id_fk=${req.user.id}`;

        if(req.user.super) { 

          cmd=`select t2.id, t2.name as company_name from contract as t1
          inner join company as t2 on t1.contractor_id = t2.id
          where
          DATE(t1.start_date) <= '${req.body.start_date}'
          and DATE(t1.end_date) >= '${req.body.end_date}'
          and (t1.type='main_civil' or t1.type='main_non_civil')`
        }


        if(req.body.activity) { 
          cmd += ` and activity='${req.body.activity}'`;
        }

        if(!req.user.super){ 
          cmd += ' group by t3.id, t3.name';
        }
        else { 
          cmd += ' group by t2.id'
        }
        
        const [list] = await pp.query(cmd);

        

        const output = [];

        for(let i=0;i<list.length;i++) { 
          const m = {
            title: list[i].company_name,
            value: list[i].id,
            children: []
          };

          let _cmd = `select t2.id, t2.subject  from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk=t2.id inner join company as t3 on t1.company_id_fk = t3.id where t1.access='contract/dashboard-report' and DATE(t2.start_date) <= '${req.body.start_date}' and DATE(end_date) >= '${req.body.end_date}' and (t2.type='main_civil' or t2.type='main_non_civil') and t2.contractor_id=${list[i].id} and t1.company_id_fk=${list[i].id} and t1.personnel_id_fk=${req.user.id}`;


          if(req.user.super) { 
            // _cmd = `select t2.id, t2.subject  from personnel_access as t1 inner join contract as t2 on t1.contract_id_fk=t2.id inner join company as t3 on t1.company_id_fk = t3.id where t1.access='contract/dashboard-report' and DATE(t2.start_date) <= '${req.body.start_date}' and DATE(end_date) >= '${req.body.end_date}' and (t2.type='main_civil' or t2.type='main_non_civil') and t2.contractor_id=${list[i].id} and t1.company_id_fk=${list[i].id} group by t2.id`;
            _cmd = `select id, subject from contract 
            where contractor_id=${list[i].id} and (type='main_civil' or type='main_non_civil')
            and DATE(start_date) <= '${req.body.start_date}' and DATE(end_date) >= '${req.body.end_date}';`
          }

          const [contracts] = await pp.query(_cmd);

          
          

          for(j=0;j<contracts.length;j++) { 
            m.children.push({
              title: contracts[j].subject,
              value: contracts[j].id
            })
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
      res.status(403).send('error occured');
    }
  })

  app.post('/api/admin/contract/report/production/daily', auth.authorized, async(req, res) => { 
    try{
      if(req.body.report_date && req.body.contracts) { 
        const arr = req.body.contracts;

        const cmd = `select t1.*, t3.name as company_name, t2.subject as contract_name from contract_production_report as t1 inner join contract as t2 on t1.contract_id_fk=t2.id inner join company as t3 on t2.contractor_id = t3.id where DATE(t1.date) = '${req.body.report_date}' and contract_id_fk in (${arr.toString()})`;

        const [list] = await pp.query(cmd);
        res.status(200).send(list);
      }
      else {
        res.status(403).send('incomplete request');
      }
    }
    catch(err){
      res.status(403).send('error occured');
    }
  });

  app.post('/api/admin/contract/report/production/periodically', auth.authorized, async(req, res) => { 
    try{
      if(req.body.start_date && req.body.end_date && req.body.contracts) { 
        const arr = req.body.contracts;

        
        const cmd = `select t2.name as company_name, t2.id as company_id, t1.id as contract_id_fk, t1.subject as contract_name from contract as t1 inner join company as t2 on t1.contractor_id = t2.id where t1.id in (${arr.toString()})`;

        const [companies] = await pp.query(cmd);


        

        const output = [];

        for(let i=0; i<companies.length; i++) { 
          const m = {
            company_name: companies[i].company_name,
            contract_name: companies[i].contract_name,
            contract_id_fk: companies[i].contract_id_fk,
            company_id: companies[i].company_id
          }

          const [list] = await pp.query('select *, (dust_tonnage + stone_tonnage) as total_tonnage, (dust_load_quantity + stone_load_quantity) as total_load  from contract_production_report where contract_id_fk=? and (DATE(date) between ? and ?) order by date', [m.contract_id_fk,
          req.body.start_date,
          req.body.end_date
          ]);
          m.reports = list;

          output.push(m);
        }

        res.status(200).send(output);
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

  app.post('/api/admin/contract/report/progress', auth.authorized, async(req, res) => { 
    try{
      if(req.body.contracts && req.body.start_date && req.body.end_date) { 

        const cmd = `select t1.subject, t1.id as contract_id_fk, t2.name, t2.id as company_id from contract as t1 inner join company as t2 on t1.contractor_id = t2.id where t1.id in (${req.body.contracts.toString()})`;

        const [contracts] = await pp.query(cmd);

        const output = [];

        for(let i=0;i<contracts.length; i++) { 
          const [list] = await pp.query('select id, program_progress, real_progress, date from contract_progress where contract_id_fk=? and (DATE(date) between ? and ?)', [
            contracts[i].contract_id_fk,
            req.body.start_date,
            req.body.end_date
          ]);
          const m = { 
            company_id: contracts[i].company_id,
            contract_name: contracts[i].subject,
            contract_id_fk : contracts[i].contract_id_fk,
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
    catch(err){
      console.log(err);
      res.status(403).send('error occured');
    }
  })

});