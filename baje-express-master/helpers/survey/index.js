
const moment = require('moment');
const { survey } = require('../token');
const sms = require('../../services/sms');
const { response } = require('express');


module.exports.maxRateOfWorkgroup = ((workgroup_id, pp) => {
    return new Promise(async (resolve, reject) => {
        try { 
            var [evals] = await pp.query('select * from survey_workgroup_evaluation where workgroup_id_fk=? and is_enabled=?', [workgroup_id, 1]);
            var total = 0;

            for (let i = 0; i < evals.length; i++) {
                // if (evals[i].rate_type == 'نمره دهی') {
                //     total += parseInt(evals[i].max_point);
                // }

                // if (evals[i].rate_type == 'انتخاب کیفیت') {
                //     total += parseInt(evals[i].weight_factor) * 4;
                // }

                // if (evals[i].rate_type == 'بلی/خیر') {
                //     total += parseInt(evals[i].weight_factor);
                // }
                total += parseInt(evals[i].max_point);
            }

            resolve(
                {
                    total: total,
                    factor: total > 0 ? Number(Number(100 / total).toFixed(2)) : null
                }
            );
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
})

module.exports.finalResult = ((survey_id, pp) => {
    return new Promise(async (resolve, reject) => {
        var result = await finalResult(survey_id, pp);
        resolve(result);
    });
});

module.exports.notificationToMembers = ((members, survey_id, status, pp) => { 
    return new Promise(async (resolve, reject) => {
        try{
            for (let i = 0; i < members.length; i++) {
                //delete previous
                if (members[i]) {
                    await pp.query('delete from survey_member_status_count where survey_id_fk=? and status=?', [
                        survey_id,
                        members[i],
                        status
                    ]);
                }
                


                //insert new
                if (members[i]) {
                    await pp.query('insert into survey_member_status_count (survey_id_fk, personnel_id_fk, status) values (?,?,?)', [
                        survey_id,
                        members[i],
                        status
                    ]);
                }
            }

            resolve();
        }
        catch(err){
            reject(err);
        }
    })
})
module.exports.notification = ((level, survey_id, pp) => {
    console.log(`notification for ${level} : ${survey_id}`);

    return new Promise(async (resolve, reject) => {
        try {
            var members = [];
            var status = '';

            survey_id = parseInt(survey_id);

            const today = moment().utc(true).format('YYYY/MM/DD HH:mm:ss');
            const _today = moment().utc(true).format('YYYY/MM/DD');
            switch (level) {
                case 1:
                    status = 'ارزیابی دبیر دبیرخانه';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=?  and member_from <= ? and (member_to >= ? or member_to is null)', [
                        11,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break
                case 2:
                    status = 'ارزیابی عضو دبیرخانه';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=?', [
                        11,
                        'عضو'
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 3:
                    status = 'بررسی توسط پیشنهاد دهنده';
                    var [survey] = await pp.query('select survey_user_id_fk from survey where id=?', [survey_id]);
                    members.push({ survey_user_id_fk: survey[0].survey_user_id_fk });
                    break;
                case 4:
                    status = 'رد شده توسط دبیرخانه';
                    var [survey] = await pp.query('select survey_user_id_fk from survey where id=?', [survey_id]);
                    members.push({ survey_user_id_fk: survey[0].survey_user_id_fk });
                    break;
                case 5:
                    status = 'ارزیابی دبیر کارگروه تخصصی';
                    var [list] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id = ? and t2.position = ? and DATE(t2.member_from) <=? and (t2.member_to >= ? or t2.member_to is null)', [survey_id, 'دبیر', 
                _today,
                _today
                ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 6:
                    status = 'بررسی توسط پیشنهاد دهنده';
                    var [survey] = await pp.query('select survey_user_id_fk from survey where id=?', [survey_id]);
                    members.push({ survey_user_id_fk: survey[0].survey_user_id_fk });
                    break;
                case 7:
                    status = 'ارزیابی اعضای کارگروه تخصصی';
                    var [list] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id = ? and t2.position = ?', [survey_id, 'عضو']);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 8:
                    status = 'پایان ارزیابی کارگروه تخصصی';
                    var [list] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id = ? and t2.position = ?  and t2.member_from <= ? and (t2.member_to >= ? or t2.member_to is null)', [survey_id, 'دبیر', _today, _today]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 9:
                    status = 'رد شده توسط دبیر کارگروه تخصصی';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=? and member_from <= ? and (member_to >= ? or member_to is null)', [
                        11,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 10:
                    status = 'درخواست تجدید نظر توسط پیشنهاد دهنده';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=? and member_from <= ? and (member_to >= ? or member_to is null)', [
                        11,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 11:
                    status = 'ارزیابی اعضای کارگروه عالی';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and ((? between member_from and member_to) or member_to is null)', [
                        12,
                        today
                    ]);

                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 12:
                    status = 'رد شده توسط کارگروه عالی';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and ((? between member_from and member_to) or member_to is null)', [
                        12,
                        today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 13:
                    status = 'رد نهایی';
                    var [survey] = await pp.query('select survey_user_id_fk from survey where id=?', [survey_id]);
                    members.push({ survey_user_id_fk: survey[0].survey_user_id_fk });
                    break;
                case 14:
                    status = 'ارزیابی مدیرعامل';
                    var [manager] = await pp.query('select manager_id_fk from company where id=118');
                    members.push({ personnel_id_fk: manager[0].manager_id_fk });
                    break;
                case 15:
                    status = 'ابلاغ به مجری';
                    var [execution] = await pp.query('select personnel_id_fk from survey_execution where survey_id_fk=?', [survey_id]);
                    members.push({ personnel_id_fk: execution[0].personnel_id_fk });
                    break;
                case 16:
                    status = 'رد اجرا توسط مجری';
                    var [survey] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id=? and t2.position=?  and t2.member_from <= ? and (t2.member_to >= ? or t2.member_to is null)',[
                        survey_id,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(survey));
                    break;
                case 17:
                    status = 'تعویق عملیات اجرایی';
                    var [execution] = await pp.query('select personnel_id_fk from survey_execution where survey_id_fk=?', [survey_id]);
                    members.push({ personnel_id_fk: execution[0].personnel_id_fk });
                    break;
                case 18:
                    status = 'ارزیابی اولیه مجری';
                    var [execution] = await pp.query('select personnel_id_fk from survey_execution where survey_id_fk=?', [survey_id]);
                    members.push({ personnel_id_fk: execution[0].personnel_id_fk });
                    break;
                case 19:
                    status = 'در انتظار تایید برنامه زمانبندی';
                    var [list] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id = ? and t2.position = ?  and t2.member_from <= ? and (t2.member_to >= ? or t2.member_to is null)', [survey_id, 'دبیر', _today, _today]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 20:
                    status = 'درخواست بررسی اصلاحات پیشنهاد دهنده';
                    var [survey] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id=? and t2.position=?  and t2.member_from <= ? and (t2.member_to >= ? or t2.member_to is null)',[
                        survey_id,
                        'دبیر',
                        _today,
                        _today
                    ]);

                    survey.map(item => {
                        if(members.indexOf(item) == -1) { 
                            members.push(item);
                        }
                    });
                    break;
                case 21:
                    status='در انتظار بررسی توسط پیشنهاد دهنده'
                    var [owner] = await pp.query('select survey_user_id_fk from survey where id=?', [survey_id]);
                    members.push({ survey_user_id_fk: owner[0].survey_user_id_fk });


                    break;
                case 22:
                    status = 'در انتظار تایید نهایی کارگروه تخصصی';

                    var [survey] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id=? and t2.position=? and (t2.member_from <= ? and (t2.member_to >= ? or t2.member_to is null))',[
                        survey_id,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(survey));
                    break;
                case 23:
                    status = 'در انتظار رد نهایی کارگروه تخصصی';
                    var [survey] = await pp.query('select t2.personnel_id_fk from survey as t1 inner join survey_workgroup_personnel as t2 on t1.workgroup_id_fk = t2.workgroup_id_fk where t1.id=? and t2.position=? and t2.member_from <= ? and (t2.member_to >= ? or t2.member_to is null)',[
                        survey_id,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(survey));
                    break;
                case 24:
                    status = 'در انتظار اصلاح برنامه زمانبندی';
                    var [execution] = await pp.query('select personnel_id_fk from survey_execution where survey_id_fk=?', [survey_id]);
                    members.push({ personnel_id_fk: execution[0].personnel_id_fk });
                    break;
                case 25:
                    status = 'در انتظار تغییر کارگروه تخصصی';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=? and ((? between member_from and member_to) or member_to is null)', [
                        11,
                        'دبیر',
                        today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 26:
                    status = 'رد شده توسط کارگروه تخصصی';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=?  and member_from <= ? and (member_to >= ? or member_to is null)', [
                        11,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                case 27: 
                    status = 'ثبت گزارش مشکل توسط مجری';
                    var [list] = await pp.query('select personnel_id_fk from survey_workgroup_personnel where workgroup_id_fk=? and position=?  and member_from <= ? and (member_to >= ? or member_to is null)', [
                        11,
                        'دبیر',
                        _today,
                        _today
                    ]);
                    members = JSON.parse(JSON.stringify(list));
                    break;
                default:
                    break
            }

            //update notif table for members
            //delete previous notifications
            await pp.query('delete from survey_member_status_count where survey_id_fk=?', [survey_id]);
            

            
            for (let i = 0; i < members.length; i++) {
                //delete previous
                // if (members[i].personnel_id_fk) {
                //     await pp.query('delete from survey_member_status_count where survey_id_fk=? and personnel_id_fk=? and status=?', [
                //         survey_id,
                //         members[i].personnel_id_fk,
                //         status
                //     ]);
                // }
                // else if (members[i].survey_user_id_fk) {
                //     await pp.query('delete from survey_member_status_count where survey_id_fk=? and personnel_id_fk=? and status=?', [
                //         survey_id,
                //         members[i].survey_user_id_fk,
                //         status
                //     ]);
                // }


                //insert new

                if (members[i].personnel_id_fk) {
                    await pp.query('insert into survey_member_status_count (survey_id_fk, personnel_id_fk, status) values (?,?,?)', [
                        survey_id,
                        members[i].personnel_id_fk,
                        status
                    ]);
                }
                else if (members[i].survey_user_id_fk) {
                    await pp.query('insert into survey_member_status_count (survey_id_fk, survey_user_id_fk, status) values (?,?,?)', [
                        survey_id,
                        members[i].survey_user_id_fk,
                        status
                    ]);
                }
            }

            resolve();
        }
        catch (err) {
            reject();
            console.log(err);
        }
    })
})

