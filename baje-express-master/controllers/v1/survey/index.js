const { from } = require('jalali-moment');
const auth = require('../../../middlewares/auth');
const jmoment = require('jalali-moment')
const multer = require('multer');
const moment = require('moment');
const path = require('path');
const surveyHelper = require('../../../helpers/survey');

module.exports = ((app) => {
    const prefix = '/api/survey';
    const pp = app.get('pool').promise();


    app.get(`${prefix}/status/log/:id`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query("select t1.action, t1.date, t1.description, t1.from_status, t1.to_status, t1.status_type, concat(t2.first_name, ' ', t2.last_name) as personnel_name, t2.id as personnel_id, concat(t3.first_name, ' ', t3.last_name) as user_name from survey_log as t1 left join personnel as t2 on t1.personnel_id_fk = t2.id left join survey_user as t3 on t1.survey_user_id_fk=t3.id where t1.survey_id_fk=?", [req.params.id]);
            res.status(200).send(list);
        }
        catch (err) {
            res.status(403).send('error occured');
            console.log(err);
        }
    })

    app.get(`${prefix}/log/status/:id`, auth.survey_authorized, async (req, res) => {
        try {
            var [list] = await pp.query("select t1.action, t1.date, t1.description, t1.from_status, t1.to_status, t1.status_type, concat(t2.first_name, ' ', t2.last_name) as personnel_name, t2.id as personnel_id, concat(t3.first_name, ' ', t3.last_name) as user_name from survey_log as t1 left join personnel as t2 on t1.personnel_id_fk = t2.id left join survey_user as t3 on t1.survey_user_id_fk=t3.id where t1.survey_id_fk=?", [req.params.id]);
            res.status(200).send(list);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })


    app.get(`${prefix}/list/of/call/:id`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select  t1.id, t3.id as survey_user_id, t1.workgroup_id_fk, t3.first_name, t3.last_name, t1.title, t1.participate_type, t1.code, t2.name as category_name, t4.action as last_action, t4.date as last_update_date, t4.description as last_message,t1.status, t5.name as workgroup_name from survey as t1 inner join survey_category as t2 on t1.survey_category_id_fk = t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_log as t4 on t1.id = t4.survey_id_fk left join survey_workgroup as t5 on t1.workgroup_id_fk=t5.id where t1.survey_workgroup_call_id_fk=? and   t4.id = (select max(id) from survey_log where survey_id_fk=t1.id', [req.params.id]);
            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/execution/detail/:id`, auth.authorized, async (req, res) => {

    });


    app.get(`${prefix}/eval/inuse/:id`, auth.authorized, async (req, res) => {
        try {
            var [query] = await pp.query('select count(id) as count from survey_result_evaluation where evaluation_id_fk=?', [req.params.id]);
            if (query[0].count > 0) {
                res.status(200).send(true);
            }
            else {
                res.status(200).send(false);
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/reject/inuse/:id`, auth.authorized, async (req, res) => {
        try {
            var [query] = await pp.query('select count(id) as count from survey_result_reject where evaluation_id_fk=?', [req.params.id]);
            if (query[0].count > 0) {
                res.status(200).send(true);
            }
            else {
                res.status(200).send(false);
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/category/inuse/:name`, auth.authorized, async (req, res) => {
        try {
            var [survey] = await pp.query('select count(id) as count from survey where category_title=?', [req.params.name]);
            res.status(200).send(survey[0].count > 0 ? true : false);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/comment/on/advdis/:id`, auth.authorized, async (req, res) => {
        try {
            var [comment] = await pp.query('select count(id) as count from survey_advdis_comment where survey_advdis_id_fk=?', [req.params.id]);
            res.status(200).send(comment[0].count > 0 ? true : false);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/person/participate/:id/:wid`, auth.authorized, async (req, res) => {
        try {
            if (req.params.wid == '-1') {
                var [participate] = await pp.query('select count(t1.id) as count from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk=t2.id where t2.personnel_id_fk=?', [req.params.id]);
                res.status(200).send(participate[0].count > 0 ? true : false);
            }
            else {
                var [participate] = await pp.query('select count(t1.id) as count from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk=t2.id inner join survey as t3 on t2.survey_id_fk=t3.id where t2.personnel_id_fk=? and t3.workgroup_id_fk=?', [req.params.id, req.params.wid]);
                res.status(200).send(participate[0].count > 0 ? true : false);
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });
    app.get(`${prefix}/person/:wid/participate/:pid`, auth.authorized, async (req, res) => {
        try {
            var [participate] = await pp.query('select count(t1.id) as count from survey_result_evaluation as t1 inner join survey_result as t2 on t2.id = t1.result_id_fk inner join survey as t3 on t2.survey_id_fk = t3.id where t3.workgroup_id_fk=? and t3.survey_user_id_fk=?', [req.params.wid, req.params.pid]);

            res.status(200).send(participate[0].count > 0 ? true : false);
        }
        catch (err) {
            res.status(403).send('error occured');
            console.log(err);
        }
    })

    app.get(`${prefix}/person/excellent/participate/:id`, auth.authorized, async (req, res) => {
        try {
            var [participate] = await pp.query('select count(id) as count from survey_excellent_group_result where personnel_id_fk=?', [req.params.id]);
            res.status(200).send(participate[0].count > 0 ? true : false);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.post(`${prefix}/workgroup`, async (req, res) => {
        try {
            if (req.body.name) {
                await pp.query('insert into survey_workgroup (name) values (?)', [req.body.name]);
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

    app.get(`${prefix}/companies`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select id, name from company');
            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/workgroup/:id/members`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.*, t2.first_name, t2.last_name, t2.national_number from survey_workgroup_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id = ?', [req.params.id]);
            var output = [];

            list.forEach(item => {
                if (item.member_from < moment().utc(true).format('YYYY-MM-DD HH:mm:ss')) {

                }

                var _item = {
                    id: item.id,
                    personnel_id: item.personnel_id_fk,
                    workgroup_id: item.workgroup_id_fk,
                    position: item.position,
                    member_from: item.member_from,
                    member_to: item.member_to,
                    is_approved: item.approved == null ? false : item.approved,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    national_number: item.national_number,
                    is_manager: item.position == 'دبیر' ? true : false,
                    is_expired: item.member_to < moment().utc(true).format('YYYY-MM-DD hh:mm:ss') ? true : false
                }
                output.push(_item);
            })
            res.status(200).send(output);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/workgroup/:id/info`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select * from survey_workgroup_evaluation where workgroup_id_fk=? and is_enabled=?', [req.params.id, 1]);

            if (list.length > 0) {

                var w_total = 0;
                for (let i = 0; i < list.length; i++) {
                    // switch (list[i].rate_type) {
                    //     case 'نمره دهی':
                    //         w_total += list[i].max_point != null ? parseInt(list[i].max_point) : 0;
                    //         break;
                    //     case 'انتخاب کیفیت':
                    //         w_total += list[i].weight_factor != null ? parseInt(list[i].weight_factor) * 4 : 0;
                    //         break;
                    //     case 'بلی/خیر':
                    //         w_total += list[i].weight_factor != null ? parseInt(list[i].weight_factor) : 0;
                    //         break;
                    //     default:
                    //         break;
                    // }
                    w_total += parseInt(list[i].max_point);
                }

                res.status(200).send({
                    total: w_total,
                    tadil: 100 / w_total
                });
            }
            else {
                res.status(403).send('workgroup not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/workgroups/:filter`, async (req, res) => {
        try {
            if (req.params.filter == 'all') {
                var output = [];
                var [list] = await pp.query('select * from survey_workgroup');
                for (let i = 0; i < list.length; i++) {
                    var rate = await surveyHelper.maxRateOfWorkgroup(list[i].id, pp);
                    m = {
                        id: list[i].id,
                        name: list[i].name,
                        fix: list[i].fix,
                        rate
                    }
                    output.push(m);
                }
                res.status(200).send(output);
            }
            else if (req.params.filter == 'wg') {
                var output = [];
                var [list] = await pp.query('select * from survey_workgroup where fix is null or fix=?', [0]);
                for (let i = 0; i < list.length; i++) {
                    var rate = await surveyHelper.maxRateOfWorkgroup(list[i].id, pp);
                    m = {
                        id: list[i].id,
                        name: list[i].name,
                        fix: list[i].fix,
                        rate
                    }
                    output.push(m);
                }
                res.status(200).send(output);
            }
        }
        catch (err) {
            res.status(403).send(err);
        }
    })

    app.delete(`${prefix}/workgroup`, async (req, res) => {
        if (req.body.ids) {
            for (let i = 0; i < req.body.ids.length; i++) {
                await pp.query('delete from survey_workgroup where id=?', [req.body.ids[i]]);
            }
            res.status(200).send('done');
        }
        else {
            res.status(403).send('incomplete request');
        }

    })

    app.post(`${prefix}/add/person`, async (req, res) => {
        try {
            if (req.body.wid && req.body.personnel_id && req.body.position && req.body.member_from) {
                var [duplicate] = await pp.query('select id from survey_workgroup_personnel where workgroup_id_fk = ? and personnel_id_fk = ?', [
                    req.body.wid,
                    req.body.personnel_id
                ]);
                if (duplicate.length == 0) {
                    //dup must be here...
                }

                await pp.query('insert into survey_workgroup_personnel (personnel_id_fk, workgroup_id_fk, position, member_from, member_to, approved) values (?,?,?,?,?,?)', [req.body.personnel_id, req.body.wid, req.body.position, req.body.member_from, req.body.member_to, 0]);
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
    })

    app.put(`${prefix}/edit/person/:id`, async (req, res) => {
        try {

            if (req.body.wid && req.body.personnel_id && req.body.position && req.body.member_from) {
                await pp.query('update survey_workgroup_personnel set personnel_id_fk=?, workgroup_id_fk=?, position=?, member_from=?, member_to=?, approved=? where id=?', [parseInt(req.body.personnel_id), parseInt(req.body.wid), req.body.position, req.body.member_from, req.body.member_to, 0, req.params.id]);

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


    app.delete(`${prefix}/delete/person`, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    await pp.query('delete from survey_workgroup_personnel where id = ?', [arr[i]]);
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/persons/:wid`, async (req, res) => {
        try {

            var [list] = await pp.query('select t1.id, t1.fix,  t2.first_name, t2.last_name, t2.national_number, t2.id as personnel_id, t1.member_from, t1.member_to, t1.position, t2.id as pid, (select count(t1.id) from survey_result as t1 inner join survey_result_evaluation as t2 on t1.id=t2.result_id_fk inner join survey as t3 on t1.survey_id_fk = t3.id where t1.personnel_id_fk = pid and t3.workgroup_id_fk=?) as votes, (select count(t1.id) from survey_result as t1 inner join survey_result_reject as t2 on t1.id=t2.result_id_fk inner join survey as t3 on t1.survey_id_fk = t3.id where t1.personnel_id_fk = pid and t3.workgroup_id_fk=?) as rejects, IF(DATE(t1.member_to) < CURDATE(), true, false) as expire from survey_workgroup_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.workgroup_id_fk = ?', [
                req.params.wid,
                req.params.wid,
                req.params.wid
            ]);
            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/persons/:id`, async (req, res) => {
        try {
            var [entity] = await pp.query('select t1.position, t1.member_from, t1.member_to, t2.first_name, t2.last_name, t2.national_number, t2.id as personnel_id, t1.fix from survey_workshop_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id = ?', [req.params.id]);
            if (entity.length == 1) {
                res.status(200).send(entity[0]);
            }
            else {
                res.status(403).send('person not found');
            }
        }
        catch (err) {
            res.status(403).send(err);
        }
    })

    app.get(`${prefix}/person/detail/:id`, async (req, res) => {
        try {
            var [person] = await pp.query('select t1.*, t2.first_name, t2.last_name, t2.national_number from survey_workgroup_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id=?', [req.params.id]);
            res.status(200).send(person[0]);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/person/expire/:id`, async (req, res) => {
        try {
            const date = moment().add(-1, 'days').utc(true).format('YYYY/MM/DD 00:00:00');


            await pp.query('update survey_workgroup_personnel set member_to=? where id=?', [date,
                req.params.id]);
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/workgroup/:id`, async (req, res) => {
        try {
            if (req.body.name) {
                await pp.query('update survey_workgroup set name=? where id=?', [req.body.name, req.params.id]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })


    app.post(`${prefix}/workgroup/evaluation`, async (req, res) => {
        try {
            if (req.body.name && req.body.workgroup_id && req.body.rate_type && req.body.max_point) {
                if (req.body.workgroup_id == -1 || req.body.workgroup_id == '-1') {
                    const [list] = await pp.query('select * from survey_workgroup');
                    for (let i = 0; i < list.length; i++) {
                        await pp.query('insert into survey_workgroup_evaluation (name, workgroup_id_fk, rate_type, weight_factor, is_enabled, description, max_point, last_update_date) values (?,?,?,?,?,?,?,?)', [
                            req.body.name,
                            list[i].id,
                            req.body.rate_type,
                            req.body.weight_factor,
                            req.body.is_enabled == true ? 1 : 0,
                            req.body.description,
                            req.body.max_point,
                            moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                        ]);

                    }
                    res.status(200).send('done');
                }
                else {
                    const cmd = `insert into survey_workgroup_evaluation (name, workgroup_id_fk, rate_type, weight_factor, is_enabled, description, max_point) values ('${req.body.name}', '${req.body.workgroup_id}', '${req.body.rate_type}', ${req.body.weight_factor != null ? req.body.weight_factor : null}, '${req.body.is_enabled == true ? 1 : 0}', '${req.body.description != null ? req.body.description : null}', ${req.body.max_point != null ? req.body.max_point : null})`;

                    await pp.query(cmd);
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
    })

    app.put(`${prefix}/workgroup/evaluation/:id`, async (req, res) => {
        try {
            if (req.body.name && req.body.workgroup_id && req.body.rate_type && req.body.max_point) {

                await pp.query('update survey_workgroup_evaluation set name=?, workgroup_id_fk=?, rate_type=?, weight_factor=?, is_enabled=?, description=?, max_point=?, last_update_date=? where id=?', [
                    req.body.name,
                    req.body.workgroup_id,
                    req.body.rate_type,
                    req.body.weight_factor,
                    req.body.is_enabled == true ? 1 : 0,
                    req.body.description,
                    req.body.max_point,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.params.id
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

    app.delete(`${prefix}/workgroup/evaluation`, async (req, res) => {
        try {
            if (req.body.ids) {
                for (let i = 0; i < req.body.ids.length; i++) {
                    await pp.query('delete from survey_workgroup_evaluation where id=?', [req.body.ids[i]]);
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }


        }
        catch (err) {
            res.status(403).send(err);
        }
    });

    app.get(`${prefix}/workgroup/:id/evaluations`, async (req, res) => {
        var [list] = await pp.query('select t1.*, t2.name as workgroup_name from survey_workgroup_evaluation as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id where workgroup_id_fk = ?', [req.params.id]);


        res.status(200).send(list);
    })

    app.get(`${prefix}/workgroup/evaluation/:id`, async (req, res) => {
        try {
            if (req.params.id == 'all') {
                var [list] = await pp.query('select t1.*, t2.name as w_name from survey_workgroup_evaluation as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id order by id');
                res.status(200).send(list);

            }
            else {
                var [item] = await pp.query('select * from survey_workgroup_evaluation where id=?', [req.params.id]);
                res.status(200).send(item[0]);
            }
        }
        catch (err) {
            res.status(200).send('error occured');
        }
    })

    app.post(`${prefix}/workgroup/reject`, async (req, res) => {
        try {
            if (req.body.workgroup_id && req.body.name && req.body.min_point) {
                if (req.body.workgroup_id == '-1' || req.body.workgroup_id == -1) {
                    const [list] = await pp.query('select * from survey_workgroup');
                    for (let i = 0; i < list.length; i++) {
                        await pp.query('insert into survey_workgroup_reject (name, workgroup_id_fk, min_point, is_enable, description, last_update_date) values (?,?,?,?,?,?)', [
                            req.body.name,
                            list[i].id,
                            req.body.min_point,
                            req.body.is_enable == true ? 1 : 0,
                            req.body.description,
                            moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                        ])
                    }
                    res.status(200).send('done');
                }
                else {
                    await pp.query('insert into survey_workgroup_reject (name, workgroup_id_fk, min_point, is_enable, description) values (?,?,?,?,?)', [
                        req.body.name,
                        req.body.workgroup_id,
                        req.body.min_point,
                        req.body.is_enable == true ? 1 : 0,
                        req.body.description
                    ])
                    res.status(200).send('done');
                }

            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })
    app.put(`${prefix}/workgroup/reject/:id`, async (req, res) => {
        try {
            if (req.body.workgroup_id && req.body.name && req.body.min_point) {
                await pp.query('update survey_workgroup_reject set name=?, workgroup_id_fk=?, min_point=?, is_enable=?, description=?, last_update_date=? where id=?', [
                    req.body.name,
                    req.body.workgroup_id,
                    req.body.min_point,
                    req.body.is_enable == true ? 1 : 0,
                    req.body.description,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.params.id
                ])
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send(err);
        }
    })

    app.delete(`${prefix}/workgroup/reject/`, async (req, res) => {
        try {
            if (req.body.ids) {
                for (let i = 0; i < req.body.ids.length; i++) {
                    await pp.query('delete from survey_workgroup_reject where id=?', [req.body.ids[i]]);
                }
                res.status(200).send('done')
            }
            else {
                res.status(403).send('incomplete request');
            }


        }
        catch (err) {
            res.status(403).send(err);
        }
    })

    app.get(`${prefix}/workgroup/:id/rejects`, async (req, res) => {
        var [list] = await pp.query('select t1.*, t2.name as workgroup_name from survey_workgroup_reject as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id where t1.workgroup_id_fk = ?', [req.params.id]);
        res.status(200).send(list);
    });


    app.get(`${prefix}/workgroup/reject/:id`, async (req, res) => {
        try {
            if (req.params.id == 'all') {
                var [list] = await pp.query('select t1.*, t2.name as w_name from survey_workgroup_reject as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id');
                res.status(200).send(list);
            }
            else {
                var [item] = await pp.query('select * from survey_workgroup_reject where id=?', [req.params.id]);
                res.status(200).send(item[0]);
            }

        }
        catch (err) {
            res.status(403).send(err);
        }
    })


    app.post(`${prefix}/category`, async (req, res) => {
        try {
            if (req.body.name) {
                await pp.query('insert into survey_category (name, is_enable, description) values (?,?,?)', [
                    req.body.name,
                    req.body.is_enable == true ? 1 : 0,
                    req.body.description
                ])
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })
    app.put(`${prefix}/category/:id`, async (req, res) => {
        try {
            if (req.body.name) {
                await pp.query('update survey_category set name=?, is_enable=?, description=? where id=?', [
                    req.body.name,
                    req.body.is_enable == true ? 1 : 0,
                    req.body.description,
                    req.params.id
                ])
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
    })
    app.delete(`${prefix}/category`, async (req, res) => {
        try {
            if (req.body.ids) {
                for (let i = 0; i < req.body.ids.length; i++) {
                    await pp.query('delete from survey_category where id=?', [
                        req.body.ids[i]
                    ])
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }

        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/category/:id`, async (req, res) => {
        try {
            if (req.params.id == 'all') {
                var [list] = await pp.query('select * from survey_category');
                res.status(200).send(list);
            }
            else {
                var [item] = await pp.query('select * from survey_category where id=?', [
                    req.params.id
                ]);
                res.status(200).send(item[0]);
            }

        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.post(`${prefix}/workgroup/call`, async (req, res) => {
        try {
            if (req.body.subject && req.body.workgroup_id && req.body.start_date && req.body.end_date) {
                await pp.query('insert into survey_workgroup_call (subject, workgroup_id_fk, start_date, end_date) values (?,?,?,?)', [
                    req.body.subject,
                    req.body.workgroup_id,
                    req.body.start_date,
                    req.body.end_date
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send(err);
        }
    })
    app.put(`${prefix}/workgroup/call/:id`, async (req, res) => {
        try {
            if (req.body.subject && req.body.start_date && req.body.end_date, req.body.workgroup_id) {
                await pp.query('update survey_workgroup_call set subject=?, workgroup_id_fk=?, start_date=?, end_date=? where id=?', [
                    req.body.subject,
                    req.body.workgroup_id,
                    req.body.start_date,
                    req.body.end_date,
                    req.params.id
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send(err);
        }
    })

    app.get(`${prefix}/workgroup/:id/calls`, async (req, res) => {
        var [list] = await pp.query('select t1.*, t2.name as workgroup_name from survey_workgroup_call as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id where t1.workgroup_id_fk = ?', [req.params.id]);
        res.status(200).send(list);
    });

    app.get(`${prefix}/my/upcoming/calls`, auth.survey_authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.*, t1.id as wid, t2.name as w_name ,IF((select count(id) from survey_call_subscribe where survey_user_id_fk=? and survey_workgroup_call_id_fk=wid) >0, true, false) as subscribed from survey_workgroup_call as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id  where t1.start_date>=? order by t1.id', [
                req.user.id,
                moment().utc(true).format('YYYY-MM-DD')
            ]);
            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/workgroup/call/:id`, async (req, res) => {
        try {
            if (req.params.id == 'current') {
                var [list] = await pp.query('select t1.*, t2.name as w_name from survey_workgroup_call as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id where t1.start_date<=? and end_date>=? order by id', [
                    moment().utc(true).format('YYYY-MM-DD'),
                    moment().utc(true).format('YYYY-MM-DD')
                ]);
                res.status(200).send(list);
            } else if (req.params.id == 'all') {
                var [list] = await pp.query('select t1.*, t2.name as w_name from survey_workgroup_call as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id order by id');
                res.status(200).send(list);
            }
            else {
                var [list] = await pp.query('select * from survey_workgroup_call where id=?', [req.params.id]);

                res.status(200).send(list[0]);
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.post(`${prefix}/workgroup/call/subscribe`, auth.survey_authorized, async (req, res) => {
        try {
            if (req.body.call_id) {
                await pp.query('delete from survey_call_subscribe where survey_user_id_fk=? and survey_workgroup_call_id_fk=?', [
                    req.user.id,
                    req.body.call_id
                ]);

                //insert again
                await pp.query('insert into survey_call_subscribe (survey_user_id_fk, survey_workgroup_call_id_fk) values (?,?)', [
                    req.user.id,
                    req.body.call_id
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
            console.log(err);
        }
    })


    app.delete(`${prefix}/workgroup/call`, async (req, res) => {
        if (req.body.ids) {
            for (let i = 0; i < req.body.ids.length; i++) {
                await pp.query('delete from survey_workgroup_call where id=?', [req.body.ids[i]]);
            }
            res.status(200).send('done');
        }
        else {
            res.status(403).send('incomplete request');
        }

    })

    app.get(`${prefix}/workgroup/:id`, async (req, res) => {
        try {
            var [entity] = await pp.query('select * from survey_workgroup where id=?', [req.params.id]);
            if (entity.length == 1) {
                res.status(200).send(entity[0]);
            }
            else {
                res.status(403).send('survey not found');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/setting`, async (req, res) => {
        var [entity] = await pp.query('select * from survey_setting');
        res.status(200).send(entity[0]);
    })

    var backgroundStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './_uploads/survey/background');
        },
        filename: function (req, file, cb) {
            var fn = moment().utc(true).format('YYMMDDHHmmss');
            fn = `${fn}_surbck${path.extname(file.originalname)}`;
            cb(null, fn);
        }
    })
    var bckSurveyMulter = multer({ storage: backgroundStorage });

    app.post(`${prefix}/setting`, bckSurveyMulter.single('bck_file'), async (req, res) => {
        try {
            await pp.query('delete from survey_setting');
            await pp.query('insert into survey_setting (manager_id_fk, max_day_first_assessment, max_day_expert_workgroup, max_day_excellent_workgroup, max_day_edit, max_day_review_request, max_day_planning_execution, max_day_execution_review, rial_rate_per_year, min_reward_rial, max_percent_participate, min_pass_point, background_image) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                req.body.manager_id,
                req.body.max_day_first_assessment,
                req.body.max_day_expert_workgroup,
                req.body.max_day_excellent_workgroup,
                req.body.max_day_edit,
                req.body.max_day_review_request,
                req.body.max_day_planning_execution,
                req.body.max_day_execution_review,
                req.body.rial_rate_per_year,
                req.body.min_reward_rial,
                req.body.max_percent_participate,
                req.body.min_pass_point,
                req.file != null ? `/api/file/bck_survey/${req.file.filename}` : null
            ]);


            res.status(200).send('done');

        }
        catch (err) {
            console.log("error here", err);
            res.status(403).send('error occured');
        }
    })


    var surveyStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './_uploads/survey');
        },
        filename: function (req, file, cb) {
            var fn = moment().utc(true).format('YYMMDDHHmmss');
            fn = `${fn}_survey${path.extname(file.originalname)}`;
            cb(null, fn)
        }
    })
    var surveyMulter = multer({ storage: surveyStorage })
    app.post(`${prefix}`, auth.survey_authorized, surveyMulter.single('survey_file'), async (req, res) => {
        try {
            if (req.body.workgroup_id && req.body.title && req.body.suggestion && req.body.group_name) {


                var insertedSurvey = await pp.query('insert into survey (workgroup_id_fk, participate_type, participate_group_name, survey_call, survey_workgroup_call_id_fk, title, type, survey_category_id_fk, category_title, problem_description, suggestion, requirement, is_exist, participate_in_execution, participate_exe_type, participate_exe_percent, participate_exe_year, file_url, code, idea_price, status, survey_user_id_fk, create_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                    req.body.workgroup_id,
                    req.body.participate_type,
                    req.body.group_name,
                    req.body.is_survey_call == true ? 1 : 0,
                    req.body.workgroup_call_id,
                    req.body.title,
                    req.body.type,
                    req.body.category_id,
                    req.body.category_title,
                    req.body.problem_description,
                    req.body.suggestion,
                    req.body.requirement,
                    req.body.is_exist == true ? 1 : 0,
                    req.body.participate_in_execution == true ? 1 : 0,
                    req.body.participate_exe_type,
                    req.body.participate_exe_percent,
                    req.body.participate_exe_year,
                    req.file != null ? `/api/file/survey/${req.file.filename}` : null,
                    jmoment().format('jYYjMMjDDHHmmss'),
                    req.body.idea_price,
                    'ارزیابی دبیر کارگروه تخصصی',
                    req.user.id,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                ]);


                if (req.body.participants) {
                    var arr = JSON.parse(req.body.participants);

                    for (let i = 0; i < arr.length; i++) {

                        await pp.query('insert into survey_participant (survey_id_fk, survey_user_id_fk, participation_percent) values (?,?,?)', [
                            insertedSurvey[0].insertId,
                            arr[i].personnel_id,
                            arr[i].percent
                        ])
                    }
                }

                if (req.body.advantages) {
                    var advs = JSON.parse(req.body.advantages);


                    for (let i = 0; i < advs.length; i++) {

                        await pp.query('insert into survey_adv_dis (survey_user_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                            req.user.id,
                            advs[i].comment,
                            'adv',
                            insertedSurvey[0].insertId
                        ])
                    }
                }

                if (req.body.disadvantages) {
                    var diss = JSON.parse(req.body.disadvantages);
                    for (let i = 0; i < diss.length; i++) {
                        await pp.query('insert into survey_adv_dis (survey_user_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                            req.user.id,
                            diss[i].comment,
                            'dis',
                            insertedSurvey[0].insertId
                        ])
                    }
                }

                //save log
                //register log
                await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                    `پیشنهاد جدید در سامانه ثبت شد و به دبیر کارگروه تخصصی ارجاع داده شد`,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.user.id,
                    insertedSurvey[0].insertId,
                    `پیشنهاد جدید در سامانه ثبت شد و به دبیر کارگروه تخصصی ارجاع داده شد`,
                    null,
                    'ارزیابی دبیر کارگروه تخصصی',
                    'forward'
                ]);





                //notification
                await surveyHelper.notification(5, insertedSurvey[0].insertId, pp);
                //await surveyHelper.notification(1, insertedSurvey[0].insertId, pp);

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
    })

    app.post(`${prefix}/advdis`, auth.authorized, async (req, res) => {
        try {
            if (req.body.comment && req.body.type && req.body.survey_id) {
                await pp.query('insert into survey_adv_dis (survey_id_fk, comment, type, personnel_id_fk) values (?,?,?,?)', [
                    req.body.survey_id,
                    req.body.comment,
                    req.body.type,
                    req.user.id
                ]);
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
            console.log(err);
        }
    });

    app.delete(`${prefix}/advdis/:id`, auth.authorized, async (req, res) => {
        try {
            var [item] = await pp.query('select * from survey_adv_dis where id=? and personnel_id_fk=?', [req.params.id, req.user.id]);
            if (item.length == 1) {
                await pp.query('delete from survey_adv_dis where id=?', [req.params.id]);
            }
            res.status(200).send('done');
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })


    app.get(`${prefix}/rate/max/:workgroup_id`, auth.authorized, async (req, res) => {
        try {
            var result = await surveyHelper.maxRateOfWorkgroup(req.params.workgroup_id, pp);
            res.status(200).send(result);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/result/final/:id`, auth.authorized, async (req, res) => {
        try {
            var result = await surveyHelper.finalResult(req.params.id, pp);
            res.status(200).send(result);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/result/excellent/:id`, auth.authorized, async (req, res) => {
        try {
            var result = await surveyHelper.finalExcellentGroupResult(req.params.id, pp);
            res.status(200).send(result);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/rate/final/:id`, auth.authorized, async (req, res) => {
        try {
            var result = await surveyHelper.finalRate(req.params.id, pp);
            res.status(200).send(result);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/item/:id`, auth.survey_authorized, async (req, res) => {
        try {
            var [survey] = await pp.query('select t1.*, t2.name as category_name, t3.subject as call_subject, t4.national_code from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk = t2.id left join survey_workgroup_call as t3 on t1.survey_workgroup_call_id_fk = t3.id inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where t1.id=? and t1.survey_user_id_fk=?', [req.params.id, req.user.id]);

            if (survey.length == 0) {
                res.status(403).send('this survey is not belong to you.');
                return;
            }

            var [participants] = await pp.query('select  t1.id, t1.survey_user_id_fk as personnel_id, t1.participation_percent, t2.first_name, t2.last_name, t2.national_code from survey_participant as t1 inner join survey_user as t2 on t1.survey_user_id_fk = t2.id where t1.survey_id_fk=?', [req.params.id]);

            var [advantages] = await pp.query('select  id, comment from survey_adv_dis where survey_id_fk=? and type=?', [req.params.id, 'adv']);
            var [disadvantages] = await pp.query('select  id, comment from survey_adv_dis where survey_id_fk=? and type=?', [req.params.id, 'dis']);

            var [logs] = await pp.query('select * from survey_log where survey_id_fk = ? order by id desc limit 1', [req.params.id]);

            var [execution] = await pp.query('select t1.*, t2.first_name, t2.last_name, t3.name as company_name from survey_execution as t1 left join personnel as t2 on t1.personnel_id_fk=t2.id left join company as t3 on t1.personnel_id_fk=t3.manager_id_fk  where t1.survey_id_fk=?', [req.params.id]);


            var [latestExecLog] = await pp.query('select * from survey_log where survey_id_fk=? and to_status=? order by id desc limit 1', [
                req.params.id,
                'ابلاغ به مجری'
            ]);

            var result = await surveyHelper.finalResult_v1(req.params.id, pp);

            var [workgroup] = await pp.query('select * from survey_workgroup where id=?', [survey[0].workgroup_id_fk]);

            if (survey.length == 1) {
                res.status(200).send({
                    survey: survey[0],
                    participants: participants,
                    advantages: advantages,
                    disadvantages: disadvantages,
                    log: logs.length > 0 ? logs[0] : null,
                    execution: execution.length > 0 ? execution[0] : null,
                    workgroup: workgroup.length > 0 ? workgroup[0] : null,
                    latestLogExec: latestExecLog.length > 0 ? latestExecLog[0] : null,
                    result: result
                });
            }
            else {
                res.status(403).send('فرم پیشنهاد در سامانه پیدا نشد');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            var [survey] = await pp.query('select t1.*, t2.name as category_name, t3.subject as call_subject, t4.score as score from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk = t2.id left join survey_workgroup_call as t3 on t1.survey_workgroup_call_id_fk = t3.id left join survey_top_workgroup as t4 on t1.id=t4.survey_id_fk where t1.id=?', [req.params.id]);

            var [logs] = await pp.query('select * from survey_log where survey_id_fk = ? order by id desc limit 1', [req.params.id]);

            var [participants] = await pp.query('select  t1.id, t1.survey_user_id_fk as personnel_id, t1.participation_percent, t2.first_name, t2.last_name, t2.national_code from survey_participant as t1 inner join survey_user as t2 on t1.survey_user_id_fk = t2.id where t1.survey_id_fk=?', [req.params.id]);

            var [advantages] = await pp.query("select  t1.id, t1.comment, t1.id as c_id , t1.personnel_id_fk as personnel_id, t1.survey_user_id_fk as survey_user_id, concat(t2.first_name, ' ', t2.last_name) as personnel_name, concat(t3.first_name, ' ', t3.last_name) as user_name,  (select count(id) from survey_disadv_reaction where reaction=? and dis_adv_id_fk=c_id) as likes, (select count(id) from survey_disadv_reaction where reaction=? and dis_adv_id_fk=c_id) as dislikes, (select count(id) from survey_disadv_reaction where reaction=? and personnel_id_fk=? and dis_adv_id_fk=c_id) as liked, (select count(id) from survey_disadv_reaction where reaction=? and personnel_id_fk=? and dis_adv_id_fk=c_id) as disliked, t4.position, t5.name as workgroup_name, t2.image_url from survey_adv_dis as t1 left join personnel as t2 on t1.personnel_id_fk=t2.id left join survey_user as t3 on t1.survey_user_id_fk=t3.id left join survey_workgroup_personnel as t4 on t1.personnel_id_fk = t4.personnel_id_fk left join survey_workgroup as t5 on t4.workgroup_id_fk=t5.id where survey_id_fk=? and type=? group by t1.id", ['like', 'dislike', 'like', req.params.id, 'dislike', req.user.id, req.params.id, 'adv']);

            var [disadvantages] = await pp.query("select  t1.id, t1.comment, t1.id as c_id ,concat(t2.first_name, ' ', t2.last_name) as personnel_name, t1.personnel_id_fk as personnel_id, t1.survey_user_id_fk as survey_user_id, concat(t3.first_name, ' ', t3.last_name) as user_name, (select count(id) from survey_disadv_reaction where reaction=? and dis_adv_id_fk=c_id) as likes, (select count(id) from survey_disadv_reaction where reaction=? and dis_adv_id_fk=c_id) as dislikes, (select count(id) from survey_disadv_reaction where reaction=? and personnel_id_fk=? and dis_adv_id_fk=c_id) as liked, (select count(id) from survey_disadv_reaction where reaction=? and personnel_id_fk=? and dis_adv_id_fk=c_id) as disliked, t4.position, t2.image_url, t5.name as workgroup_name from survey_adv_dis as t1 left join personnel as t2 on t1.personnel_id_fk=t2.id left join survey_user as t3 on t1.survey_user_id_fk=t3.id left join survey_workgroup_personnel as t4 on t1.personnel_id_fk = t4.personnel_id_fk left join survey_workgroup as t5 on t4.workgroup_id_fk=t5.id where survey_id_fk=? and type=? group by t1.id", ['like', 'dislike', 'like', req.params.id, 'dislike', req.user.id, req.params.id, 'dis']);

            var [comments] = await pp.query('select t1.id, t1.id as c_id, t1.date, t1.description, t1.type, t2.first_name, t2.last_name, t2.image_url,  t3.id as disadv_id, (select count(id) from survey_disadv_comment_reaction where reaction=? and survey_advdis_comment_id_fk=c_id) as likes , (select count(id) from survey_disadv_comment_reaction where reaction=? and survey_advdis_comment_id_fk=c_id) as dislikes from survey_advdis_comment as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id inner join survey_adv_dis as t3 on t1.survey_advdis_id_fk = t3.id where t3.survey_id_fk=?', ['like', 'dislike', req.params.id]);

            var [execution] = await pp.query('select t1.*, t2.first_name, t2.last_name, t3.name as company_name from survey_execution as t1 left join personnel as t2 on t1.personnel_id_fk=t2.id left join company as t3 on t3.manager_id_fk=t2.id  where t1.survey_id_fk=?', [req.params.id]);

            var [latestExecLog] = await pp.query('select * from survey_log where survey_id_fk=? and to_status=? order by id desc limit 1', [
                req.params.id,
                'ابلاغ به مجری'
            ]);

            var result = await surveyHelper.finalResult_v1(req.params.id, pp);

            var [workgroup] = await pp.query('select * from survey_workgroup where id=?', [survey[0].workgroup_id_fk]);

            if (survey.length == 1) {
                res.status(200).send({
                    survey: survey[0],
                    participants: participants,
                    advantages: advantages,
                    disadvantages: disadvantages,
                    comments: comments,
                    log: logs.length > 0 ? logs[0] : null,
                    execution: execution.length > 0 ? execution[0] : null,
                    workgroup: workgroup.length > 0 ? workgroup[0] : null,
                    latestLogExec: latestExecLog.length > 0 ? latestExecLog[0] : null,
                    result: result
                });
            }
            else {
                res.status(403).send('فرم پیشنهاد در سامانه پیدا نشد');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/edit/:id`, surveyMulter.single('survey_file'), auth.survey_authorized, async (req, res) => {
        try {
            var [survey] = await pp.query('select status from survey where id=? and survey_id_fk=?', [req.params.id, req.user.id]);
            if (survey.length == 1) {
                if (survey[0].status != 'ارزیابی دبیر دبیرخانه') {
                    res.status(403).send('شما مجاز به ویرایش این پیشنهاد نیستید')
                    return;
                }
            }
            else if (survey.length == 0) {
                res.status(403).send('survey not found');
                return;
            }

            await pp.query('update survey set workgroup_id_fk=?, participate_type=?, participate_group_name=?,  survey_call=?, survey_workgroup_call_id_fk=?, title=?, type=?, survey_category_id_fk=?, category_title=?, problem_description=?, suggestion=?, requirement=?, is_exist=?, participate_in_execution=?, participate_exe_type=?, participate_exe_percent=?, participate_exe_year=?, file_url=? where id=?', [
                -1,
                req.body.participate_type,
                req.body.group_name,
                req.body.is_survey_call == true ? 1 : 0,
                req.body.workgroup_call_id,
                req.body.title,
                req.body.type,
                req.body.category_id,
                req.body.category_title,
                req.body.problem_description,
                req.body.suggestion,
                req.body.requirement,
                req.body.is_exist == true ? 1 : 0,
                req.body.participate_in_execution == true ? 1 : 0,
                req.body.participate_exe_type,
                req.body.participate_exe_percent,
                req.body.participate_exe_year,
                req.file != null ? `/api/file/survey/${req.file.filename}` : null,
                req.params.id
            ]);

            //delete
            for (let i = 0; i < req.body.del_participants.length; i++) {
                await pp.query('delete from survey_participant where id=?', [req.body.del_participants[i]]);
            }

            for (let i = 0; i < req.body.del_dis_adv.length; i++) {
                await pp.query('delete from survey_adv_dis where id=?', [req.body.del_dis_adv[i]]);
            }

            //participants
            var arr = req.body.participants;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == -1) { //insert
                    await pp.query('insert into survey_participant (survey_id_fk, survey_user_id_fk, participation_percent) values (?,?,?)', [
                        req.params.id,
                        arr[i].personnel_id,
                        arr[i].percent
                    ]);
                }
                else { //update
                    await pp.query('update survey_participant set participation_percent=? where id=?', [
                        arr[i].participation_percent,
                        req.params.id
                    ])
                }
            }


            // advantages/disadvantages
            var advantages = req.body.advantages;
            var disadvantages = req.body.disadvantages;

            for (let i = 0; i < advantages.length; i++) {
                if (advantages[i].id == -1) { //insert
                    await pp.query('insert into survey_adv_dis (personnel_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                        req.user.id,
                        advantages[i].comment,
                        'adv',
                        req.params.id
                    ])
                }
                else { //update
                    await pp.query('update survey_adv_dis set comment =? where id=?', [
                        advantages[i].comment,
                        advantages[i].id
                    ])
                }
            }

            for (let i = 0; i < disadvantages.length; i++) {
                if (disadvantages[i].id == -1) { //insert
                    await pp.query('insert into survey_adv_dis (personnel_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                        req.user.id,
                        disadvantages[i].comment,
                        'dis',
                        req.params.id
                    ])
                }
                else { //update
                    await pp.query('update survey_adv_dis set comment =? where id=?', [
                        disadvantages[i].comment,
                        disadvantages[i].id
                    ])
                }
            }


            //save log
            // await pp.query('insert into survey_log (survey_id_fk, action, date, survey_user_id_fk) values (?,?,?,?)', [
            //     req.params.id,
            //     'پیشنهاد ویرایش شد',
            //     moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
            //     req.user.id
            // ]);


            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/:id`, surveyMulter.single('survey_file'), auth.authorized, async (req, res) => {
        try {
            var [survey] = await pp.query('select status from survey where id=?', [req.params.id]);
            if (survey.length == 1) {
                if (survey[0].status != 'ارزیابی دبیر دبیرخانه') {
                    res.status(403).send('شما مجاز به ویرایش این پیشنهاد نیستید')
                    return;
                }
            }
            await pp.query('update survey set workgroup_id_fk=?, participate_type=?, participate_group_name=?,  survey_call=?, survey_workgroup_call_id_fk=?, title=?, type=?, survey_category_id_fk=?, category_title=?, problem_description=?, suggestion=?, requirement=?, is_exist=?, participate_in_execution=?, participate_exe_type=?, participate_exe_percent=?, participate_exe_year=?, file_url=? where id=?', [
                -1,
                req.body.participate_type,
                req.body.group_name,
                req.body.is_survey_call == true ? 1 : 0,
                req.body.workgroup_call_id,
                req.body.title,
                req.body.type,
                req.body.category_id,
                req.body.category_title,
                req.body.problem_description,
                req.body.suggestion,
                req.body.requirement,
                req.body.is_exist == true ? 1 : 0,
                req.body.participate_in_execution == true ? 1 : 0,
                req.body.participate_exe_type,
                req.body.participate_exe_percent,
                req.body.participate_exe_year,
                req.file != null ? `/api/file/survey/${req.file.filename}` : null,
                req.params.id
            ]);

            //delete
            for (let i = 0; i < req.body.del_participants.length; i++) {
                await pp.query('delete from survey_participant where id=?', [req.body.del_participants[i]]);
            }

            for (let i = 0; i < req.body.del_dis_adv.length; i++) {
                await pp.query('delete from survey_adv_dis where id=?', [req.body.del_dis_adv[i]]);
            }

            //participants
            var arr = req.body.participants;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == -1) { //insert
                    await pp.query('insert into survey_participant (survey_id_fk, survey_user_id_fk, participation_percent) values (?,?,?)', [
                        req.params.id,
                        arr[i].personnel_id,
                        arr[i].percent
                    ]);
                }
                else { //update
                    await pp.query('update survey_participant set participation_percent=? where id=?', [
                        arr[i].participation_percent,
                        req.params.id
                    ])
                }
            }


            // advantages/disadvantages
            var advantages = req.body.advantages;
            var disadvantages = req.body.disadvantages;

            for (let i = 0; i < advantages.length; i++) {
                if (advantages[i].id == -1) { //insert
                    await pp.query('insert into survey_adv_dis (personnel_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                        req.user.id,
                        advantages[i].comment,
                        'adv',
                        req.params.id
                    ])
                }
                else { //update
                    await pp.query('update survey_adv_dis set comment =? where id=?', [
                        advantages[i].comment,
                        advantages[i].id
                    ])
                }
            }

            for (let i = 0; i < disadvantages.length; i++) {
                if (disadvantages[i].id == -1) { //insert
                    await pp.query('insert into survey_adv_dis (personnel_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                        req.user.id,
                        disadvantages[i].comment,
                        'dis',
                        req.params.id
                    ])
                }
                else { //update
                    await pp.query('update survey_adv_dis set comment =? where id=?', [
                        disadvantages[i].comment,
                        disadvantages[i].id
                    ])
                }
            }


            //save log
            // await pp.query('insert into survey_log (survey_id_fk, action, date, personnel_id_fk) values (?,?,?,?)', [
            //     req.params.id,
            //     'پیشنهاد ویرایش شد',
            //     moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
            //     req.user.id
            // ]);

            //notification
            await surveyHelper.notification(1, req.params.id, pp);

            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/my/list`, auth.survey_authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select  t1.id, t3.id as survey_user_id, t1.workgroup_id_fk, t1.type, t3.first_name, t3.last_name, t1.title, t1.participate_type, t1.code, IF(t2.name is null, t1.category_title, t2.name) as category_name, t4.action as last_action, t4.date as last_update_date, t4.description as message,t1.status, t5.name as workgroup_name from survey as t1 left join survey_category as t2 on t1.survey_category_id_fk = t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_log as t4 on t1.id = t4.survey_id_fk left join survey_workgroup as t5 on t1.workgroup_id_fk=t5.id where t1.survey_user_id_fk=? and t4.id = (select max(id) from survey_log where survey_id_fk=t1.id) order by t1.id desc', [
                req.user.id
            ]);

            var jList = JSON.parse(JSON.stringify(list));

            for (let i = 0; i < jList.length; i++) {

                var result = await surveyHelper.finalResult_v1(jList[i].id, pp);
                if (jList[i].status != 'در انتظار بررسی توسط پیشنهاد دهنده') {
                    jList[i].message = '*****';
                }
                jList[i] = {
                    ...jList[i],
                    result: result
                }
            }

            res.status(200).send(jList);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })


    app.get(`${prefix}`, auth.authorized, async (req, res) => {
        try {

            //define my member ship
            var [my_membership] = await pp.query('select * from survey_workgroup_personnel where personnel_id_fk=?', [
                req.user.id
            ])


            if (my_membership.length == 0) {
                res.status(200).send(null);
            }
            else {
                var is_dabir_dabirkhaneh = false;
                var is_dabir_nezam = false;
                for (let i = 0; i < my_membership.length; i++) {
                    if (my_membership[i].position == 'دبیر' && my_membership[i].workgroup_id_fk == 11) {
                        is_dabir_nezam = true;
                    }
                    if (my_membership[i].position == 'دبیر' && my_membership[i].workgroup_id_fk == 12) {
                        is_dabir_dabirkhaneh = true;
                    }
                }

                if (is_dabir_dabirkhaneh || is_dabir_nezam) {
                    //list all
                    var [list] = await pp.query('select  t1.id, t3.id as survey_user_id, t1.workgroup_id_fk, t3.first_name, t3.last_name, t1.title, t1.participate_type, t1.code, t2.name as category_name, t4.action as last_action, t4.date as last_update_date, t4.description as last_message,t1.status, t5.name as workgroup_name from survey as t1 inner join survey_category as t2 on t1.survey_category_id_fk = t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_log as t4 on t1.id = t4.survey_id_fk left join survey_workgroup as t5 on t1.workgroup_id_fk=t5.id where t4.id = (select max(id) from survey_log where survey_id_fk=t1.id)');
                    res.status(200).send(list);
                }
                else {
                    //list based on membership
                    var [my_last_status] = await pp.query('select id, status, survey_id_fk, personnel_id_fk from survey_member where id in (select max(id) from survey_member where personnel_id_fk = ? group by survey_id_fk);', [req.user.id]);



                    var ids = [];
                    for (let i = 0; i < my_last_status.length; i++) {
                        var [surveys] = await pp.query('select id from survey where status=? and id=?', [my_last_status[i].status, my_last_status[i].survey_id_fk]);

                        if (surveys.length == 1) {
                            ids.push(surveys[0].id);
                        }
                    }


                    if (ids.length > 0) {
                        var cmd = `select  t1.id, t3.id as survey_user_id, t1.workgroup_id_fk, t3.first_name, t3.last_name, t1.title, t1.participate_type, t1.code, t2.name as category_name, t4.action as last_action, t4.date as last_update_date, t4.description as last_message,t1.status, t5.name as workgroup_name from survey as t1 inner join survey_category as t2 on t1.survey_category_id_fk = t2.id inner join survey_user as t3 on t1.survey_user_id_fk = t3.id left join survey_log as t4 on t1.id = t4.survey_id_fk left join survey_workgroup as t5 on t1.workgroup_id_fk=t5.id where t1.id in (${ids.toString()}) and t4.id = (select max(id) from survey_log where survey_id_fk=t1.id)`;

                        var [output_list] = await pp.query(cmd);

                        res.status(200).send(output_list);
                    }
                    else {
                        res.status(200).send([]);
                    }
                }
            }
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    });

    app.delete(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    await pp.query('delete from survey where id=?', [arr[i]]);
                    await pp.query('delete from survey_participant where survey_id_fk=?', [arr[i]]);
                    await pp.query('delete from survey_adv_dis where survey_id_fk=?', [arr[i]]);
                }
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

    app.delete(`${prefix}/my/item`, auth.survey_authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;
                for (let i = 0; i < arr.length; i++) {
                    await pp.query('delete from survey where id=? and survey_user_id_fk=? and status=?', [arr[i], req.user.id, 'ارزیابی دبیر کارگروه تخصصی']);
                    
                    //delete notifications
                    await pp.query('delete from survey_member_status_count where survey_id_fk=?', [arr[i]]);
                }
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

    app.put(`${prefix}/my/item/:id`, surveyMulter.single('survey_file'), auth.survey_authorized, async (req, res) => {
        try {

            await pp.query('update survey set workgroup_id_fk=?, participate_type=?, participate_group_name=?,  survey_call=?, survey_workgroup_call_id_fk=?, title=?, type=?, survey_category_id_fk=?, category_title=?, problem_description=?, suggestion=?, requirement=?, is_exist=?, participate_in_execution=?, participate_exe_type=?, participate_exe_percent=?, participate_exe_year=?, file_url=? where id=?', [
                req.body.workgroup_id,
                req.body.participate_type,
                req.body.group_name,
                req.body.is_survey_call == true ? 1 : 0,
                req.body.workgroup_call_id,
                req.body.title,
                req.body.type,
                req.body.category_id,
                req.body.category_title,
                req.body.problem_description,
                req.body.suggestion,
                req.body.requirement,
                req.body.is_exist == true ? 1 : 0,
                req.body.participate_in_execution == true ? 1 : 0,
                req.body.participate_exe_type,
                req.body.participate_exe_percent,
                req.body.participate_exe_year,
                req.file != null ? `/api/file/survey/${req.file.filename}` : null,
                req.params.id
            ]);

            //delete
            for (let i = 0; i < req.body.del_participants.length; i++) {
                await pp.query('delete from survey_participant where id=?', [req.body.del_participants[i]]);
            }

            for (let i = 0; i < req.body.del_dis_adv.length; i++) {
                await pp.query('delete from survey_adv_dis where id=?', [req.body.del_dis_adv[i]]);
            }

            //participants
            var arr = req.body.participants;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id == -1) { //insert
                    await pp.query('insert into survey_participant (survey_id_fk, survey_user_id_fk, participation_percent) values (?,?,?)', [
                        req.params.id,
                        arr[i].personnel_id,
                        arr[i].percent
                    ]);
                }
                else { //update
                    await pp.query('update survey_participant set participation_percent=? where id=?', [
                        arr[i].participation_percent,
                        req.params.id
                    ])
                }
            }


            // advantages/disadvantages
            var advantages = req.body.advantages;
            var disadvantages = req.body.disadvantages;

            for (let i = 0; i < advantages.length; i++) {
                if (advantages[i].id == -1) { //insert
                    await pp.query('insert into survey_adv_dis (personnel_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                        req.user.id,
                        advantages[i].comment,
                        'adv',
                        req.params.id
                    ])
                }
                else { //update
                    await pp.query('update survey_adv_dis set comment =? where id=?', [
                        advantages[i].comment,
                        advantages[i].id
                    ])
                }
            }

            for (let i = 0; i < disadvantages.length; i++) {
                if (disadvantages[i].id == -1) { //insert
                    await pp.query('insert into survey_adv_dis (personnel_id_fk, comment, type, survey_id_fk) values (?,?,?,?)', [
                        req.user.id,
                        disadvantages[i].comment,
                        'dis',
                        req.params.id
                    ])
                }
                else { //update
                    await pp.query('update survey_adv_dis set comment =? where id=?', [
                        disadvantages[i].comment,
                        disadvantages[i].id
                    ])
                }
            }


            //save log
            // await pp.query('insert into survey_log (survey_id_fk, action, date, personnel_id_fk) values (?,?,?,?)', [
            //     req.params.id,
            //     'پیشنهاد ویرایش شد',
            //     moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
            //     req.user.id
            // ]);


            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.put(`${prefix}/workgroup/assign/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.workgroup_id) {
                await pp.query('update survey set workgroup_id_fk = ? where id=?', [
                    req.body.workgroup_id,
                    req.params.id
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

    app.get(`${prefix}/user/lookup/:national_code`, auth.survey_authorized, async (req, res) => {
        try {
            var [user] = await pp.query('select id, first_name, last_name, national_code from survey_user where national_code=?', [
                req.params.national_code,
                req.user.id
            ]);
            res.status(200).send(user);
        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })

    var timelineStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './_uploads/survey');
        },
        filename: function (req, file, cb) {
            var fn = moment().utc(true).format('YYMMDDHHmmss');
            fn = `${fn}_timeline${path.extname(file.originalname)}`;
            cb(null, fn)
        }
    })
    var timelineMulter = multer({ storage: timelineStorage })
    app.put(`${prefix}/status/:id`, timelineMulter.single('file'), auth.authorized, async (req, res) => {
        try {
            if (req.body.from_status && req.body.to_status && req.body.type) {
                //update status of survey
                if (req.body.to_status == 'ارزیابی اولیه مجری') {

                    await pp.query('update survey set status=?, last_update_date=?  where id=?',
                        [req.body.to_status,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.params.id]);

                    if (req.body.suggest_type) {
                        await pp.query('update survey set type=? where id=?',
                            [req.body.suggest_type,
                            req.params.id]);
                    }

                    if (req.body.category_title) {
                        await pp.query('update survey set category_title=?, survey_category_id_fk=?  where id=?',
                            [req.body.category_title,
                                null,
                            req.params.id]);
                    }
                    if (req.body.category) {
                        if (req.body.category != "0") {
                            await pp.query('update survey set survey_category_id_fk=? where id=?',
                                [req.body.category,
                                req.params.id]);
                        }
                    }

                }
                else {
                    await pp.query('update survey set status=?, last_update_date=?  where id=?',
                        [req.body.to_status,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.params.id]);
                }

                //register log

                if (req.body.from_status == 'رد اجرا توسط مجری' && req.body.to_status == 'ارزیابی اولیه مجری') {
                    await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                        req.body.description,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.user.id,
                        req.params.id,
                        req.body.description,
                        req.body.from_status,
                        req.body.to_status,
                        req.body.type
                    ]);
                }
                else if (req.body.from_status == '' && req.body.to_status == '') {
                    await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                        req.body.description,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.user.id,
                        req.params.id,
                        req.body.description,
                        req.body.from_status,
                        req.body.to_status,
                        req.body.type
                    ]);
                }
                else {
                    await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                        `پیشنهاد از ${req.body.from_status} به ${req.body.to_status} تغییر وضعیت داده شد`,
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        req.user.id,
                        req.params.id,
                        req.body.description,
                        req.body.from_status,
                        req.body.to_status,
                        req.body.type
                    ]);
                }





                //update workgroup
                if (req.body.from_status == 'ارزیابی دبیر دبیرخانه' || req.body.from_status == 'ارزیابی عضو دبیرخانه' && req.body.to_status == 'رد شده توسط دبیرخانه') {
                    if (req.body.wid != null) {
                        await pp.query('update survey set workgroup_id_fk=? where id=?', [req.body.wid, req.params.id]);
                    }
                }

                if (req.body.to_status == 'رد نهایی') {
                    if (req.body.reward != null) {
                        await pp.query('update survey set reward = ? where id=?', [req.body.reward, req.params.id]);
                    }
                }

                if (req.body.to_status == 'ارزیابی اولیه مجری') {
                    if (req.body.reward != null) {
                        await pp.query('update survey set reward = ? where id=?', [req.body.reward, req.params.id]);
                    }
                }

                //survey members & notification
                if (req.body.from_status == 'در انتظار تایید نهایی کارگروه تخصصی' && req.body.to_status == 'ارزیابی اولیه مجری') {
                    if (req.body.unit && req.body.reward_type) {
                        var [members] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=12');


                        let allowInsert = false;

                        var [_insert] = await pp.query('select * from survey_top_workgroup where survey_id_fk = ?', [req.params.id]);

                        if (_insert.length == 0) {
                            allowInsert = true;
                        }

                        if (allowInsert) {
                            //insert into survey_top
                            await pp.query('insert into survey_top_workgroup (survey_id_fk, reward_type, suggest_reward, score, due_day, unit, company_id_fk, personnel_id_fk) values (?,?,?,?,?,?,?,?)', [
                                req.params.id,
                                req.body.reward_type,
                                req.body.suggest_reward,
                                req.body.score,
                                req.body.due_day,
                                req.body.unit,
                                req.body.company_id,
                                req.body.personnel_id]);
                        }
                        else {
                            //must update
                            await pp.query('update survey_top_workgroup set reward_type=?, suggest_reward = ?, score=?, due_day=?, unit=?, company_id_fk=?, personnel_id_fk=? where id=?', [
                                req.body.reward_type,
                                req.body.suggest_reward,
                                req.body.score,
                                req.body.due_day,
                                req.body.unit,
                                req.body.company_id,
                                req.body.personnel_id,
                                _insert[0].id
                            ]);
                        }



                        //insert execution
                        var uid = -1;

                        if (req.body.company_id) {
                            var [company] = await pp.query('select * from company where id=?', [req.body.company_id]);
                            uid = company[0].manager_id_fk;
                        }
                        else if (req.body.personnel_id) {
                            uid = req.body.personnel_id;
                        }

                        allowInsert = false;

                        var [_exDuplicate] = await pp.query('select * from survey_execution where survey_id_fk=?', [req.params.id]);

                        if (_exDuplicate.length == 0) {
                            allowInsert = true;
                        }

                        if (allowInsert) {
                            await pp.query('insert into survey_execution (survey_id_fk, personnel_id_fk, date) values (?,?,?)', [
                                req.params.id,
                                uid,
                                moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                            ]);
                        }




                        //delete previous members of current status
                        await pp.query('delete from survey_member where survey_id_fk=? and status=?', [
                            req.params.id,
                            req.body.to_status
                        ]);

                        for (let i = 0; i < members.length; i++) {
                            await pp.query('insert into survey_member (survey_id_fk, personnel_id_fk, status) values (?,?,?)', [
                                req.params.id,
                                members[i].personnel_id_fk,
                                req.body.to_status
                            ])
                        }

                        //notification
                        await surveyHelper.notification(18, req.params.id, pp);
                    }
                    else {
                        res.status(403).send('incomplete request');
                    }
                }
                else if (req.body.from_status == 'رد اجرا توسط مجری' && req.body.to_status == 'ارزیابی اولیه مجری') {
                    if (req.body.unit && req.body.reward_type) {

                        //delete previous execution
                        await pp.query('delete from survey_execution where survey_id_fk=?', [req.params.id]);


                        var [members] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=12');


                        let allowInsert = false;

                        var [_insert] = await pp.query('select * from survey_top_workgroup where survey_id_fk = ?', [req.params.id]);

                        if (_insert.length == 0) {
                            allowInsert = true;
                        }

                        if (allowInsert) {
                            //insert into survey_top
                            await pp.query('insert into survey_top_workgroup (survey_id_fk, reward_type, suggest_reward, score, due_day, unit, company_id_fk, personnel_id_fk) values (?,?,?,?,?,?,?,?)', [
                                req.params.id,
                                req.body.reward_type,
                                req.body.suggest_reward,
                                req.body.score,
                                req.body.due_day,
                                req.body.unit,
                                req.body.company_id,
                                req.body.personnel_id]);
                        }
                        else {
                            //must update
                            await pp.query('update survey_top_workgroup set reward_type=?, suggest_reward = ?, score=?, due_day=?, unit=?, company_id_fk=?, personnel_id_fk=? where id=?', [
                                req.body.reward_type,
                                req.body.suggest_reward,
                                req.body.score,
                                req.body.due_day,
                                req.body.unit,
                                req.body.company_id,
                                req.body.personnel_id,
                                _insert[0].id
                            ]);
                        }



                        //insert execution
                        var uid = -1;

                        if (req.body.company_id) {
                            var [company] = await pp.query('select * from company where id=?', [req.body.company_id]);
                            uid = company[0].manager_id_fk;
                        }
                        else if (req.body.personnel_id) {
                            uid = req.body.personnel_id;
                        }

                        allowInsert = false;

                        var [_exDuplicate] = await pp.query('select * from survey_execution where survey_id_fk=?', [req.params.id]);

                        if (_exDuplicate.length == 0) {
                            allowInsert = true;
                        }

                        if (allowInsert) {
                            await pp.query('insert into survey_execution (survey_id_fk, personnel_id_fk, date) values (?,?,?)', [
                                req.params.id,
                                uid,
                                moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                            ]);
                        }




                        //delete previous members of current status
                        await pp.query('delete from survey_member where survey_id_fk=? and status=?', [
                            req.params.id,
                            req.body.to_status
                        ]);

                        for (let i = 0; i < members.length; i++) {
                            await pp.query('insert into survey_member (survey_id_fk, personnel_id_fk, status) values (?,?,?)', [
                                req.params.id,
                                members[i].personnel_id_fk,
                                req.body.to_status
                            ])
                        }

                        //notification
                        await surveyHelper.notification(18, req.params.id, pp);
                    }
                    else {
                        res.status(403).send('incomplete request');
                    }
                }
                else if (req.body.from_status == 'ارزیابی مدیرعامل' && req.body.to_status == 'ابلاغ به مجری') {
                    var [top] = await pp.query('select * from survey_top_workgroup where survey_id_fk = ?', [req.params.id]);

                    if (top[0].company_id_fk != null) {

                        var [company] = await pp.query('select * from company where id=?', [top[0].company_id_fk]);
                        await pp.query('insert into survey_execution (survey_id_fk, personnel_id_fk, date) values (?,?,?)', [
                            req.params.id,
                            company[0].manager_id_fk,
                            moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                        ]);
                        res.status(200).send('done');

                        //notification
                        await surveyHelper.notification(15, req.params.id, pp);

                        return;
                    }
                    else if (top[0].personnel_id_fk != null) {
                        await pp.query('insert into survey_execution (survey_id_fk, personnel_id_fk, date) values (?,?,?)', [
                            req.params.id,
                            top[0].personnel_id_fk,
                            moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                        ]);

                        await surveyHelper.notification(15, req.params.id, pp);

                        res.status(200).send('done');
                    }
                }

                else if ((req.body.from_status == 'ارزیابی اولیه مجری' || req.body.from_status == 'در انتظار اصلاح برنامه زمانبندی') && req.body.to_status == 'در انتظار تایید برنامه زمانبندی') {
                    await pp.query('update survey_execution set due_day=?, timeline_file=? where survey_id_fk=?', [
                        req.body.due_day,
                        req.file != null ? `/api/file/timeline_survey/${req.file.filename}` : null,
                        req.params.id
                    ]);

                    await surveyHelper.notification(19, req.params.id, pp);
                }
                else {

                    if (req.body.personnel_ids) {
                        var arr = req.body.personnel_ids;
                        await pp.query('delete from survey_member where survey_id_fk=? and (status=? or status=?)', [
                            req.params.id,
                            req.body.to_status,
                            req.body.from_status
                        ]);

                        for (let i = 0; i < arr.length; i++) {
                            await pp.query('insert into survey_member (survey_id_fk, personnel_id_fk, status) values (?,?,?)', [
                                req.params.id,
                                arr[i],
                                req.body.to_status
                            ])
                        }


                        //notifications
                        if (req.body.to_status == 'در انتظار بررسی توسط پیشنهاد دهنده') {
                            await surveyHelper.notification(21, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'درخواست بررسی اصلاحات پیشنهاد دهنده') {
                            await surveyHelper.notification(20, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'در انتظار تایید نهایی کارگروه تخصصی') {
                            await surveyHelper.notification(22, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'رد اجرا توسط مجری') {
                            await surveyHelper.notification(16, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'در انتظار اصلاح برنامه زمانبندی') {
                            await surveyHelper.notification(24, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'ارزیابی اعضای کارگروه عالی') {
                            await surveyHelper.notification(11, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'رد شده توسط کارگروه عالی') {
                            await surveyHelper.notification(12, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'ارزیابی مدیرعامل') {
                            await surveyHelper.notification(14, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'تعویق عملیات اجرایی') {
                            await surveyHelper.notification(17, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'در انتظار تغییر کارگروه تخصصی') {
                            await surveyHelper.notification(25, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'رد شده توسط دبیر کارگروه تخصصی') {
                            await surveyHelper.notification(9, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'درخواست تجدید نظر توسط پیشنهاد دهنده') {
                            await surveyHelper.notification(10, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'رد نهایی') {
                            await surveyHelper.notification(13, req.params.id, pp);
                        }
                        else if (req.body.to_status == 'رد شده توسط کارگروه تخصصی') {
                            await surveyHelper.notification(26, req.params.id, pp);
                        }
                        else {
                            await surveyHelper.notificationToMembers(req.body.personnel_ids, req.params.id, req.body.to_status, pp);
                        }



                    }
                }

                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            res.status(403).send('error occured');
            console.log(err);
        }
    });


    app.put(`${prefix}/assign/workgroup/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.workgroup_id) {
                await pp.query('update survey set workgroup_id_fk=? where id=?', [
                    req.body.workgroup_id,
                    req.params.id
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

    app.put(`${prefix}/reset/:id`, auth.authorized, async (req, res) => {
        try {
            await pp.query('delete from survey_log where survey_id_fk=? and not(from_status is null)', [
                req.params.id
            ]);

            var [results] = await pp.query('select * from survey_result where survey_id_fk=?', [req.params.id]);
            if (results.length == 1) {
                await pp.query('delete from survey_result_evaluation where result_id_fk=?', [results[0].id]);
            }

            await pp.query('update survey set status=? where id=?', ['ارزیابی دبیر دبیرخانه', req.params.id]);
            res.status(200).send('done');
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.post(`${prefix}/excellent/group/result`, auth.authorized, async (req, res) => {
        try {
            if (req.body.survey_id && req.body.approve != null) {
                //delete previous
                await pp.query('delete from survey_excellent_group_result where personnel_id_fk=? and survey_id_fk=?', [req.user.id, req.body.survey_id]);

                //insert 
                var [amir] = await pp.query('insert into survey_excellent_group_result (personnel_id_fk, survey_id_fk,approve) values (?,?,?)', [
                    req.user.id,
                    req.body.survey_id,
                    req.body.approve == true ? 1 : 0
                ]);



                //count number of votes
                var [top_members] = await pp.query('select count(id) as count from survey_workgroup_personnel where workgroup_id_fk=12 and member_from <= ? and (member_to >= ? or member_to is null)', [
                    moment().utc(true).format('YYYY/MM/DD 00:00:00'),
                    moment().utc(true).format('YYYY/MM/DD 23:59:59')
                ]);


                //count votes of top members
                var [top_votes] = await pp.query('select count(id) as count from survey_excellent_group_result where survey_id_fk=?', [req.body.survey_id]);


                var [count_approves] = await pp.query('select count(id) as count from survey_excellent_group_result where survey_id_fk=? and approve = ?', [req.body.survey_id, 1]);
                var [count_notapproves] = await pp.query('select count(id) as count from survey_excellent_group_result where survey_id_fk=? and approve = ?', [req.body.survey_id, 0]);

                const obj = { 
                    top_members : top_members[0].count,
                    top_votes : top_votes[0].count,
                    count_approves: count_approves[0].count,
                    count_notapproves: count_notapproves[0].count
                }
                console.table(obj);

                
                if (count_approves[0].count == count_notapproves[0].count && top_votes[0].count == top_members[0].count) {
                    //update survey
                    await pp.query('update survey set status=? where id=?', ['ارزیابی مدیرعامل', req.body.survey_id]);

                    //update survey log
                    await pp.query('insert into survey_log (action, date, survey_user_id_fk, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?,?)', [
                        'پیشنهاد از وضعیت ارزیابی اعضای کارگروه عالی به ارزیابی مدیر عامل تغییر وضعیت داده شد',
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        -1,
                        -1,
                        req.body.survey_id,
                        'پیشنهاد از وضعیت ارزیابی اعضای کارگروه عالی به ارزیابی مدیر عامل تغییر وضعیت داده شد',
                        'ارزیابی اعضای کارگروه عالی',
                        'ارزیابی مدیرعامل',
                        'forward'
                    ]);
                    await surveyHelper.notification(14, req.body.survey_id, pp);

                }
                else if (count_approves[0].count >= (parseInt(top_members[0].count / 2)) + 1) {
                    //update survey
                    await pp.query('update survey set status=? where id=?', ['ارزیابی مدیرعامل', req.body.survey_id]);

                    //update survey log
                    await pp.query('insert into survey_log (action, date, survey_user_id_fk, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?,?)', [
                        'پیشنهاد از وضعیت ارزیابی اعضای کارگروه عالی به ارزیابی مدیر عامل تغییر وضعیت داده شد',
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        -1,
                        -1,
                        req.body.survey_id,
                        'پیشنهاد از وضعیت ارزیابی اعضای کارگروه عالی به ارزیابی مدیر عامل تغییر وضعیت داده شد',
                        'ارزیابی اعضای کارگروه عالی',
                        'ارزیابی مدیرعامل',
                        'forward'
                    ]);

                    //notification
                    await surveyHelper.notification(14, req.body.survey_id, pp);
                }
                else if (count_notapproves[0].count >= (parseInt(top_members[0].count / 2)) + 1) {
                    //update survey
                    await pp.query('update survey set status=? where id=?', ['رد شده توسط کارگروه عالی', req.body.survey_id]);

                    //update survey log
                    await pp.query('insert into survey_log (action, date, survey_user_id_fk, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?,?)', [
                        'پیشنهاد از وضعیت ارزیابی اعضای کارگروه عالی به رد شده توسط کارگروه عالی تغییر وضعیت داده شد',
                        moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                        -1,
                        -1,
                        req.body.survey_id,
                        'پیشنهاد از وضعیت ارزیابی اعضای کارگروه عالی به رد شده توسط کارگروه عالی تغییر وضعیت داده شد',
                        'ارزیابی اعضای کارگروه عالی',
                        'رد شده توسط کارگروه عالی',
                        'forward'
                    ]);

                    //notification
                    await surveyHelper.notification(12, req.body.survey_id, pp);
                }
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
    })


    app.put(`${prefix}/postpone/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.date) {
                const [survey] = await pp.query('select * from survey where id=?', [req.params.id]);

                const fromStatus = survey[0].status;
                const toStatus = 'تعویق عملیات اجرایی';

                await pp.query('update survey set end_of_postpone=?, status=? where id=?', [
                    req.body.date,
                    toStatus,
                    req.params.id
                ]);



                //register log
                await pp.query('insert into survey_log (action, date, personnel_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                    `پیشنهاد از ${fromStatus} به ${toStatus} تغییر وضعیت داده شد`,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.user.id,
                    req.params.id,
                    `پیشنهاد از ${fromStatus} به ${toStatus} تغییر وضعیت داده شد`,
                    fromStatus,
                    toStatus,
                    'forward'
                ]);

                await surveyHelper.notification(17, req.params.id, pp);

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
    })

    app.put(`${prefix}/review/:id`, auth.survey_authorized, async (req, res) => {
        try {
            var [survey] = await pp.query('select * from survey where id=? and survey_user_id_fk=? and status=?', [req.params.id, req.user.id, 'بررسی توسط پیشنهاد دهنده']);

            if (survey.length == 1) {
                await pp.query('update survey set status=? where id=?', [
                    'درخواست تجدیدنظر توسط پیشنهاد دهنده',
                    req.params.id
                ]);

                //update log
                await pp.query('insert into survey_log (action, date, survey_user_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                    'درخواست تجدید نظر',
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.user.id,
                    req.params.id,
                    'تغییر وضعیت از بررسی توسط پیشنهاد دهنده به درخواست تجدید نظر توسط پیشنهاد دهنده ثبت شد',
                    'بررسی توسط پیشنهاد دهنده',
                    'درخواست تجدیدنظر توسط پیشنهاد دهنده',
                    'forward'
                ]);

                //notification
                await surveyHelper.notification(10, req.params.id, pp);
            }

            res.status(200).send('done');
        }
        catch (err) {
            res.status(403).send('error occured');
            console.log(err);
        }
    })



    app.put(`${prefix}/revise/:id`, auth.survey_authorized, async (req, res) => {
        try {
            if (req.body.from_status && req.body.to_status) {

                //update survey
                await pp.query('update survey set status=? where id=?', [req.body.to_status, req.params.id]);

                //register log
                await pp.query('insert into survey_log (action, date, survey_user_id_fk, survey_id_fk, description, from_status, to_status, status_type) values (?,?,?,?,?,?,?,?)', [
                    `پیشنهاد از ${req.body.from_status} به ${req.body.to_status} تغییر وضعیت داده شد`,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.user.id,
                    req.params.id,
                    req.body.description,
                    req.body.from_status,
                    req.body.to_status,
                    req.body.type
                ]);

                if (req.body.to_status == 'درخواست بررسی اصلاحات پیشنهاد دهنده') {
                    surveyHelper.notification(20, req.params.id, pp);
                }
                else if (req.body.to_status == 'در انتظار بررسی توسط پیشنهاد دهنده') {
                    surveyHelper.notification(21, req.params.id, pp);
                }
                else if (req.body.to_status == 'در انتظار تایید نهایی کارگروه تخصصی') {
                    surveyHelper.notification(22, req.params.id, pp);
                }
                else if (req.body.to_status == 'در انتظار تایید برنامه زمانبندی') {
                    await surveyHelper.notification(19, req.params.id, pp);
                }
                else if (req.body.to_status == 'رد اجرا توسط مجری') {
                    await surveyHelper.notification(16, req.params.id, pp);
                }
                else if (req.body.to_status == 'در انتظار اصلاح برنامه زمانبندی') {
                    await surveyHelper.notification(24, req.params.id, pp);
                }
                else if (req.body.to_status == 'ارزیابی اعضای کارگروه عالی') {
                    await surveyHelper.notification(11, req.params.id, pp);
                }
                else if (req.body.to_status == 'رد شده توسط کارگروه عالی') {
                    await surveyHelper.notification(12, req.params.id, pp);
                }
                else if (req.body.to_status == 'ارزیابی مدیرعامل') {
                    await surveyHelper.notification(14, req.params.id, pp);
                }
                else if (req.body.to_status == 'تعویق عملیات اجرایی') {
                    await surveyHelper.notification(17, req.params.id, pp);
                }
                else if (req.body.to_status == 'در انتظار تغییر کارگروه تخصصی') {
                    await surveyHelper.notification(25, req.params.id, pp);
                }
                else if (req.body.to_status == 'رد شده توسط دبیر کارگروه تخصصی') {
                    await surveyHelper.notification(9, req.params.id, pp);
                }
                else if (req.body.to_status == 'درخواست تجدید نظر توسط پیشنهاد دهنده') {
                    await surveyHelper.notification(10, req.params.id, pp);
                }
                else if (req.body.to_status == 'رد نهایی') {
                    await surveyHelper.notification(13, req.params.id, pp);
                }

                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }

        }
        catch (err) {
            res.status(403).send('error occured');
        }
    })


    app.put(`${prefix}/reverse/:id/:reset/:top`, auth.authorized, async (req, res) => {
        try {
            var [log] = await pp.query('select * from survey_log where survey_id_fk=? order by id desc limit 1', [req.params.id]);
            if (log.length == 1) {
                await pp.query('delete from survey_log where id=?', [log[0].id])

                if (req.params.reset == "1") {
                    await pp.query('delete from survey_result where survey_id_fk=?', [req.params.id]);
                }

                if (req.params.top == "1") {
                    await pp.query('delete from survey_excellent_group_result where survey_id_fk=?', [req.params.id]);
                }
            }

            res.status(200).send('done');
        }
        catch (err) {
            res.status(403).send(err);
        }
    })


})