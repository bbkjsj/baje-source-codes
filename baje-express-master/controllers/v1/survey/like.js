const moment = require('moment');
const auth = require('../../../middlewares/auth');

module.exports = ((app) => { 
    const prefix = '/api/survey/reaction';
    const pp = app.get('pool').promise();


    app.post(`${prefix}/advdis`, auth.authorized, async(req, res) => {
        try {
            if(req.body.disadv_id && req.body.reaction) { 
                //delete previous
                await pp.query('delete from survey_disadv_reaction where personnel_id_fk = ? and dis_adv_id_fk =?', [req.user.id, req.body.disadv_id]);

                var insert = await pp.query('insert into  survey_disadv_reaction (dis_adv_id_fk, reaction, personnel_id_fk, date) values (?,?,?,?)', [
                    req.body.disadv_id,
                    req.body.reaction,
                    req.user.id,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                ]);

                var [likes] = await pp.query('select count(id) as count from survey_disadv_reaction where dis_adv_id_fk=? and reaction = ?', [req.body.disadv_id, 'like']);
                var [dislikes] = await pp.query('select count(id) as count from survey_disadv_reaction where dis_adv_id_fk=? and reaction = ?', [req.body.disadv_id, 'dislike']);

                

                res.status(200).send({
                    id: insert[0].insertId,
                    likes: likes[0].count,
                    dislikes: dislikes[0].count,
                    liked: req.body.reaction == 'like'?1:0,
                    disliked: req.body.reaction == 'dislike' ? 1 : 0
                });
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


    app.post(`${prefix}/comment`, auth.authorized, async(req, res) => {
        try {
            if(req.body.comment_id && req.body.reaction) { 
                //delete previous
                await pp.query('delete from survey_disadv_comment_reaction where personnel_id_fk=? and survey_advdis_comment_id_fk=?', [req.user.id, req.body.comment_id]);

                var insert = await pp.query('insert into survey_disadv_comment_reaction (personnel_id_fk, survey_advdis_comment_id_fk, reaction,date) values (?,?,?,?)', [
                    req.user.id,
                    req.body.comment_id,
                    req.body.reaction,
                    moment().utc(true).format('YYYY/MM/DD HH:mm:ss')
                ]);

                var [likes] = await pp.query('select count(id) as count from survey_disadv_comment_reaction where survey_advdis_comment_id_fk=? and reaction = ?', [req.body.comment_id, 'like']);
                var [dislikes] = await pp.query('select count(id) as count from survey_disadv_comment_reaction where survey_advdis_comment_id_fk=? and reaction = ?', [req.body.comment_id, 'dislike']);

                res.status(200).send({
                    id: insert[0].insertId,
                    likes: likes[0].count,
                    dislikes: dislikes[0].count,
                    liked: req.body.reaction == 'like'?1:0,
                    disliked: req.body.reaction == 'dislike' ? 1 : 0
                });
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
});