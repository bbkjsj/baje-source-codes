const auth = require('../../../middlewares/auth');
const moment = require('moment');
const surveyHelper = require('../../../helpers/survey');


module.exports = ((app) => {
    const prefix = '/api/survey/kartabl';
    const pp = app.get('pool').promise();
    app.get(`${prefix}/:status`, auth.authorized, async (req, res) => {
        try {
            var list = await generateList(req.user.id, req.params.status);
            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });



    var generateList = ((userId, status) => {
        return new Promise(async (resolve, reject) => {
            try {

                const output = [];

                var [setting] = await pp.query('select * from survey_setting');

                if (userId == setting[0].manager_id_fk) {
                    console.log('manager');
                    //display all surveys with latest status
                    var [list] = await pp.query("select t1.id as s_id, t1.category_title,  t1.participate_type, t1.type, t1.title, t2.name as category_name, concat(t3.first_name, ' ', t3.last_name) as fullname, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, RANK() over (order by point desc) as rank from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk=t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id inner join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk group by s_id order by rank;");


                    const jList = JSON.parse(JSON.stringify(list));



                    for (let i = 0; i < jList.length; i++) {
                        const result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);
                        jList[i] = {
                            ...jList[i],
                            result,
                            role: 'SURVEY_MANAGER'
                        }
                        output.push(jList[i]);
                    }
                    //resolve(jList);
                }
                //define manager of jahad nasr
                var [company] = await pp.query('select * from company where id=118');

                
                

                if (company[0].manager_id_fk == userId) { //is manager 
                    console.log('company');
                    if (status == 'toassign') {
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.category_title, t1.title, t1.type , t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,t1.is_postponed,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=?  and (t1.is_postponed is null or t1.is_postponed = ?) order by s_id desc", [
                            'ارزیابی مدیرعامل',
                            0
                        ]);
                        
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item = { 
                                ...item,
                                role: 'HOLDING_CEO'
                            }
                            output.push(item);
                        })
                       // resolve(jList);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if(status == 'assigned') { 
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.type,t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,t1.is_postponed,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=?  and (t1.is_postponed is null or t1.is_postponed = ?) order by s_id desc", [
                            'ابلاغ به مجری',
                            0
                        ]);
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'HOLDING_CEO'
                            }
                            output.push(item);
                        })
                        
                        //resolve(jList);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if (status == 'inprogress') {
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.category_title, t1.type, t1.participate_type, t1.is_postponed, t3.first_name, t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=? and (t1.is_postponed is null or t1.is_postponed = ?) order by s_id desc", [
                            'ابلاغ به مجری',
                            0
                        ]);
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'HOLDING_CEO'
                            }
                            output.push(item);
                        })

                        //resolve(jList);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    
                    else if (status == 'pending') {
                        
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.type, t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,t1.is_postponed,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=?  order by s_id desc", [
                            'تعویق عملیات اجرایی'
                        ]);
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item= { 
                                ...item,
                                role: 'HOLDING_CEO'
                            }
                            output.push(item);
                        })
                        //resolve(jList);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if (status == 'all') {

                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.type,t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,t1.is_postponed,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id  order by s_id desc");

                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'HOLDING_CEO'
                            }
                            output.push(item);
                        })
                        //resolve(jList);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if (status == 'problem') {
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.category_title, t1.type, t1.participate_type, t1.is_postponed, t3.first_name, t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id inner join survey_problem as t7 on t1.id = t7.survey_id_fk group by s_id having status=? and (t1.is_postponed is null or t1.is_postponed = ?) order by s_id desc", [
                            'ابلاغ به مجری',
                            0
                        ]);
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'HOLDING_CEO'
                            }
                            output.push(item);
                        })
                        //resolve(jList);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                }

                var [user] = await pp.query('SELECT t1.position, t1.workgroup_id_fk, t2.name, t3.id as user_id FROM bjdb.survey_workgroup_personnel as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id inner join personnel as t3 on t1.personnel_id_fk = t3.id where t3.id = ? and ((t1.member_from <= ? and t1.member_to is null) or (t1.member_from <= ? and t1.member_to >= ?))', [
                    userId,
                    moment().utc(true).format('YYYY/MM/DD 00:00:00'),
                    moment().utc(true).format('YYYY/MM/DD 00:00:00'),
                    moment().utc(true).format('YYYY/MM/DD 23:59:59')
                ]);


                const user_access = JSON.parse(JSON.stringify(user));

                const user_workgroups = [];
                const dabir_workgroups = [];

                for(let i=0; i<user_access.length;i++) { 
                    if(user_access[i].position == 'دبیر')  { 
                        dabir_workgroups.push(user_access[i].workgroup_id_fk);
                    }

                    if(user_access[i].position == 'عضو') { 
                        user_workgroups.push(user_access[i].workgroup_id_fk);
                    }
                }

                //define if the user is executor
                var [exec] = await pp.query('select * from survey_execution where personnel_id_fk = ?', [userId]);

                

                if (exec.length > 0) {
                    console.log('executor');

                    if (status == 'inprogress') {
                        var [list] = await pp.query("select t1.survey_id_fk as s_id, t2.type, t2.participate_type, t2.category_title, t2.title, t2.problem_description, t3.due_day, t2.participate_type, t5.name as category_name, (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status from survey_execution as t1 inner join survey as t2 on t1.survey_id_fk = t2.id inner join survey_top_workgroup as t3 on t1.survey_id_fk = t3.survey_id_fk left join survey_category as t5 on t2.survey_category_id_fk=t5.id where t1.personnel_id_fk=? group by t1.survey_id_fk having status=? order by s_id desc", [
                            userId,
                            'ابلاغ به مجری'
                        ]);

                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'EXECUTOR'
                            }
                            output.push(item);
                        })

                        //resolve(list);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if (status == 'problem') {
                        var [list] = await pp.query("select t2.type, t2.category_title, t2.participate_type, t4.title, t4.type, t4.problem_date, t4.result as problem_result, t1.survey_id_fk as s_id, t2.title, t2.problem_description, t2.participate_type, t3.due_day, t5.name as category_name, (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status from survey_execution as t1 inner join survey as t2 on t1.survey_id_fk = t2.id inner join survey_top_workgroup as t3 on t1.survey_id_fk = t3.survey_id_fk inner join survey_problem as t4 on t1.survey_id_fk = t4.survey_id_fk left join survey_category as t5 on t2.survey_category_id_fk=t5.id where t1.personnel_id_fk=? group by t1.survey_id_fk order by s_id desc", [
                            userId
                        ]);
                       
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'EXECUTOR'
                            }
                            output.push(item);
                        })

                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if (status == 'toapprove') {
                        var [list] = await pp.query("select t1.survey_id_fk as s_id, t2.type, t2.category_title, t2.participate_type, t2.code, t2.workgroup_id_fk, t6.national_number as national_code,  t2.title, t2.problem_description, t3.due_day, t2.participate_type, t5.name as category_name, (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select action from survey_log where survey_id_fk=s_id order by id desc limit 1) as message from survey_execution as t1 inner join survey as t2 on t1.survey_id_fk = t2.id inner join survey_top_workgroup as t3 on t1.survey_id_fk = t3.survey_id_fk left join survey_category as t5 on t2.survey_category_id_fk=t5.id left join personnel as t6 on t1.personnel_id_fk=t6.id where t1.personnel_id_fk=? having status=? or status=? order by s_id desc", [
                            userId,
                            'ارزیابی اولیه مجری',
                            'در انتظار اصلاح برنامه زمانبندی'
                        ]);

                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'EXECUTOR'
                            }
                            output.push(item);
                        })

                        //resolve(list);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                    else if (status == 'pending') {
                        var [list] = await pp.query("select t1.survey_id_fk as s_id, t2.type, t2.category_title, t2.participate_type, t2.code, t2.workgroup_id_fk, t6.national_number as national_code,  t2.title, t2.problem_description, t3.due_day, t2.participate_type, t5.name as category_name, (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select action from survey_log where survey_id_fk=s_id order by id desc limit 1) as message from survey_execution as t1 inner join survey as t2 on t1.survey_id_fk = t2.id inner join survey_top_workgroup as t3 on t1.survey_id_fk = t3.survey_id_fk left join survey_category as t5 on t2.survey_category_id_fk=t5.id left join personnel as t6 on t1.personnel_id_fk=t6.id where t1.personnel_id_fk=? group by t1.survey_id_fk having status=?  order by s_id desc", [
                            userId,
                            'تعویق عملیات اجرایی'
                        ]);
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => { 
                            item =  { 
                                ...item,
                                role: 'EXECUTOR'
                            }
                            output.push(item);
                        })
                        // resolve(list);
                        // const _list = JSON.parse(JSON.stringify(list));
                        // _list.map(item => {
                        //     output.push(item);
                        // });
                    }
                }

                if ((user_access.findIndex(item => item.position == 'دبیر') > -1 || user_access.findIndex(item => item.position == 'عضو') > -1) && user_access.findIndex(item => item.name == 'دبیرخانه نظام پیشنهادات') > -1) {
                    console.log('1');
                    
                    let  role = 'UNKNOWN_ACCESS';
                    if(user_access.findIndex(item => item.position == 'دبیر' && item.workgroup_id_fk == 11) > -1) {  
                        role = 'SECRETARIAT_HEAD'
                    }
                    else if (user_access.findIndex(item => item.position == 'عضو' && item.workgroup_id_fk == 11) > -1) { 
                        role = 'SECRETARIAT_MEMBER'
                    }

                    if (status == 'toapprove') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message, t1.category_title, t1.participate_type, t2.first_name, t2.last_name, t2.national_code, t1.status, t1.code, t3.name as category_name from survey as t1 inner join survey_user as t2 on t1.survey_user_id_fk = t2.id left join survey_category as t3 on t1.survey_category_id_fk=t3.id where t1.status = ? or t1.status = ? or t1.status=? or status=? order by t1.id desc", [
                            'ارزیابی دبیر دبیرخانه'
                            , 'درخواست تجدیدنظر توسط پیشنهاد دهنده'
                            , 'در انتظار تغییر کارگروه تخصصی',
                            'درخواست تجدید نظر توسط پیشنهاد دهنده'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            if(jList[i].status != 'در انتظار تغییر کارگروه تخصصی') { 
                                jList[i].message  = "****";
                            }

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };

                            output.push(jList[i]);
                        }
                    }
                    else if (status == 'evaluating') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , t1.category_title, t1.participate_type, t2.name as category_name, t3.first_name, t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk=t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id inner join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk where status=? or status=? or status=? or status=? or status=? or status=? or status=? or status=? or status=? or status=? group by s_id order by s_id desc",
                            [
                                'ارزیابی عضو دبیرخانه',
                                'ارزیابی دبیر کارگروه تخصصی',
                                'ارزیابی اعضای کارگروه تخصصی',
                                'در انتظار تایید نهایی کارگروه تخصصی',
                                'در انتظار رد نهایی کارگروه تخصصی',
                                'ارزیابی اولیه مجری',
                                'در انتظار تایید برنامه زمانبندی',
                                'درخواست بررسی اصلاحات پیشنهاد دهنده',
                                'ارزیابی اعضای کارگروه عالی',
                                'ارزیابی مدیرعامل'
                            ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }

                        
                    }
                    else if (status == 'toedit') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , t1.category_title, t1.participate_type, t2.name as category_name, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk=t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id inner join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk where status = ? or status=? group by s_id order by s_id desc", [
                            'در انتظار بررسی توسط پیشنهاد دهنده',
                            'در انتظار اصلاح برنامه زمانبندی'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }
                        
                        
                    }
                    else if (status == 'rejects') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , t1.category_title, t1.participate_type, t2.name as category_name, t3.first_name, t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk=t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id inner join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk where status=? or status=? or status=? or status=? or status=? group by s_id order by s_id desc", [
                            'رد شده توسط کارگروه تخصصی',
                            'رد شده توسط دبیر کارگروه تخصصی',
                            'رد شده توسط کارگروه عالی',
                            'رد اجرا توسط مجری',
                            'رد نهایی'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);
                            if(jList[i].status != 'رد شده توسط دبیر کارگروه تخصصی') { 
                                jList[i].message = '****';
                            }
                            
                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }

                        
                        //resolve(jList);
                    }
                    else if (status == 'problem') {
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.category_title, t1.title, t1.type , t1.participate_type, t1.is_postponed, t3.first_name, t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id inner join survey_problem as t7 on t1.id = t7.survey_id_fk group by s_id having status=? and (t1.is_postponed is null or t1.is_postponed = ?) order by s_id desc", [
                            'ابلاغ به مجری',
                            0
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }

                        
                        //resolve(jList);
                    }
                    else if (status == 'pending') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , t1.participate_type, t1.category_title, t2.first_name, t2.last_name, t2.national_code, t1.status, t1.code, t3.name as category_name from survey as t1 inner join survey_user as t2 on t1.survey_user_id_fk = t2.id left join survey_category as t3 on t1.survey_category_id_fk=t3.id where t1.status = ? order by t1.id desc", [
                            'تعویق عملیات اجرایی'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }

                        

                        // resolve(jList);
                    }
                    else if (status == 'inprogress') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , t1.participate_type, t1.category_title, t2.first_name, t2.last_name, t2.national_code, t1.status, t1.code, t3.name as category_name from survey as t1 inner join survey_user as t2 on t1.survey_user_id_fk = t2.id left join survey_category as t3 on t1.survey_category_id_fk=t3.id where t1.status = ? order by t1.id desc", [
                            'ابلاغ به مجری'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }

                        

                        //resolve(jList);
                    }
                }
                
                
                if ((user_access.findIndex(item => item.position == 'عضو') > -1 || user_access.findIndex(item => item.position == 'دبیر') > -1) && user_access.findIndex(item => item.name == 'کارگروه عالی نظام پیشنهادات') > -1) {
                    console.log('3')

                    let role = 'UNKNOWN_ACCESS';

                    if(user_access.findIndex(item => item.position == 'عضو' && item.workgroup_id_fk == 12) > -1) { 
                        role = 'EXCELLENT_MEMBER'
                    }
                    else if(user_access.findIndex(item => item.position == 'دبیر' && item.workgroup_id_fk == 12) > -1) { 
                        role = 'EXCELLENT_HEAD'
                    }

                    if (status == 'toapprove') {

                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.type , t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message,  t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=? and status <> ? order by s_id desc", [
                            'ارزیابی اعضای کارگروه عالی',
                            'رد شده توسط کارگروه عالی'
                        ]);




                        var jList = JSON.parse(JSON.stringify(list));
                        for (let i = 0; i < jList.length; i++) {
                            var [vote_count] = await pp.query('select *  from survey_excellent_group_result where survey_id_fk=? and personnel_id_fk=?', [jList[i].s_id, userId]);

                            if (vote_count.length == 0) {
                                jList[i].excellent_member_vote = -1;
                            }
                            else {
                                jList[i].excellent_member_vote = vote_count[0].approve == true ? true : false;
                            }

                            jList[i].role = role;
                             output.push(jList[i]);
                        }

                        

                        //resolve(jList);

                    }

                    else if (status == 'rejects') {
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.type , t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message,  t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=? order by s_id desc", [
                            'رد شده توسط کارگروه عالی',
                        ]);

                        var jList = JSON.parse(JSON.stringify(list));
                        for (let i = 0; i < jList.length; i++) {
                            var [vote_count] = await pp.query('select *  from survey_excellent_group_result where survey_id_fk=? and personnel_id_fk=?', [jList[i].s_id, userId]);

                            if (vote_count.length == 0) {
                                jList[i].excellent_member_vote = -1;
                            }
                            else {
                                jList[i].excellent_member_vote = vote_count[0].approve == true ? true : false;
                            }

                            jList[i].role = role;
                            output.push(jList[i]);
                        }

                        

                        

                       // resolve(jList);
                    }

                    else if (status == 'approves') {
                        var [list] = await pp.query("select t6.name as category_name, t1.id as s_id, t1.title, t1.type , t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message,  t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having status=? order by s_id desc", [
                            'ارزیابی مدیرعامل'
                        ]);

                        var jList = JSON.parse(JSON.stringify(list));
                        for (let i = 0; i < jList.length; i++) {
                            var [vote_count] = await pp.query('select *  from survey_excellent_group_result where survey_id_fk=? and personnel_id_fk=?', [jList[i].s_id, userId]);

                            if (vote_count.length == 0) {
                                jList[i].excellent_member_vote = -1;
                            }
                            else {
                                jList[i].excellent_member_vote = vote_count[0].approve == true ? true : false;
                            }

                            jList[i].role = role;
    
                            output.push(jList[i]);
                        }

                        

                        //resolve(jList);
                    }
                }
                
                

                if (user_access.findIndex(item => item.position == 'دبیر') > -1) {
                    console.log('4');

                    const role = 'WORKGROUP_HEAD';


                    if (status == 'toapprove') {


                        var [list] = await pp.query("select t1.id as s_id, t1.title, t6.name as category_name, t1.type , t1.category_title, t1.participate_type,t3.first_name , t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message,  t4.rate_type, t4.weight_factor,  (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id)  as point, t1.workgroup_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk left join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having t1.workgroup_id_fk IN(?) and (status=? or status=? or status=? or status=? or status=?) order by s_id desc", [
                            dabir_workgroups,
                            'ارزیابی دبیر کارگروه تخصصی',
                            'در انتظار تایید برنامه زمانبندی',
                            'درخواست بررسی اصلاحات پیشنهاد دهنده',
                            'در انتظار تایید نهایی کارگروه تخصصی',
                            'در انتظار رد نهایی کارگروه تخصصی'
                        ]);

                        var jList = JSON.parse(JSON.stringify(list));



                        for (let i = 0; i < jList.length; i++) {


                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                           

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }

                        
                        // resolve(jList);

                    }
                    else if (status == 'evaluating') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t6.name as category_name, t1.type , t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message , t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having t1.workgroup_id_fk IN(?) and status=? or status=? order by s_id desc", [
                            dabir_workgroups,
                            'ارزیابی اولیه مجری',
                            'ارزیابی اعضای کارگروه تخصصی',

                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }
                        //resolve(jList);
                    }
                    else if (status == 'toedit') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t6.name as category_name, t1.type , t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message , t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having t1.workgroup_id_fk IN(?) and status=? or status=? order by s_id desc", [
                            dabir_workgroups,
                            'در انتظار بررسی توسط پیشنهاد دهنده',
                            'در انتظار اصلاح برنامه زمانبندی'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);


                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);
                        }
                        //resolve(jList);
                    }
                    else if (status == 'rejects') {
                        var [list] = await pp.query("select t1.id as s_id, t1.title, t6.name as category_name, t1.type , t1.category_title, t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message , t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_member as t5 on t1.id = t5.survey_id_fk left join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having t1.workgroup_id_fk IN(?) and status=? order by s_id desc", [
                            dabir_workgroups,
                            'رد اجرا توسط مجری'
                        ]);
                        var jList = JSON.parse(JSON.stringify(list));

                        for (let i = 0; i < jList.length; i++) {

                            var result = await surveyHelper.finalResult_v1(jList[i].s_id, pp);

                            jList[i] = {
                                ...jList[i],
                                result: result,
                                role: role
                            };
    
                            output.push(jList[i]);

                            
                        }
                        //resolve(jList);
                    }
                }
                
                if (user_access.findIndex(item => item.position == 'عضو') > -1) {
                    
                    console.log('5')
                    const role = 'WORKGROUP_MEMBER';


                    if (status == 'evaluating') {

                        var [list] = await pp.query('select t3.id as s_id, t3.workgroup_id_fk,  t3.code, t3.title, t3.type , t3.participate_type, t3.category_title, t2.first_name, t2.national_number as national_code, t2.last_name, (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message , t4.name as category_name, t5.rate_type, t5.weight_factor from survey_member as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id inner join survey as t3 on t1.survey_id_fk = t3.id left join survey_category as t4 on t3.survey_category_id_fk=t4.id left join survey_workgroup_evaluation as t5 on t3.workgroup_id_fk=t5.workgroup_id_fk where t1.personnel_id_fk = ? group by t3.id having status = ? order by s_id desc', [
                            userId,
                            'ارزیابی اعضای کارگروه تخصصی'
                        ]);
                        
                        
                        const jList = JSON.parse(JSON.stringify(list));
                        jList.map(item => {
                            item = { 
                                ...item,
                                role: role
                            }
                            output.push(item);
                        });

                        
                    }
                }
                
                // else {
                //     console.log('6')
                //     //must check mojri
                //     if (status == 'inprogress') {
                //         var [list] = await pp.query("select t1.id as s_id, t1.title, t1.type , t1.participate_type, t1.category_title, t6.name as category_name, t3.first_name, t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message, t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk t5.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_execution as t5 on t1.id = t5.survey_id_fk inner join survey_category as t6 on t1.survey_category_id_fk=t6.id group by s_id having  status=? and t5.personnel_id_fk=? order by point desc", [
                //             'ابلاغ به مجری',
                //             userId
                //         ]);


                //         //resolve(list);
                //         // const _list = JSON.parse(JSON.stringify(list));
                //         // _list.map(item => {
                //         //     output.push(item);
                //         // });
                //     }
                //     else if (status == 'problem') {
                //         var [list] = await pp.query("select t1.id as s_id, t7.name as category_name, t1.title, t1.category_title, t1.type , t1.participate_type, t3.first_name,t3.last_name, t3.national_code, t1.code,  (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status, (select description from survey_log where survey_id_fk=s_id order by id desc limit 1) as message , t4.rate_type, t4.weight_factor, ( CASE WHEN t4.rate_type='نمره دهی' then (select sum(t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'انتخاب کیفیت' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) WHEN t4.rate_type = 'بلی/خیر' then (select sum(t4.weight_factor * t2.value) from survey_result as t1  inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk where t1.survey_id_fk=s_id) END) as point, t1.workgroup_id_fk t6.personnel_id_fk from survey as t1 inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_workgroup_evaluation as t4 on t1.workgroup_id_fk = t4.workgroup_id_fk inner join survey_execution as t5 on t1.id = t5.survey_id_fk inner join survey_problem as t6 on t1.id = t6.survey_id_fk inner join survey_category as t7 on t1.survey_category_id_fk=t7.id group by s_id having  status=? and t6.personnel_id_fk=? order by point desc", [
                //             'ابلاغ به مجری',
                //             userId
                //         ]);
                //         resolve(list);
                //         // const _list = JSON.parse(JSON.stringify(list));
                //         // _list.map(item => {
                //         //     output.push(item);
                //         // });
                //     }

                //     resolve(output);
                // }


                resolve(output);
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        })
    })

    var list = ((status) => {
        return new Promise((resolve, reject) => {
            try {
                if (status == 'all') {  // for manager

                }
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        })
    })
})
