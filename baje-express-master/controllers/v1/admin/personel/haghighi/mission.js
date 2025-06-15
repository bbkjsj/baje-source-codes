
const auth = require('../../../../../middlewares/auth');
const moment = require('moment');
const multer = require('multer');


module.exports = ((app) => { 
    const pp = app.get('pool').promise();
    const prefix = '/api/admin/personnel/mission';


    

    app.post(`${prefix}`, auth.authorized, async(req, res) => { 
        try{
            if(req.body.personnel_id && req.body.type && req.body.location && req.body.subject)  {
                await pp.query('insert into personnel_mission (personnel_id_fk, type, location, subject, from_date, to_date, residency, vehicle, description, status)  values (?,?,?,?,?,?,?,?,?,?)', [
                    req.body.personnel_id,
                    req.body.type,
                    req.body.location,
                    req.body.subject,
                    req.body.from_date,
                    req.body.to_date,
                    req.body.residency,
                    req.body.vehicle,
                    req.body.description,
                    req.body.status
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
    })

    app.put(`${prefix}/:id`, auth.authorized, async(req, res) => { 
        try{
            if(req.body.personnel_id && req.body.type && req.body.location && req.body.subject)  {
                await pp.query('update personnel_mission set personnel_id_fk=?, type=?, location=?, subject=?, from_date=?, to_date=?, residency=?, vehicle=?, description=? where id=?', [
                    req.body.personnel_id,
                    req.body.type,
                    req.body.location,
                    req.body.subject,
                    req.body.from_date,
                    req.body.to_date,
                    req.body.residency,
                    req.body.vehicle,
                    req.body.description,
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
    })

    app.put(`${prefix}/status/:id`, auth.authorized, async(req, res) => { 
        try{
            if(req.body.status)  {
                await pp.query('update personnel_mission set status = ? where id=?', [
                    req.body.status,
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
    })

    app.delete(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            if(req.body.ids) {
                var arr = req.body.ids;
                for(let i=0;i<arr.length; i++) { 
                    await pp.query('delete from personnel_mission where id=?', [arr[i]]);
                }
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
    })

    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try{
             var [item] = await pp.query('select t1.*, t2.first_name, t2.last_name, t2.national_number from personnel_mission as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id=?', [req.params.id]);
             if(item.length == 1) { 
                 res.status(200).send(item[0]);
             }
             else { 
                 res.status(403).send('item not found');
             }
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured')
        }
    })

    app.get(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            var [list] = await pp.query('select t1.*, t2.first_name, t2.last_name, t2.national_number from personnel_mission as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.personnel_id_fk=?', [req.user.id]);
            res.status(200).send(list);
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured')
        }
    })
})