const auth = require('../../../middlewares/auth');
const crypt = require('../../../helpers/crypt');

module.exports = ((app) => {
    const prefix = '/api/survey/report';
    const pp = app.get('pool').promise();


    app.post(`${prefix}/users/top`, auth.authorized, async (req, res) => {
        try {
            if (req.body.from_date && req.body.to_date && req.body.workgroup_id) {
                var cmd = `select t1.id as s_id, t1.survey_user_id_fk, sum(t3.value) as total, t4.first_name, (select date from survey_result where survey_id_fk=s_id order by id desc limit 1) as date, t4.last_name from survey as t1 inner join survey_result as t2 on t1.id = t2.survey_id_fk inner join survey_result_evaluation as t3 on t2.id = t3.result_id_fk inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' group by t1.survey_user_id_fk order by total desc;`



                if (req.body.workgroup_id != 'all') {
                    cmd = `select t1.workgroup_id_fk, t1.id as s_id, t1.survey_user_id_fk, sum(t3.value) as total, t4.first_name, (select date from survey_result where survey_id_fk=s_id order by id desc limit 1) as date, t4.last_name from survey as t1 inner join survey_result as t2 on t1.id = t2.survey_id_fk inner join survey_result_evaluation as t3 on t2.id = t3.result_id_fk inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' and t1.workgroup_id_fk=${req.body.workgroup_id} group by t1.survey_user_id_fk order by total desc;`
                }



                var hash = await crypt.encrypt(cmd);
                var [list] = await pp.query(cmd);
                res.status(200).send({
                    list: list,
                    hash: hash
                });
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

    app.post(`${prefix}/users/count`, auth.authorized, async (req, res) => {
        try {
            var cmd = `select t1.id as s_id, t1.survey_user_id_fk, t1.workgroup_id_fk, count(t3.id) as count, t4.first_name, (select date from survey_result where survey_id_fk=s_id order by id desc limit 1) as date, t4.last_name from survey as t1 inner join survey_result as t2 on t1.id = t2.survey_id_fk inner join survey_result_evaluation as t3 on t2.id = t3.result_id_fk inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' group by t1.survey_user_id_fk order by count desc;`


            if (req.body.workgroup_id != 'all') {
                cmd = `select t1.id as s_id, t1.survey_user_id_fk, t1.workgroup_id_fk, count(t3.id) as count, t4.first_name, (select date from survey_result where survey_id_fk=s_id order by id desc limit 1) as date, t4.last_name from survey as t1 inner join survey_result as t2 on t1.id = t2.survey_id_fk inner join survey_result_evaluation as t3 on t2.id = t3.result_id_fk inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' and t1.workgroup_id_fk=${req.body.workgroup_id} group by t1.survey_user_id_fk order by count desc;`
            }

            var hash = await crypt.encrypt(cmd);
            var [list] = await pp.query(cmd);
            res.status(200).send({
                list: list,
                hash: hash
            });
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.post(`${prefix}/users/quality`, auth.authorized, async (req, res) => {
        try {
            if (req.body.workgroup_id) {

                var cmd = `select t1.survey_user_id_fk as user_id,  count(t1.id) as total_count, (select count(t1.id) from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as reject_count, (select sum(t1.value) from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as total_point, t4.first_name, t4.last_name, t1.workgroup_id_fk from survey as t1 inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where t1.workgroup_id_fk <> -1 group by user_id;`;


                if (req.body.workgroup_id != 'all') {
                    cmd = `select t1.survey_user_id_fk as user_id,  count(t1.id) as total_count, (select count(t1.id) from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as reject_count, (select sum(t1.value) from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as  total_point, t4.first_name, t4.last_name, t1.workgroup_id_fk from survey as t1 inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where t1.workgroup_id_fk <> -1 and t1.workgroup_id_fk = ${req.body.workgroup_id} group by user_id;`;
                }



                if (req.body.from_date && req.body.to_date) {
                    if (req.body.workgroup_id == 'all') {
                        cmd = `select t1.survey_user_id_fk as user_id,  count(t1.id) as total_count, (select count(t1.id) from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as reject_count, (select sum(t1.value) from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as total_point, t4.first_name, t4.last_name, t1.workgroup_id_fk from survey as t1 inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where t1.workgroup_id_fk <> -1 and t1.create_date >= '${req.body.from_date} 00:00:00' and t1.create_date <= '${req.body.to_date} 23:59:59' group by user_id;`;
                    }
                    else {
                        cmd = `select t1.survey_user_id_fk as user_id,  count(t1.id) as total_count, (select count(t1.id) from survey_result_reject as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as reject_count, (select sum(t1.value) from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey as t3 on t2.survey_id_fk = t3.id where t3.survey_user_id_fk=user_id) as total_point, t4.first_name, t4.last_name, t1.workgroup_id_fk from survey as t1 inner join survey_user as t4 on t1.survey_user_id_fk = t4.id where t1.workgroup_id_fk <> -1 and t1.workgroup_id_fk = ${req.body.workgroup_id} and t1.create_date >= '${req.body.from_date} 00:00:00' and t1.create_date <= '${req.body.to_date} 23:59:59' group by user_id;`;
                    }

                }




                var output = [];
                var [list] = await pp.query(cmd);
                var hash = await crypt.encrypt(cmd);
                for (let i = 0; i < list.length; i++) {
                    var approves = parseInt(list[i].total_count) - parseInt(list[i].reject_count);
                    var quality = approves / (parseInt(list[i].total_count) + 1)
                    var m = {
                        name: `${list[i].first_name} ${list[i].last_name}`,
                        quality: quality
                    }
                    output.push(m);
                }
                res.status(200).send(
                    {
                        list: list,
                        hash: hash
                    }
                );
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


    app.post(`${prefix}/rates`, auth.authorized, async (req, res) => {
        try {
            if (req.body.workgroup_id) {
                var final_status = 'ابلاغ به مجری';

                var cmd = `select t1.id as s_id, t1.workgroup_id_fk, (select to_status from survey_log where survey_id_fk = s_id order by id desc limit 1) as status, (select date from survey_log where survey_id_fk = s_id order by id desc limit 1) as date, (select sum(t2.value) from survey_result as t1 left join survey_result_evaluation as t2 on t1.id = t2.result_id_fk where t1.survey_id_fk=s_id) as total_point from survey as t1 where status = '${final_status}' having date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' order by total_point desc;`;

                if (req.body.workgroup_id != 'all') {
                    cmd = `select t1.id as s_id, t1.workgroup_id_fk, (select to_status from survey_log where survey_id_fk = s_id order by id desc limit 1) as status, (select date from survey_log where survey_id_fk = s_id order by id desc limit 1) as date, (select sum(t2.value) from survey_result as t1 left join survey_result_evaluation as t2 on t1.id = t2.result_id_fk where t1.survey_id_fk=s_id) as total_point from survey as t1 where status = '${final_status}' having date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' order by total_point desc;`;
                }

                


                var [list] = await pp.query(cmd);
                var hash = await crypt.encrypt(cmd);
                res.status(200).send({
                    list: list,
                    hash: hash
                });
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

    app.post(`${prefix}/workgroups`, auth.authorized, async (req, res) => {
        try {
            if (req.body.workgroup_id) {
                var wgs = [];
                if (req.body.workgroup_id == 'all') {
                    var [workgroups] = await pp.query('select  t1.workgroup_id_fk as wgid, t2.name from survey as t1 inner join survey_workgroup as t2 on t1.workgroup_id_fk = t2.id group by t1.workgroup_id_fk;');
                    for (let i = 0; i < workgroups.length; i++) {
                        wgs.push({
                            id: workgroups[i].wgid,
                            name: workgroups[i].name
                        })
                    }
                }
                else {
                    wgs.push(req.body.workgroup_id);
                }

                var output = [];

                for (let i = 0; i < wgs.length; i++) {
                    var [survey] = await pp.query('select id as s_id, (select to_status from survey_log where survey_id_fk=s_id order by id desc limit 1) as status,(select date from survey_log where survey_id_fk=s_id order by id desc limit 1) as c_date from survey where workgroup_id_fk=26 having  c_date >= ? and c_date <= ?;', [req.body.from_date, req.body.to_date]);

                    var m = {
                        name: wgs[i].name,
                        count: survey.length
                    }
                    output.push(m);
                }

                res.status(200).send({
                    list: output,
                    json: JSON.stringify(output)
                });
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

    app.post(`${prefix}/status`, auth.authorized, async (req, res) => {
        try {
            if (req.body.workgroup_id) {
                var cmd = '';


                if (req.body.workgroup_id == 'all') {
                    cmd = `select to_status, max(date) as date from survey_log where date >= '${req.body.from_date} 00:00:00' and date <= '${req.body.to_date} 23:59:59' group by to_status`;
                    var [list] = await pp.query(cmd);

                    var hash = await crypt.encrypt(cmd);
                    res.status(200).send({ 
                        list: list,
                        hash: hash
                    });
                }
                else {
                    cmd = `select status , count(id) as count from survey  where last_update_date >= '${req.body.from_date} 00:00:00' and last_update_date<= '${req.body.to_date} 23:59:59' and workgroup_id_fk=? group by status`
                    var [list] = await pp.query(cmd);
                    var hash = await crypt.encrypt(cmd);
                    res.status(200).send({
                        list: list,
                        hash: hash
                    });
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
});