module.exports.finalExcellentGroupResult = ((survey_id, pp) => {
    return new Promise(async (resolve, reject) => {
        var result = await finalExcellentGroupResult(survey_id, pp);
        resolve(result);
    })
})

module.exports.finalResult_v1 = (async (survey_id, pp) => {
    try{
        return await _finalResult_v1(survey_id, pp);
    }
    catch(err){
        console.log('err here', err);
    }
    
})

module.exports.checkAllMembersDaily = (async(pp) => {
    return await _checkAllMembersDaily(pp);
});

var finalRate = ((survey_id, pp) => {
    return new Promise(async (resolve, reject) => {
        try {

            var [result] = await pp.query('select id from survey_result where survey_id_fk=?', [survey_id]);


            var w_total_point = 0;
            var total_point = 0;
            var total_value = 0;
            var total_arzyab = result.length;


            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    var [evals] = await pp.query('select t1.value, t2.rate_type, t2.weight_factor, t2.max_point from survey_result_evaluation as t1 inner join survey_workgroup_evaluation as t2 on t1.evaluation_id_fk = t2.id where t1.result_id_fk=?', [
                        result[i].id
                    ]);


                    for (let j = 0; j < evals.length; j++) {
                        if (evals[j].rate_type == 'نمره دهی') {
                            total_point += parseInt(evals[j].value);
                        }
                        else if (evals[j].rate_type == 'انتخاب کیفیت') {
                            total_point += parseInt(evals[j].weight_factor) * parseInt(evals[j].value)
                        }
                        else if (evals[j].rate_type == 'بلی/خیر') {
                            total_point += parseInt(evals[j].weight_factor) * parseInt(evals[j].value)
                        }

                        total_value += parseInt(evals[j].value);
                    }

                }

                var [survey] = await pp.query('select workgroup_id_fk from survey where id=?', [survey_id]);

                var [workgroups] = await pp.query('select * from survey_workgroup_evaluation where workgroup_id_fk=?', [survey[0].workgroup_id_fk]);

                for (let m = 0; m < workgroups.length; m++) {
                    if (workgroups[m].rate_type == 'نمره دهی') {
                        w_total_point += parseInt(workgroups[m].max_point);
                    }
                    else if (workgroups[m].rate_type == 'انتخاب کیفیت') {
                        w_total_point += parseInt(workgroups[m].weight_factor) * 4
                    }
                    else if (workgroups[m].rate_type == 'بلی/خیر') {
                        w_total_point += parseInt(workgroups[m].weight_factor);
                    }
                }


                //calculation
                var tadil = 100 / w_total_point;
                var avg = (total_point * tadil) / total_arzyab;

                resolve({
                    total_point: total_point,
                    tadil: tadil,
                    average: avg
                })
            }
            else {
                resolve({
                    total_point: -1,
                    tadil: -1,
                    average: -1
                })
            }
        }
        catch (err) {
            console.log(err);
            reject('error occured');
        }
    })
})

