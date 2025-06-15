const moment = require('moment');
const sms = require('../../../services/sms');
const surveyHelper = require('../../../helpers/survey');


module.exports = ((app) => {
    const prefix = '/api/survey/cron';
    const pp = app.get('pool').promise();

    app.get(`${prefix}/execution`, async (req, res) => {
        try {

            var [exe_list] = await pp.query('select max(t1.id) as t1id, t2.id as t2id, max(t1.to_status) as to_status, t1.survey_id_fk, max(t1.date) as date from survey_log as t1 inner join survey_execution as t2 on t1.survey_id_fk = t2.survey_id_fk where t1.to_status = ? and t2.approve = ? group by survey_id_fk;', ['ارجاع به مجری', 0]);

            var [settings] = await pp.query('select * from survey_setting');

            var exe_review_day = parseInt(settings[0].max_day_execution_review);

            var status = 'تایید شده توسط مجری';

            for (let i = 0; i < exe_list.length; i++) {
                var to_date = moment(exe_list[i].date).add(exe_review_day, 'days').format('YYYY/MM/DD');
                if (moment().utc(true).format('YYYY/MM/DD') > to_date) {
                    //must automatically approve the survey
                    await pp.query('update survey_execution set approve = 1 where id=?', [exe_list[i].t2id]);

                    //update status of survey
                    await pp.query('update survey set status=? where id=?', [status, exe_list[i].t1id]);

                    //upload log
                    await pp.query('insert into survey_log (action, date, personnel_id_fk , survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                        'پیشنهاد به صورت اتوماتیک توسط سیستم تایید شد',
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        -1,
                        exe_list[i].t1id,
                        'به دلیل عدم تایید مجری تا مهلت مربوطه، سیستم به صورت اتوماتیک پیشنهاد را تایید کرد',
                        'ارجاع به مجری',
                        status,
                        'forward'
                    ]);
                }
            }
            res.status(200).send('thank you cron');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/call/members`, async (req, res) => {
        try {

        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })


    app.get(`${prefix}/check/all/members/daily`, async (req, res) => {
        try {
            surveyHelper.checkAllMembersDaily(pp);
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/check/status/daily`, async (req, res) => {
        try {
            surveyHelper.checkDaily(pp);
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/check/membership/daily`, async (req, res) => {
        try {
            res.status(200).send('done');

            const [todayExpires] = await pp.query('select * from survey_workgroup_personnel where DATE(member_to)=? and position=?', [
                moment().utc(true).format('YYYY/MM/DD'),
                'دبیر'
            ]);

            
           

            for(let i=0; i<todayExpires.length;i++) { 
                await pp.query('insert into survey_workgroup_personnel (personnel_id_fk, workgroup_id_fk, position, member_from) values (?,?,?,?)', [
                    todayExpires[i].personnel_id_fk,
                    todayExpires[i].workgroup_id_fk,
                    'عضو',
                    moment().utc(true).format('YYYY/MM/DD 00:00:00')
                ])
            };


            const [todayManagers] = await pp.query('select personnel_id_fk, workgroup_id_fk from survey_workgroup_personnel where DATE(member_from) = ? and position = ? and member_to is null group by personnel_id_fk, workgroup_id_fk', [
                moment().utc(true).format('YYYY/MM/DD'),
                'دبیر'
            ]);


            console.table(todayManagers);

            if(todayManagers.length > 0) { 
                for(let i=0; i<todayManagers.length; i++) { 
                    const pid = todayManagers[i].personnel_id_fk;
                    const wid = todayManagers[i].workgroup_id_fk;

                    //find other managers at this workgroup
                    const [otherDabirs] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=? and position=? and personnel_id_fk <> ? and DATE(member_from) <= ? and member_to is null', [
                        wid,
                        'دبیر',
                        pid,
                        moment().utc(true).format('YYYY/MM/DD')
                    ]);
                    
                    


                    if(otherDabirs.length > 0) { 

                        for(let j=0;j<otherDabirs.length; j++) { 
                            //update dabir membership
                            await pp.query('update survey_workgroup_personnel set member_to=? where id=?', [
                                moment().utc(true).add(-1, 'day').format('YYYY/MM/DD 23:59:59'),
                                otherDabirs[j].id
                            ])

                            //insert new membership عضو for this person
                            await pp.query('insert into survey_workgroup_personnel (member_from, position, workgroup_id_fk, personnel_id_fk) values (?,?,?,?)', [
                                moment().utc(true).format('YYYY/MM/DD 00:00:00'),
                                'عضو',
                                otherDabirs[j].workgroup_id_fk,
                                otherDabirs[j].personnel_id_fk
                            ]);
                        }
                    }
                }
            }
            
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/postpone`, async (req, res) => {
        try {
            const [list] = await pp.query('select * from survey where DATE(end_of_postpone) = ?', [
                moment().utc(true).format('YYYY-MM-DD')
            ]);

            for (let i = 0; i < list.length; i++) {
                const previousStatus = list[i].status;

                //update status
                await pp.query('update survey set status=? where id=?', ['ارزیابی مدیرعامل', list[i].id]);

                //register log
                //upload log
                await pp.query('insert into survey_log (action, date, personnel_id_fk , survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                    'پیشنهاد به صورت اتوماتیک به وضعیت ارزیابی مدیرعامل تغییر داده شد',
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    -1,
                    list[i].id,
                    'پیشنهاد به صورت اتوماتیک به وضعیت ارزیابی مدیرعامل تغییر داده شد',
                    previousStatus,
                    'ارزیابی مدیرعامل',
                    'forward'
                ]);


                //notification
                await surveyHelper.notification(14, list[i].id, pp);
            }

            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })
});