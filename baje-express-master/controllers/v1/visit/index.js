const auth = require('../../../middlewares/auth');


module.exports = ((app) => {
    const prefix = '/api/visit';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            
            if (req.body.personnel_id && req.body.result) {
                await pp.query('insert into doctor_visit (visit_date, doctor_id_fk, result, approved_position_code, next_visit_date, special_description, personnel_id_fk) values (?,?,?,?,?,?,?)', [
                    req.body.visit_date,
                    req.user.id,
                    req.body.result,
                    req.body.approved_position_code,
                    req.body.next_visit_date,
                    req.body.special_description,
                    req.body.personnel_id
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


    app.get(`${prefix}/:type/:company_id/:contract_id`, auth.authorized, async (req, res) => {
        try {
            var company_id = req.params.company_id == '-1' ? '%%' : req.params.company_id;
            var contract_id = req.params.contract_id == '-1' ? '%%' : req.params.contract_id;

            var list = [];

            if (req.params.type == 'notvisited') {
                var cmd = `select t1.id as personnel_id, t1.first_name, t1.last_name, t1.national_number, t1.mobile1 as mobile, t1.birth_date from personnel as t1  where t1.contract_id_fk like '${contract_id}' and t1.company_id_fk like '${company_id}' and not exists (select * from doctor_visit as t2 where t2.personnel_id_fk = t1.id)`;
                
                var [list] = await pp.query(cmd);
                res.status(200).send(list);
                return;
            }
            else if (req.params.type == 'visited') {
                var cmd = `select t1.id as personnel_id,  t1.first_name, t1.last_name, t1.national_number, t1.birth_date, t1.mobile1 as mobile from personnel as t1 inner join doctor_visit as t2 on t1.id = t2.personnel_id_fk where t1.company_id_fk like '${company_id}' and t1.contract_id_fk like '${contract_id}' group by t1.id`;

                var [list] = await pp.query(cmd);
                res.status(200).send(list);
                return;
            }
            res.status(403).send('problem');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }

    })

    app.get(`${prefix}/history/:id`,  async(req, res) => { 
        try{
            var [list] = await pp.query('select t1.id, t3.title as approved_position, t1.visit_date, t2.first_name, t2.last_name, t1.result, t3.title from doctor_visit as t1 inner join personnel as t2 on t1.doctor_id_fk = t2.id left join job_title as t3 on t1.approved_position_code = t3.id where t1.personnel_id_fk = ?', [req.params.id]);
            res.status(200).send(list);
        }
        catch(err) { 
            res.status(403).send('error occured');
            console.log(err);
        }
    });
})