const auth = require('../../../middlewares/auth');
const moment = require('moment');
const surveyHelper = require('../../../helpers/survey');

module.exports = ((app) => {
    const prefix = '/api/survey/reset';
    const pp = app.get('pool').promise();


    app.post(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            //count
            if(req.body.survey_id) { 
                const [reset] = await pp.query('select * from survey_reset where survey_id_fk = ?', [req.body.suvey_id]);

                if(reset.length > 0) { 
                    res.status(403).send('این پیشنهاد قبلا یکبار ریست شده است');
                }
                else { 
                    await pp.query('insert into survey_reset (personnel_id_fk, survey_id_fk) values (?,?)', [
                        req.user.id,
                        req.body.survey_id
                    ]);

                    //delete other negative results
                    await pp.query('delete from survey_excellent_group_result where survey_id_fk=? and approve = ?', [
                        req.body.survey_id,
                        0
                    ]);

                    //survey
                    const [survey] = await pp.query('select * from survey where id=?', [req.body.survey_id]);

                    //update survey
                    await pp.query('update survey set status = ? where id=?', [
                        'ارزیابی اعضای کارگروه عالی',
                        req.body.survey_id
                    ]);




                    //register log
                    await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                        `پیشنهاد از وضعیت ${survey[0].status} به وضعیت ارزیابی اعضای کارگروه عالی تغییر وضعیت داده شد`,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.user.id,
                        req.body.survey_id,
                        `پیشنهاد از وضعیت ${survey[0].status} به وضعیت ارزیابی اعضای کارگروه عالی تغییر وضعیت داده شد`,
                        survey[0].status,
                        'ارزیابی اعضای کارگروه عالی',
                        'reset'
                    ]);

                    await surveyHelper.notification(11, req.body.survey_id, pp);
                    
                    res.status(200).send('done');
                }
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
})