var finalResult = ((survey_id, pp) => {
    return new Promise(async (resolve, reject) => {
        try {
            var [settings] = await pp.query('select * from survey_setting');

            //get first status date from log 
            var [logs] = await pp.query('select * from survey_log where survey_id_fk = ? and to_status = ?', [
                survey_id,
                'ارزیابی دبیر کارگروه تخصصی'
            ]);

            if (logs.length == 0) {

                return resolve({
                    point: { point: -1 },
                    pass: -1,
                    message: 'این پیشنهاد هنوز شروع نشده است'
                });
            }

            var end_date = moment(logs[0].date).utc(true).add(settings[0].max_day_expert_workgroup, 'days').format('YYYY-MM-DD HH:mm:ss');

            //check if results are equal to survey members
            var [count_members] = await pp.query('select count(id) as count from survey_member where survey_id_fk=? and status=?', [survey_id, 'ارزیابی اعضای کارگروه تخصصی']);
            var [count_evals] = await pp.query('select count(id) as count from survey_result where survey_id_fk=?', [survey_id]);

            var mustCheckDate = true;
            if (count_members[0].count == count_evals[0].count) {
                mustCheckDate = false;
            }

            if (mustCheckDate && moment().utc(true).format('YYYY-MM-DD HH:mm:ss') <= end_date) {

                return resolve({
                    point: { point: -1 },
                    pass: -1,
                    message: 'مهلت این پیشنهاد هنوز به اتمام نرسیده است'
                });
            }
            else {
                var [survey] = await pp.query('select * from survey where id=?', [survey_id]);


                var finalObject = await finalRate(survey_id, pp);

                var min_pass_point = parseInt(settings[0].min_pass_point);

                var pass = false;

                var _continue = true;

                var [rejects] = await pp.query('select count(t1.id) count, t3.min_point from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk=t2.id  inner join survey_workgroup_reject as t3 on t1.evaluation_id_fk = t3.id where t2.survey_id_fk = ?', [survey_id]);



                for (let i = 0; i < rejects.length; i++) {

                    if (rejects[i].count >= rejects[i].min_point == null ? 0 : parseInt(rejects[i].min_point)) {
                        // await pp.query('update survey set approve_level1=? where id=?', [0, survey_id]);
                        pass = false;
                        _continue = false;
                    }
                }



                if (_continue) {
                    if (min_pass_point < finalObject.average) { //average was total_point
                        pass = true;
                    }
                    else {
                        if (min_pass_point <= finalObject.average) { //average was total point
                            pass = true;
                        }
                        else {
                            pass = false;
                        }
                    }
                }


                if (finalObject.total_point == -1) {
                    return resolve({
                        point: {
                            total_point: -1,
                            average: 0,
                            tadil: -1
                        }, pass: -1
                    });
                }

                if (pass) {
                    await pp.query('update survey set approve_level1=? where id=?', [1, survey_id]);
                }
                else {
                    await pp.query('update survey set approve_level1=? where id=?', [0, survey_id]);
                }
                return resolve({ point: finalObject, pass: pass });

            }

        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
})


var finalExcellentGroupResult = ((survey_id, pp) => {
    return new Promise(async (resolve, reject) => {
        try {
            var [settings] = await pp.query('select * from survey_setting');
            var max_day_excellent_group = parseInt(settings[0].max_day_excellent_workgroup);

            var [logs] = await pp.query('select * from survey_log where survey_id_fk = ? and to_status = ?', [
                survey_id,
                'ارزیابی اعضای کارگروه عالی'
            ]);

            if (logs.length == 0) {
                resolve('این پیشنهاد هنوز به دست کارگروه عالی نرسیده است')
            }
            else {
                var end_date = moment(logs[0].date).utc(true).add(max_day_excellent_group, 'days').format('YYYY-MM-DD HH:mm:ss');

                if (moment().utc(true).format('YYYY-MM-DD HH:mm:ss') <= end_date) {
                    resolve('مهلت اتمام ارزیابی کارگروه عالی هنوز به اتمام نرسیده است')
                }
                else {
                    var [members] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=?', [12]);
                    var [votes] = await pp.query('select * from survey_excellent_group_result where survey_id_fk=?', [survey_id]);
                    var approves = members.length;
                    var notapproves = 0;
                    for (let i = 0; i < votes.length; i++) {
                        if (votes[i].approve == false || votes[i].approve == 0) {
                            notapproves++;
                            approves--;
                        }
                    }

                    if (approves >= (members.length / 2) + 1) {
                        //survey is approved
                        //update survey
                        await pp.query('update survey set level2_approve=? where id=?', [1, survey_id]);
                        resolve(true);
                    }
                    else {
                        await pp.query('update survey set level2_approve=? where id=?', [0, survey_id]);
                        resolve(false);
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    })
})

module.exports.checkDaily = (async (pp) => {
    return new Promise(async (resolve, reject) => {
        resolve(await checkDailyStatus(pp));
    })
})

module.exports.checkMembershipDaily = ((pp) => {
    return new Promise(async (resolve, reject) => {
        resolve(await checkMembershipDaily(pp));
    })
})

var checkDailyStatus = (async (pp) => {
    try {
        var [settings] = await pp.query('select * from survey_setting');
        var today = moment().utc(true).format('YYYY-MM-DD');

        if (settings.length == 1) {
            var max_day_first_assessment = parseInt(settings[0].max_day_first_assessment);
            var max_day_excellent_workgroup = parseInt(settings[0].max_day_excellent_workgroup);
            var max_day_edit = parseInt(settings[0].max_day_edit);
            var max_day_review_request = parseInt(settings[0].max_day_review_request);

            var [status1List] = await pp.query("select id as sid, status, (select to_status from survey_log where survey_id_fk=sid order by id desc limit 1) as last_status, (select date from survey_log where survey_id_fk=sid order by id desc limit 1) as last_update from survey having last_status = ?", ['ارزیابی دبیر کارگروه تخصصی']);
            //for negative point, we would need this list

            var [status2List] = await pp.query("select id as sid, status, (select to_status from survey_log where survey_id_fk=sid order by id desc limit 1) as last_status, DATE((select date from survey_log where survey_id_fk=sid order by id desc limit 1)) as last_update from survey having last_status = ?", ['پایان ارزیابی کارگروه تخصصی']);

            for (let i = 0; i < status2List.length; i++) {
                var deadline = moment(status2List[i].last_update).add(max_day_excellent_workgroup, 'days').format('YYYY-MM-DD');

                if (deadline < today) {
                    //update status
                    //changeStatus('ارزیابی دبیر کارگروه تخصصی', 'ارزیابی دبیر دبیرخانه', status2List[i].sid, 'backward', pp);

                    //send sms to dabir dabirkhaneh
                    sendSmstoDabirDabirkhaneh('test', pp);
                }

            }


            // daily status 3
            var [status3List] = await pp.query("select id as sid, workgroup_id_fk as wid, status, (select to_status from survey_log where survey_id_fk=sid order by id desc limit 1) as last_status, DATE((select date from survey_log where survey_id_fk=sid order by id desc limit 1)) as last_update from survey having last_status = ?", ['ارزیابی اعضای کارگروه تخصصی']);

            for (let i = 0; i < status3List.length; i++) {
                var deadline = status3List[i].last_update;
                var a = moment(today);
                var b = moment(deadline);
                var days = b.diff(a, 'days');
                if (days > 0 && days <= 5) {
                    //get members
                    var [members] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=?', [status3List[i].wid]);

                    var [results] = await pp.query('select * from survey_result where survey_id_fk=?', [status3List[i].sid]);

                    if (results.length < members.length) {
                        //must check idle members and send sms
                        for (let k = 0; k < members.length; k++) {

                            var jsonResults = JSON.parse(JSON.stringify(results));
                            var found = jsonResults.filter(item => item.personnel_id_fk == members[k].personnel_id_fk);
                            if (found.length == 0) {
                                sendSmstoDabirDabirkhaneh(members[k].personnel_id_fk);
                            }
                        }
                    }
                }
            }

        }

        //daily status 4
        var [status4List] = await pp.query("select id as sid, workgroup_id_fk as wid, status, (select to_status from survey_log where survey_id_fk=sid order by id desc limit 1) as last_status, DATE((select date from survey_log where survey_id_fk=sid order by id desc limit 1)) as last_update from survey having last_status = ? or last_status=?", ['ارزیابی مدیرعامل', 'رد شده توسط کارگروه عالی']);

        for (let i = 0; i < status4List.length; i++) {
            var deadline = moment(status4List[i].last_update).add(max_day_excellent_workgroup, 'days').format('YYYY-MM-DD');

            if (deadline < today) {
                //update status
                changeStatus('ارزیابی اعضای کارگروه عالی', 'ارزیابی مدیرعامل', status4List[i].sid, 'forward', pp);
            }
        }



        //status5 
        var [status5List] = await pp.query("select id as sid, workgroup_id_fk as wid, status, (select to_status from survey_log where survey_id_fk=sid order by id desc limit 1) as last_status, DATE((select date from survey_log where survey_id_fk=sid order by id desc limit 1)) as last_update from survey having last_status = ? or last_status=?", ['درخواست بررسی اصلاحات پیشنهاد دهنده']);

        for (let i = 0; i < status5List.length; i++) {
            var deadline = moment(status5List[i].last_update).add(max_day_edit, 'days').format('YYYY-MM-DD');
            if (deadline < today) {
                changeStatus('درخواست بررسی اصلاحات پیشنهاد دهنده', 'رد نهایی', status5List[i].sid, 'forward', pp);
            }
        }


        //status6
        var [status6List] = await pp.query("select id as sid, workgroup_id_fk as wid, status, (select to_status from survey_log where survey_id_fk=sid order by id desc limit 1) as last_status, DATE((select date from survey_log where survey_id_fk=sid order by id desc limit 1)) as last_update from survey having last_status = ? or last_status=?", ['درخواست تجدیدنظر توسط پیشنهاد دهنده']);

        for (let i = 0; i < status6List.length; i++) {
            var deadline = moment(status6List[i].last_update).add(max_day_review_request, 'days').format('YYYY-MM-DD');
            if (deadline < today) {
                changeStatus('درخواست تجدیدنظر توسط پیشنهاد دهنده', 'رد نهایی', status6List[i].sid, 'forward', pp);
            }
        }

    }
    catch (err) {
        console.log(err);
    }
})


var changeStatus = ((from_status, to_status, survey_id, type, pp) => {
    try {
        //update status
        pp.query('update survey set status=? where id=?', [
            to_status,
            survey_id
        ]);

        //update log
        var action = `پیشنهاد از ${from_status} به ${to_status} تغییر وضعیت داده شد.`;
        var description = `پیشنهاد به صورت خودکار از ${from_status} به ${to_status} توسط سامانه تغییر وضعیت داده شد`;
        pp.query('insert into survey_log (action, date, survey_id_fk, description, from_status, to_status) values (?,?,?,?,?,?)', [
            action,
            moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
            survey_id,
            description,
            from_status,
            to_status
        ]);
    }
    catch (err) {
        console.log(err);
    }
})

var sendSmstoDabirDabirkhaneh = (async (message, pp) => {
    try {
        var [dabirkhaneh] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=? and position = ?', [11, 'دبیر']);

        for (let i = 0; i < dabirkhaneh.length; i++) {
            var [personnel] = await pp.query('select mobile1 from personnel where id=?', [
                dabirkhaneh[i].personnel_id_fk
            ]);
            if (personnel.length == 1) {
                //send sms
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});

var sendSmsToIdleMember = ((personnel_id, pp) => {
    //must send sms to personnels
})

var checkMembershipDaily = (async (pp) => {
    try {
        var [list] = await pp.query('select DATE(t1.member_to), t2.name from survey_workgroup_personnel as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk=t2.id where position=? and not(member_to is null)', ['دبیر']);

        var [dabir] = await pp.query('select t2.mobile1 from survey_workgroup_member as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.workgroup_id_fk=? and t1.position=?', [11, 'دبیر']);

        if (dabir.length == 1) {
            var today = moment().utc(true).format('YYYY-MM-DD');

            for (let i = 0; i < list.length; i++) {
                var to_date = list[i].member_to;
                var a = moment(today);
                var b = moment(to_date);
                var days = b.diff(a, 'days');

                if (days > 0 && days < 6) {
                    //send sms
                    var message = `با توجه به اینکه پایان عضویت دبیر کارگروه تخصصی ${list[i].name} نزدیک است، لطفا نسبت به تمدید عضویت و یا تغییر دبیر اقدام نمایید.`;
                    var number = dabir[0].mobile1;

                    //send sms
                }

            }
        }
    }
    catch (err) {
        console.log(err);
    }
})


var _checkAllMembersDaily = (async(pp) => { 
    try{
        const today = moment().utc(true).format('YYYY/MM/DD');

        const [list] = await pp.query('select * from survey_workgroup_personnel where DATE(member_to) = ? and position', [today, 'دبیر']);

        for(let i=0;i<list.length; i++) { 
            //change membership
             await pp.query('update survey_workgroup_member set position=?, member_from=?, member_to=? where id=?', [
                 'عضو',
                 moment().utc(true).format('YYYY/MM/DD 00:00:00'),
                 null,
                 list[i].id
             ])
        }
        
    }
    catch(err) {
        console.log(err);
    }
});


var _finalResult_v1 = (async (survey_id, pp) => {
    return new Promise(async (resolve, reject) => {
        try{
            var [list] = await pp.query('call s_point(?)', [survey_id]);
            resolve(JSON.parse(JSON.stringify(list[0][0])));
        }
        catch(err){
            resolve({
                point: 0,
                average: 0,
                tadil: 0,
                pass: null
            })
        }
    })
});