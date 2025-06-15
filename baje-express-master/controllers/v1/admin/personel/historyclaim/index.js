const auth = require('../../../../../middlewares/auth');

module.exports = ((app) => {
    const pp = app.get('pool').promise();
    const prefix = '/api/hclaim';


    app.post(`${prefix}`, auth.authorized, async(req, res) => { 
        if(req.body.workshop_code && req.body.row && req.body.personnel_id) { 
            try{
                var [contract] = await pp.query('select * from contract where workshop_code=? and row=?', [req.body.workshop_code, req.body.row]);
                if(contract.length == 1) { 
                    await pp.query('insert into insurance_history_claim (personnel_id_fk, workshop_code, row, year, month, number_of_days, salary_bonus, status, register_number, register_date, debt, contract_id_fk) values (?,?,?,?,?,?,?,?,?,?,?,?);', [
                        req.body.personnel_id ,
                        req.body.workshop_code, 
                        req.body.row, 
                        req.body.year, 
                        req.body.month, 
                        req.body.number_of_days, 
                        req.body.salar_bonus, 
                        req.body.status, 
                        req.body.register_number, 
                        req.body.register_date, 
                        req.body.debt,
                        contract[0].id]
                    );
                    
                    res.status(200).send('done');
                }
                else { 
                    res.status(403).send('کدکارگاهی / شماره ردیف معتبر نمیباشد');
                }
                
            }
            catch(err) { 
                console.log(err);
                res.status(403).send('error occured');
            }
        }
        else { 
            res.status(403).send('incomplete request');
        }
    })

    app.get(`${prefix}/filter/:filter/:contract_id`, auth.authorized, async(req, res) => {
        try{
            
            var [list] = await pp.query('select t1.* , t2.first_name, t2.last_name, t2.national_number from insurance_history_claim as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.status=? and t1.contract_id_fk=?', [req.params.filter, req.params.contract_id]);
            res.status(200).send(list);
        }
        catch(err) {
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/item/:id`, auth.authorized, async(req, res) => {
        try{
            var [item] = await pp.query('select t1.personnel_id_fk as personnel_id, t1.id, t2.first_name, t2.last_name, t2.national_number, t1.workshop_code, t1.row, t1.year, t1.month, t1.register_date, t1.number_of_days, t1.salary_bonus, t1.status from insurance_history_claim as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id = ?', [req.params.id]);
            if(item.length == 1) { 
                res.status(200).send(item[0]);
            }
            else { 
                res.status(403).send('person could not be found');
            }
        }
        catch(err) {
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/:national_code`, auth.authorized, async(req, res) => { 
        try{
            var [person] = await pp.query('select t1.id, t1.first_name, t1.last_name, t1.contract_id_fk as contract_id, t3.name as company_name, t2.row, t2.workshop_code  from personnel as t1 inner join contract as t2 on t1.contract_id_fk = t2.id inner join company as t3 on t1.company_id_fk = t3.id where t1.national_number = ?', [req.params.national_code]);
           
            if(person.length > 0) { 
                res.status(200).send(person[0]);
            }
            else { 
                res.status(403).send('person could not be found');
            }
        }
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}`, auth.authorized, async(req, res) => { 
        try{ 
            var [list] = await pp.query('select t1.id, t2.first_name, t2.last_name, t2.national_number, t1.workshop_code, t1.row, concat(t1.year, " ", t1.month) as period, t1.number_of_days, t1.salary_bonus, t1.status from insurance_history_claim as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id');
            res.status(200).send(list);
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.put(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try {
            if(req.body.workshop_code && req.body.row && req.body.personnel_id) { 
                try{
                    await pp.query('update insurance_history_claim set personnel_id_fk=?, workshop_code=?, row=?, year=?, month=?, number_of_days=?, salary_bonus=?, status=?, register_number=?, register_date=?, debt=?  where id=?', [
                        req.body.personnel_id ,
                        req.body.workshop_code, 
                        req.body.row, 
                        req.body.year, 
                        req.body.month, 
                        req.body.number_of_days, 
                        req.body.salar_bonus, 
                        req.body.status, 
                        req.body.register_number, 
                        req.body.register_date, 
                        req.body.debt,
                        req.params.id]);
                    res.status(200).send('done');
                }
                catch(err) { 
                    console.log(err);
                    res.status(403).send('error occured');
                }
            }
            else { 
                res.status(403).send('incomplete request');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.delete(`${prefix}`, auth.authorized, async(req, res) => {
        try {
            if(req.body.ids) { 
                var arr = req.body.ids;
                for(let i=0;i<arr.length;i++) { 
                    await pp.query('delete from insurance_history_claim where id=?', [arr[i]]);
                }
                res.status(200).send('done');
            }
            else { 
                res.status(403).send('incomplete request');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/status/:id`, auth.authorized, async(req, res) => {
        try {
            if(req.body.status != null) { 
                await pp.query('update insurance_history_claim set status=? where id=?', [
                    req.body.status,
                    req.params.id
                ]);
                res.status(200).send('done');
            }
            else { 
                res.status(403).send('incomplete request');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });
})