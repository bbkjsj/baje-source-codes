const moment = require('moment');
const auth = require('../../../middlewares/auth');
const surveyHelper = require('../../../helpers/survey');

module.exports = ((app) => { 
    const prefix = '/api/survey/execution';
    const pp = app.get('pool').promise();


    
    app.get(`${prefix}/item/:id`, auth.authorized, async(req,res) => {
        try{
            var [item] = await pp.query('select t4.date, t2.title, t2.problem_description, t3.first_name, t3.last_name, t3.national_code,  t1.unit, t1.personnel_id_fk as personnel_id, t1.company_id_fk as company_id, t1.suggest_reward , t1.due_day from survey_top_workgroup as t1 inner join survey as t2 on t1.survey_id_fk = t2.id inner join survey_user as t3 on t2.survey_user_id_fk=t3.id left join survey_execution as t4 on t1.survey_id_fk = t4.survey_id_fk where t1.survey_id_fk = ?', [req.params.id]);
            
            res.status(200).send(item[0]);
        }
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })


    app.put(`${prefix}/change/:id`, auth.authorized, async (req, res) => {
        try {
            //if manager
            var [manager] = await pp.query('select * from company where id=? and manager_id_fk=?', [118, req.user.id]);

            if (manager.length > 0) {

                if (req.body.personnel_id || req.body.company_id) {


                    var personnel_id = req.body.personnel_id != null ? req.body.personnel_id : -1;

                    if (req.body.company_id) {
                        var [company] = await pp.query('select * from company where id=?', [req.body.company_id]);
                        if (company.length == 0) {
                            res.status(403).send('could not found company');
                        }
                        else {
                            personnel_id = company[0].manager_id_fk;
                        }
                    }

                    if (personnel_id == -1) {
                        res.status(403).send('personnel could not be found');
                    }
                    else {
                        //delete previous executor
                        await pp.query('delete from survey_execution where survey_id_fk = ?', [req.params.id]);

                        //insert new executor
                        await pp.query('insert into survey_execution (personnel_id_fk, survey_id_fk, date) values (?,?,?)', [
                            personnel_id,
                            req.params.id,
                            moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                        ]);

                        //get latest status of survey to update
                        var [survey] = await pp.query('select status from survey where id=?', [req.params.id]);
                        
                        var latest_status = survey[0].status;

                        //update survey log
                        var description = `پیشنهاد از وضعیت ${survey[0].status} به وضعیت ابلاغ به مجری تغییر وضعیت داده شد`;
                        await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status,status_type) values (?,?,?,?,?,?,?,?)', [
                            description, moment().utc(true).format('YYYY/MM/DD HH:mm:ss'), req.user.id, req.params.id, description, survey[0].status, 'ابلاغ به مجری', 'forward'
                        ]);

                        //notification
                        await surveyHelper.notification(15, req.params.id, pp);

                        res.status(200).send('done');
                    }
                }
                else {
                    res.status(403).send('incomplete request');
                }
            }
            else {
                res.status(403).send('you must be manager');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

})