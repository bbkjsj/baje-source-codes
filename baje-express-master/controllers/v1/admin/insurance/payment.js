const auth = require('../../../../middlewares/auth');
const multer = require('multer');
const path = require('path');
const moment = require('moment');


module.exports = ((app) => {
    const prefix = '/api/insurance/payment'
    const pp = app.get('pool').promise();


    var paymentStorage = multer.diskStorage({
        destination: './_uploads/insurance',
        filename: function (req, file, cb) {
            var filename = `${moment().utc(true).format('YYMMDDhhmmss')}`;
            var extension = path.extname(file.originalname);
            filename = `${filename}${extension}`;
            cb(null, filename);
        }
    });

    var paymentMulter = multer({storage: paymentStorage});

    app.post(`${prefix}`, auth.authorized, paymentMulter.single('file'),  async (req, res) => {
        try {
            if (req.body.paid_for && req.body.insured_share && req.body.jobless_share && req.body.penalty_share && req.body.execution_share) {
                var filepath = '';
                if (req.file) {
                    filepath = `${req.file.path}`;
                }

                await pp.query('insert into insurance_payment (paid_for, insurance_tamin_id_fk, installment_number, periodic_debt_start_date, periodic_debt_end_date, estimated_debt, peiman_insured_share, insured_share, jobless_share, penalty_share, execution_share, pay_date, file_url, status) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                    req.body.paid_for,
                    req.body.insurance_id,
                    req.body.installment_number,
                    req.body.periodic_debt_start_date,
                    req.body.periodic_debt_end_date,
                    req.body.estimated_debt,
                    req.body.peiman_insured_share,
                    req.body.insured_share,
                    req.body.jobless_share,
                    req.body.penalty_share,
                    req.body.execution_share,
                    req.body.pay_date,
                    filepath,
                    0
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
    });

    app.put(`${prefix}/:id`, auth.authorized,  paymentMulter.single('file'),  async(req, res) => {
        try {
            if (req.body.paid_for && req.body.insured_share && req.body.jobless_share && req.body.penalty_share && req.body.execution_share) {
                var filepath = '';
                if (req.file) {
                    filepath = `${req.file.path}`;
                }

                await pp.query('update insurance_payment set paid_for=?, insurance_tamin_id_fk=?, installment_number=?, periodic_debt_start_date=? , periodic_debt_end_date=?, estimated_debt=?, peiman_insured_share=?, insured_share=?, jobless_share=?, penalty_share=?, execution_share=?, pay_date=?, file_url=?, status=? where id=?', [
                    req.body.paid_for,
                    req.body.insurance_id,
                    req.body.installment_number,
                    req.body.periodic_debt_start_date,
                    req.body.periodic_debt_end_date,
                    req.body.estimated_debt,
                    req.body.peiman_insured_share,
                    req.body.insured_share,
                    req.body.jobless_share,
                    req.body.penalty_share,
                    req.body.execution_share,
                    req.body.pay_date,
                    filepath,
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

    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try {
            var [list] = await pp.query('select * from insurance_payment where id=?', [req.params.id]);
            res.status(200).send(list[0]);
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/status/:id`, auth.authorized, async(req, res) => {
        try {
            if(req.body.status) { 
                await pp.query('update insurance_payment set status=? where id=?', [req.body.status, req.params.id]);
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


    app.get(`${prefix}`, auth.authorized, async(req, res) => {
        try {
            var [list] = await pp.query('select id, paid_for, (insured_share+jobless_share+penalty_share+execution_share) as total, status from insurance_payment');
            res.status(200).send(list);
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
                    await pp.query('delete from insurance_payment where id=?', [arr[i]]);
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
})