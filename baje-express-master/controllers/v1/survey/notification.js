const auth = require('../../../middlewares/auth');
const moment = require('moment');

module.exports = ((app) => {
    const prefix = '/api/survey/notification';
    const pp = app.get('pool').promise();

    app.get(`${prefix}/main`, auth.authorized, async(req, res) => {
        try {
            var [list] = await pp.query('select count(id) as unread_count, status from survey_member_status_count where is_read is null and personnel_id_fk=? group by status', [req.user.id]);
            res.status(200).send(list);
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/survey`, auth.survey_authorized, async(req, res) => {
        try {
            var [list] = await pp.query('select count(id) as unread_count, status from survey_member_status_count where is_read is null and survey_user_id_fk=? group by status', [req.user.id]);
            res.status(200).send(list);
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/main/:survey_id`, auth.authorized, async(req, res) => {
        try {
            await pp.query('update survey_member_status_count set is_read = ? where survey_id_fk=? and personnel_id_fk=?', [
                1,
                req.params.survey_id,
                req.user.id
            ])
            res.status(200).send('done');
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/survey/:survey_id`, auth.survey_authorized, async(req, res) => {
        try {
            await pp.query('update survey_member_status_count set is_read = ? where survey_id_fk=? and survey_user_id_fk=?', [
                1,
                req.params.survey_id,
                req.user.id
            ])
            res.status(200).send('done');
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/amir`, async(req, res) => {
        const today = moment().utc(true).format('YYYY/MM/DD HH:mm:ss');
        
        var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and ((? between member_from and member_to) or member_to is null)', [
            12,
            today
        ]);

        console.log(list);

        res.status(200).send('done');
    })
})