const auth = require('../../../middlewares/auth');
const moment = require('moment');
const surveyHelper = require('../../../helpers/survey');

module.exports = ((app) => {
    const prefix = '/api/survey/result';
    const pp = app.get('pool').promise();


    app.post(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            

            if (req.body.survey_id && req.body.evaluations && req.body.rejects) {

                var [survey] = await pp.query('select * from survey where id=?', [req.body.survey_id]);


                //change survey to special
                if (req.body.special) {
                    if (req.body.special == false) {
                        if (survey[0].special == true) {
                            //count other results
                            var [count] = await pp.query('select count(id) as count from survey_result where survey_id_fk=? and special=?', [req.body.survey_id, 0]);
                            if (count[0].count >= 2) {
                                await pp.query('update survey set type=? where id=?', ['کمی', req.body.survey_id]);
                            }
                        }
                    }
                }



                var resultId = -1;

                var [exists] = await pp.query('select * from survey_result where personnel_id_fk=? and survey_id_fk=?', [
                    req.user.id,
                    req.body.survey_id
                ]);

                if (exists.length > 0) {
                    resultId = exists[0].id;
                }
                else {
                    //insert result and get id 
                    var [insert] = await pp.query('insert into survey_result (personnel_id_fk, date, survey_id_fk, special) values (?,?,?,?)', [
                        req.user.id,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.body.survey_id,
                        req.body.special == null ? 0 : req.body.special
                    ]);
                    resultId = insert.insertId;
                }


                if (resultId == -1) {
                    res.status(403).send('result could not be found');
                }
                else {

                    

                    //delete previous evaluations
                    await pp.query('delete from survey_result_evaluation where result_id_fk=?', [
                        resultId
                    ]);

                    //delete previous rejections
                    await pp.query('delete from survey_result_reject where result_id_fk=?', [resultId]);

                    //insert new evaluations
                    for (let i = 0; i < req.body.evaluations.length; i++) {
                        await pp.query('insert into survey_result_evaluation (result_id_fk, evaluation_id_fk, value) values (?,?,?)', [
                            resultId,
                            req.body.evaluations[i].id,
                            req.body.evaluations[i].value
                        ])
                    }

                    //insert new rejections
                    for (let i = 0; i < req.body.rejects.length; i++) {
                        await pp.query('insert into survey_result_reject (result_id_fk, evaluation_id_fk) values (?,?)', [
                            resultId,
                            req.body.rejects[i]
                        ])
                    }


                    //check if results are equal to survey members
                    // var [count_members] = await pp.query('select count(id) as count from survey_member where survey_id_fk=? and status=?', [req.body.survey_id, 'ارزیابی اعضای کارگروه تخصصی']);
                    // var [count_evals] = await pp.query('select count(id) as count from survey_result where survey_id_fk=?', [req.body.survey_id]);


                    //must check for rejects and reject the survey
                    var finalReject = false;

                    

                    var [rejects] = await pp.query('select * from survey_workgroup_reject where workgroup_id_fk=?', [survey[0].workgroup_id_fk]);


                    for (let i = 0; i < rejects.length; i++) {
                        var min_point = rejects[i].min_point;

                        //count rejects 
                        var [count] = await pp.query('select count(t1.id) as count from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk=t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t1.evaluation_id_fk=? and t3.id = ?', [rejects[i].id, req.body.survey_id]);



                        if (count[0].count >= min_point) {
                            await pp.query('update survey set status=? where id=?', ['در انتظار رد نهایی کارگروه تخصصی', req.body.survey_id]);

                            await pp.query('insert into survey_log (action, date,survey_user_id_fk, personnel_id_fk, survey_id_fk, description,from_status, to_status, status_type) values (?,?,?,?,?,?,?,?,?)', [
                                'پیشنهاد از ارزیابی اعضای کارگروه تخصصی به در انتظار رد نهایی کارگروه تخصصی تغییر وضعیت داده شد',
                                moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                                -1,
                                -1,
                                req.body.survey_id,
                                'نتیجه ارزیابی همه ارزیاب ها در سامانه ثبت شد و پیشنهاد به مرحله بعد ارجاع داده شد',
                                'ارزیابی اعضای کارگروه تخصصی',
                                'در انتظار رد نهایی کارگروه تخصصی',
                                'forward'
                            ]);
                            finalReject = true;

                            await surveyHelper.notification(23, req.body.survey_id, pp);
                            break;
                        }
                    }




                    

                    if (!finalReject) {
                        var w_total_point = 0;
                        var total_point = 0;

                        var [result] = await pp.query('select * from survey_result where survey_id_fk=?', [req.body.survey_id]); //number of results = arzyab


                        var [list] = await pp.query('select t1.id as sid, t3.value as user_value, t4.rate_type, t4.weight_factor, t4.max_point from survey as t1 inner join survey_result as t2 on t1.id = t2.survey_id_fk inner join survey_result_evaluation as t3 on t2.id=t3.result_id_fk inner join survey_workgroup_evaluation as t4 on t3.evaluation_id_fk=t4.id where t1.id=?', [req.body.survey_id]);

                        var [workgroup_evaluations] = await pp.query('select * from survey_workgroup_evaluation where workgroup_id_fk=?', [survey[0].workgroup_id_fk]);

                        var [members] = await pp.query('select * from survey_member where survey_id_fk=? and personnel_id_fk <> ?', [req.body.survey_id, 0]);


                        for (i = 0; i < list.length; i++) {
                            total_point += (parseInt(list[i].weight_factor) * parseInt(list[i].user_value));
                        }

                        for (i = 0; i < workgroup_evaluations.length; i++) {
                            w_total_point += parseInt(workgroup_evaluations[i].max_point);
                        }


                        //w_total_point = Number(w_total_point / result.length);

                        var tadil = Number(100 / w_total_point);

                        var average = Number(total_point / result.length);

                        var survey_point = average * tadil;

                        var [settings] = await pp.query('select * from survey_setting');

                        var min_pass_point = parseInt(settings[0].min_pass_point);

                        console.log('---------------------')
                        console.log('survey id:', req.body.survey_id);
                        console.log('sur point', survey_point);
                        console.log('min_pass', min_pass_point);
                        console.log('result', result.length);
                        console.log('members', members.length);
                        console.log('---------------------')


                        if (survey_point < min_pass_point && result.length == members.length) { //reject
                            await pp.query('update survey set status=? where id=?', ['در انتظار رد نهایی کارگروه تخصصی', req.body.survey_id]);

                            await pp.query('insert into survey_log (action, date,survey_user_id_fk, personnel_id_fk, survey_id_fk, description,from_status, to_status, status_type) values (?,?,?,?,?,?,?,?,?)', [
                                'پیشنهاد از ارزیابی اعضای کارگروه تخصصی به در انتظار رد نهایی کارگروه تخصصی تغییر وضعیت داده شد',
                                moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                                -1,
                                -1,
                                req.body.survey_id,
                                'نتیجه ارزیابی همه ارزیاب ها در سامانه ثبت شد و پیشنهاد به مرحله بعد ارجاع داده شد',
                                'ارزیابی اعضای کارگروه تخصصی',
                                'در انتظار رد نهایی کارگروه تخصصی',
                                'forward'
                            ]);

                            await surveyHelper.notification(23, req.body.survey_id, pp);

                        }
                        else if (survey_point >= min_pass_point && result.length == members.length) {
                            await pp.query('update survey set status=? where id=?', ['در انتظار تایید نهایی کارگروه تخصصی', req.body.survey_id]);

                            await pp.query('insert into survey_log (action, date,survey_user_id_fk, personnel_id_fk, survey_id_fk, description,from_status, to_status, status_type) values (?,?,?,?,?,?,?,?,?)', [
                                'پیشنهاد از ارزیابی اعضای کارگروه تخصصی به در انتظار تایید نهایی کارگروه تخصصی تغییر وضعیت داده شد',
                                moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                                -1,
                                -1,
                                req.body.survey_id,
                                'نتیجه ارزیابی همه ارزیاب ها در سامانه ثبت شد و پیشنهاد به مرحله بعد ارجاع داده شد',
                                'ارزیابی اعضای کارگروه تخصصی',
                                'در انتظار تایید نهایی کارگروه تخصصی',
                                'forward'
                            ]);

                            await surveyHelper.notification(22, req.body.survey_id, pp);
                        }
                    }

                    res.status(200).send('done');
                }
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

    app.get(`${prefix}/members/:survey_id/:type`, auth.authorized, async (req, res) => {
        try {
            if (req.params.type == 'wg') { //کارگروه تخصصی
                var [list] = await pp.query('select t2.id, t2.first_name, t2.last_name, t2.national_number as national_code, t1.date, t3.position, t3.workgroup_id_fk  from survey_result as t1  inner join personnel as t2 on t1.personnel_id_fk = t2.id  inner join survey_workgroup_personnel as t3 on t1.personnel_id_fk = t3.personnel_id_fk where t1.survey_id_fk=? and t3.position = ? and t3.workgroup_id_fk <> 11 and t3.workgroup_id_fk <> 12 group by t2.id', [req.params.survey_id, 'عضو']);
                res.status(200).send(list);
            }

        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/:survey_id`, auth.authorized, async (req, res) => {
        try {
            var [result] = await pp.query('select * from survey_result where survey_id_fk=?', [req.params.survey_id]);
            if (result.length == 1) {
                var [evaluations] = await pp.query('select * from survey_result_evaluation where result_id_fk=?', [result[0].id]);
                var [rejects] = await pp.query('select * from survey_result_reject where result_id_fk=?', [result[0].id]);

                res.status(200).send({
                    evaluations: evaluations,
                    rejects: rejects
                })
            }
            else {
                res.status(403).send('شناسه پیشنهاد در سامانه پیدا نشد');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/reject/reason/:id`, auth.authorized, async (req, res) => {
        try {
            var [setting] = await pp.query('select * from survey_setting');
            var result = await surveyHelper.finalResult_v1(req.params.id, pp); //await pp.query('select sum(t1.value) as score from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk=t2.id where t2.survey_id_fk=?', [req.params.id]);



            var score = {
                result: result,
                min_pass: parseInt(setting[0].min_pass_point)
            };

            var [rejects] = await pp.query('select t3.name, count(t1.id) as count, t3.min_point from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey_workgroup_reject as t3 on t1.evaluation_id_fk = t3.id where t2.survey_id_fk = ? group by t3.name;', [req.params.id]);

            res.status(200).send({
                score,
                reject_list: rejects
            })
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })
});