const auth = require('../../../middlewares/auth');
const moment = require('moment');
const surveyHelper = require('../../../helpers/survey');

module.exports = ((app) => { 
    const prefix = '/api/survey/problem';
    const pp = app.get('pool').promise();


    app.post(`${prefix}`, auth.authorized, async(req, res) => {
        try {
            if(req.body.survey_id && req.body.type && req.body.problem_date && req.body.result && req.body.title && req.body.description && req.body.solution) { 
                await pp.query('insert into survey_problem (survey_id_fk, type, date, result, title, description, solution, personnel_id_fk, problem_date) values (?,?,?,?,?,?,?,?,?)', [
                    req.body.survey_id,
                    req.body.type,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.body.result,
                    req.body.title,
                    req.body.description,
                    req.body.solution,
                    req.user.id,
                    req.body.problem_date
                ]);

                await surveyHelper.notification(27, req.body.survey_id, pp);
                res.status(200).send('done');
            }
            else { 
                res.status(403).send('incomplete request');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try {
            if(req.body.survey_id && req.body.type && req.body.problem_date && req.body.result && req.body.title && req.body.description && req.body.solution) { 
                await pp.query('update survey_problem set survey_id_fk=?, type=?, date=?, result=?, title=?, description=?, solution=?, personnel_id_fk=?, problem_date=? where id=?', [
                    req.body.survey_id,
                    req.body.type,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
                    req.body.result,
                    req.body.title,
                    req.body.description,
                    req.body.solution,
                    req.user.id,
                    req.body.problem_date,
                    req.params.id
                ]);
                res.status(200).send('done');
            }
            else { 
                res.status(403).send('incomplete request');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.delete(`${prefix}`, auth.authorized, async(req, res) => {
        try {
            if(req.body.ids) { 
                var arr = req.body.ids;
                for(let i=0;i<arr.length;i++) { 
                    await pp.query('delete from survey_problem where id=?', [arr[i]]);
                }
                res.status(200).send('done');
            }
            else { 
                res.status(200).send('incomplete request');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try {
            var [item] = await pp.query('select * from survey_problem where id=?', [req.params.id]);
            if(item.length == 1) { 
                res.status(200).send(item[0]);
            }
            else { 
                res.status(403).send('item not found');
            }
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/survey/:id`, auth.authorized, async(req, res) => {
        try {
            var [list] = await pp.query('select * from survey_problem where survey_id_fk=?', [
                req.params.id
            ]);
            res.status(200).send(list);
        } 
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });
});



