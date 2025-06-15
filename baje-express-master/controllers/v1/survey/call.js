
const moment = require('moment');
const auth = require('../../../middlewares/auth');


module.exports = ((app) => { 
    const prefix = '/api/survey/call';
    const pp = app.get('pool').promise();


    app.get(`${prefix}/items/:id`, auth.authorized, async(req, res) => { 
        try{
            var [list] = await pp.query('select t1.id as sid, t1.title, t1.category_title, t1.code from survey as t1 inner join survey_workgroup_call as t2 on t1.survey_workgroup_call_id_fk=t2.id where t2.id = ?', [req.params.id]);

            var output = [];

            for(let i=0; i<list.length; i++) { 
                var m = { 
                    sid: list[i].sid,
                    title: list[i].title,
                    code: list[i].code,
                    point: 0,
                    rank: -1,
                    status: ''
                }
                await pp.query('call s_point(?)', [list[i].sid]);
                var [rank] = await pp.query('call s_rank(?)', [list[i].sid]);
                var [point_table] = await pp.query('select * from s_point_result');

                m.point = point_table[0].total_point;
                m.status = point_table[0].last_status;
                if(rank[0].length == 1) { 
                    m.rank = rank[0][0].Ranks;
                }
                output.push(m);
            }

            res.status(200).send(output);
        }
        catch(err){
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/statistics/:id`, auth.authorized, async(req, res) => { 
        try{
            var [list] = await pp.query('select count(id) as count, status from survey where survey_workgroup_call_id_fk= ? group by status;', [req.params.id]);

            res.status(200).send(list);
        }
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    
})