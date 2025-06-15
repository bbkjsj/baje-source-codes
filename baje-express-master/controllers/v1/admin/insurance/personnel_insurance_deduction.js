const auth = require('../../../../middlewares/auth');

module.exports = ((app) => {
    const prefix = '/api/insurance/deduction';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, async (req, res) => {
        try {
            if (req.body.payment_method && req.body.amount && req.body.personnel_id && req.body.insurance_id) {
                await pp.query('insert into personnel_insurance_deduction (payment_method, year, month, document_number, document_date, payment_date, description, amount, personnel_id_fk, insurance_id_fk) values (?,?,?,?,?,?,?,?,?,?)', [
                    req.body.payment_method,
                    req.body.year,
                    req.body.month,
                    req.body.document_number,
                    req.body.document_date,
                    req.body.payment_date,
                    req.body.description,
                    req.body.amount,
                    req.body.personnel_id,
                    req.body.insurance_id
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

    app.get(`${prefix}/personnel/:id`, auth.authorized, async(req, res) => {
        try {
            var [list] = await pp.query('select * from personnel_insurance_deduction where personnel_id_fk=?', [req.params.id]);
            res.status(200).send(list);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            var [item] = await pp.query('select * from personnel_insurance_deduction where id=?', [req.params.id]);
            res.status(200).send(item[0]);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.*, t2.first_name, t2.last_name, t2.national_number from personnel_insurance_deduction as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id');
            res.status(200).send(list);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.put(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            let cmd = `update personnel_insurance_deduction set `;

            if(req.body.payment_method) {
                cmd += ` payment_method = '${req.body.payment_method}',`;
            }

            if(req.body.year) {
                cmd += `year = '${req.body.year}',`;
            }

            if(req.body.month) {
                cmd += `month = '${req.body.month}',`
            }

            if(req.body.document_number) {
                cmd += `document_number='${req.body.document_number}',`;
            }

            if(req.body.document_date){
                cmd += `document_date = '${req.body.document_date}',`;
            }

            if(req.body.payment_date) { 
                cmd += `payment_date = '${req.body.payment_date}',`;
            }

            if(req.body.description) {
                cmd += `description = '${req.body.description}',`;
            }

            if(req.body.amount) { 
                cmd += `amount= ${req.body.amount},`;
            }

            if(req.body.personnel_id){
                cmd += `personnel_id_fk=${req.body.personnel_id},`;
            }

            if(req.body.insurance_id) {
                cmd += `insurance_id_fk=${req.body.insurance_id},`;
            }

            if(cmd.endsWith(',')) { 
                cmd = cmd.substring(0, cmd.length - 1);
            }

            cmd += ` where id=${req.params.id}`;
            
            
            await pp.query(cmd);
            
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.delete(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try{
            const arr = req.body.ids;
            for(let i=0;i<arr.length;i++) { 
                await pp.query('delete from personnel_insurance_deduction where id=?', [arr[i]]);
            }
            res.status(200).send('done');
        }
        catch(err) { 
            res.status(403).send('error occured');
        }
    });
});