const auth = require('../../../middlewares/auth');
const moment = require('moment');
const crypt = require('../../../helpers/crypt');

module.exports = ((app) => {
    const prefix = '/api/imprest';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            if (req.body.personnel_id && req.body.amount && req.body.installment && req.body.company_id) {
                await pp.query('insert into imprest (personnel_id_fk, amount, number_of_installment, description, date, company_id_fk) values (?,?,?,?,?,?)', [
                    req.body.personnel_id,
                    req.body.amount,
                    req.body.installment,
                    req.body.description,
                    moment().utc(true).format('YYYY-MM-DD HH:mm:ss'),
                    req.body.company_id
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

    app.get(`${prefix}/item/:id`, auth.authorized, async(req, res) => { 
        var [item] = await pp.query('select * from imprest where id=?', [req.params.id]);
        res.status(200).send(item[0]);
    });

    app.get(`${prefix}/:personnel_id`,auth.authorized, async (req, res) => {
        try {
            var cmd = '';
            console.log(req.user);
            if(req.user.companyId == null || req.user.companyId == -1) { 
                res.status(403).send('user is not a member of a company');
                return;
            }
            if (req.user.isSuper) {
                if (req.params.personnel_id == -1) {
                    cmd = `select t1.id, t3.name as company_name, t2.first_name, t2.last_name, t2.national_number, t1.amount, t1.number_of_installment, t1.project_manager_status, t1.paid_amount from imprest as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id inner join company as t3 on t1.company_id_fk=t3.id`;
                }
                else {
                    cmd = `select t1.id, t3.name as company_name, t2.first_name, t2.last_name, t2.national_number, t1.amount, t1.number_of_installment, t1.project_manager_status, t1.paid_amount from imprest as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id inner join company as t3 on t1.company_id_fk=t3.id where t1.personnel_id_fk = ${req.params.personnel_id}`;
                }
            }
            else {
                if (req.params.personnel_id == -1) {
                    cmd = `select t1.id,t2.first_name, t2.last_name, t2.national_number, t1.amount, t1.number_of_installment, t1.project_manager_status, t1.paid_amount from imprest as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.company_id_fk = ${req.user.companyId}`;
                }
                else {
                    cmd = `select t1.id, t2.first_name, t2.last_name, t2.national_number, t1.amount, t1.number_of_installment, t1.project_manager_status, t1.paid_amount from imprest as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.company_id_fk = ${req.user.companyId} and t1.personnel_id_fk=${req.params.personnel_id}`;
                }
            }

           

            var [list] = await pp.query(cmd);
            var hash = crypt.encrypt(cmd);
            hash = hash.replace(/\//g, '__');
            res.status(200).send({
                list: list,
                export: hash
            });
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    
    app.put(`${prefix}/:id`, async(req, res) => {
        try {
            if (req.body.personnel_id && req.body.amount && req.body.installment && req.body.company_id) {
                await pp.query('update imprest set personnel_id_fk=?, amount=?, number_of_installment=?, description=?, company_id_fk=? where id=?', [
                    req.body.personnel_id,
                    req.body.amount,
                    req.body.installment,
                    req.body.description,
                    req.body.company_id,
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

    app.delete(`${prefix}`, async(req, res) => {
        try{
            if(req.body.ids) { 
                var arr = req.body.ids;
                for(let i=0;i<arr.length;i++) { 
                    await pp.query('delete from imprest where id=?', [arr[i]]);
                }
                res.status(200).send('done');
            }
            else { 
                res.status(403).send('incomplete request');
            }
        }
        catch(err) {
            res.status(403).send('error occured');
        }
    })

})
