const auth = require('../../../../../middlewares/auth');

module.exports = ((app) => { 
    const prefix = '/api/admin/settle'; 
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            if(req.body.personnel_id && req.body.reason) { 
                var settle = await pp.query('insert into settle (personnel_id_fk, reason, date, description, approved, register_user_id_fk) values (?,?,?,?,?,?)',[
                    req.body.personnel_id,
                    req.body.reason.toString(),
                    req.body.date,
                    req.body.description,
                    0,
                    req.user.id
                ]);

                
                //insert status
                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'انبار',
                    null
                ])
                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'حسابداری',
                    null
                ])
                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'بیمه',
                    null
                ])

                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'اداری پروژه',
                    null
                ])

                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'مدیر پروژه',
                    null
                ])
                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'مدیر منابع انسانی',
                    null
                ])
                await pp.query('insert into settle_status (settle_id_fk, unit, result) values (?,?,?)', [
                    settle[0].insertId,
                    'مدیر عامل',
                    null
                ])

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
        try{
            if(req.body.personnel_id && req.body.reason) { 
                await pp.query('update settle set personnel_id_fk=?, reason=?, date=?, description=?, approved=?, register_user_id_fk=? where id=?',[
                    req.body.personnel_id,
                    req.body.reason.toString(),
                    req.body.date,
                    req.body.description,
                    0,
                    req.user.id,
                    req.params.id
                ]);
            }
            else{ 
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
            await pp.query('update settle set status=? where id=?', [
                req.body.status,
                req.params.id
            ]);
            res.status(200).send('done');
        }
        catch(err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            var [list] = await pp.query('select t1.id, t1.status, t2.first_name, t2.last_name, t2.national_number, t1.date, t1.reason, CONCAT(t3.first_name, " ", t3.last_name) as register_user,  t1.description from settle as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id inner join personnel as t3 on t1.register_user_id_fk = t3.id');

            var output = [];
            for(let i=0;i<list.length;i++){ 
                var [status] = await pp.query('select result from settle_status where settle_id_fk = ? and not(result is null) order by id limit 1',[list[i].id]);
                
                var m = { 
                    id: list[i].id,
                    first_name: list[i].first_name,
                    last_name: list[i].last_name,
                    national_number: list[i].national_number,
                    date: list[i].date,
                    reason: list[i].reason,
                    register_user: list[i].register_user,
                    description: list[i].description,
                    result: status.lenght == 1 ? status[i].result : '',
                    status: list[i].status
                }
                output.push(m);
            }
            res.status(200).send(output);
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => { 
        try{
            var [item] = await pp.query('select t1.*, t2.first_name, t2.last_name, t2.national_number from settle as t1 inner join personnel as t2 on t1.personnel_id_fk=t2.id where t1.id=?', [req.params.id]);
            if(item.length == 1) {
                res.status(200).send(item[0])
            }
            else {
                res.status(403).send('settle not found');
            }
        }
        catch(err) {
            console.log(err);
            res.status(403).send('error')
        }
    })

    app.get(`${prefix}/status/:id`, auth.authorized, async (req, res) => { 
        try{
            var [list] = await pp.query('select * from settle_status where settle_id_fk = ? order by id', [req.params.id]);
            res.status(200).send(list);
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.delete(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            if(req.body.ids) { 
                var arr = req.body.ids;
                for(let i=0;i<arr.length;i++) { 
                    await pp.query('delete from settle where id=?', [arr[i]]);
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

});

