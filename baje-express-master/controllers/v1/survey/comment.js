
const moment = require('moment');
const auth = require('../../../middlewares/auth');


module.exports = ((app) => {
    const prefix = '/api/survey/forum';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async(req, res) => {
        try {
            if(req.body.description && req.body.adv_dis_id && req.body.type) { 
                var insert = await pp.query('insert into survey_advdis_comment (survey_advdis_id_fk, date, personnel_id_fk, description, type) values (?,?,?,?,?)', [
                    req.body.adv_dis_id,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.user.id,
                    req.body.description,
                    req.body.type
                ]);
                res.status(200).send({ id: insert[0].insertId } );
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

    app.delete(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try {
            await pp.query('delete from survey_advdis_comment where id=?', [req.params.id]);
            res.status(200).send('done');
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });
})