const moment = require('moment');
const auth = require('../../../middlewares/auth');


module.exports = ((app) => {
    const prefix = '/api/survey/leaderboard';
    const pp = app.get('pool').promise();

    app.get(`${prefix}/lb/:id`, auth.survey_authorized, async(req, res) => { 
        try{
            var [list] = await pp.query("select t3.name, t3.rate_type, t3.weight_factor, t3.max_point, sum(t1.value) as sum_value, count(t1.id) as number_of_votes from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey_workgroup_evaluation as t3 on t1.evaluation_id_fk=t3.id where t2.survey_id_fk=? group by t3.name;", [req.params.id]);
            
            res.status(200).send(list);
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try{
            var [list] = await pp.query("select t3.name, t3.rate_type, t3.weight_factor, t3.max_point, sum(t1.value) as sum_value, count(t1.id) as number_of_votes from survey_result_evaluation as t1 inner join survey_result as t2 on t1.result_id_fk = t2.id inner join survey_workgroup_evaluation as t3 on t1.evaluation_id_fk=t3.id where t2.survey_id_fk=? group by t3.name;", [req.params.id]);
            
            res.status(200).send(list);
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    
    
})