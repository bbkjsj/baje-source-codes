const auth = require('../../../middlewares/auth');

module.exports = ((app) => { 
    const prefix = '/api/survey/manager'; //مدیر عامل
    const pp = app.get('pool').promise();

    app.get(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            var [manager] = await pp.query('select * from survey_setting');
            if(manager.length == 1) { 
                
                if(manager[0].manager_id_fk == req.user.id) { 
                    var [top_workgroup] = await pp.query('select * from survey_workgroup_personnel where workgroup_id_fk=12');

                    var [approves] = await pp.query('select count(approve) as count from survey_excellent_group_result group by survey_id_fk having count >=', [
                        parseInt(top_workgroup.length) + 1
                    ]);
        
                    var ids = [];
                    for(let i=0; i<approves.length; i++) { 
                        ids.push(approves[i]);
                    }
        
        
                    var [list] = await pp.query("select t1.title, t1.suggestion, t2.first_name, t2.last_name, t2.national_code, CONCAT(t3.first_name,' ', t3.last_name) as execution_name, t4.name as execution_company,  t1.suggest_reward, t1.due_day from survey_top_workgroup as t1 inner join survey_user as t2 on t1.survey_user_id_fk = t2.id left join personnel as t3 on t2.personnel_id_fk = t3.id left join company as t4 on t2.company_id_fk=t4.id where t1.survey_id_fk in (?)", [ids.toString()]);
        
                    res.status(200).send(list);
                }
                else { 
                    res.status(403).send('you are not manager');
                }
            }
            else { 
                res.status(403).send('you are not allowed to view this list');
            }
            
        }
        catch(err){
            res.status(403).send('error occured');
        }
    })

    
    
});