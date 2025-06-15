const auth = require('../../../../../middlewares/auth');
const crypt = require('../../../../../helpers/crypt');

module.exports = ((app) => {
    const prefix = '/api/admin/doctor'; 
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            //check duplicate
            var [duplicate] = await pp.query('select id from personnel where national_number = ? or mobile1= ?', [req.body.national_number, req.body.mobile]);
            if(duplicate.length > 0) { 
                res.status(403).send('این کاربر قبلا در سامانه ثبت نام شده است');
            }
            else { 
                //insert new doctor
                var _password = crypt.encrypt(req.body.password);
                await pp.query('insert into personnel (national_number, mobile1, password, first_name, last_name, user_type) values (?,?,?,?,?,?)', [
                    req.body.national_number,
                    req.body.mobile,
                    _password,
                    req.body.first_name,
                    req.body.last_name,
                    'doctor'
                ]);
                res.status(200).send('doctor created');
            }
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    });


    app.get(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            var [list] = await pp.query('select id, first_name, last_name, national_number, mobile1 as mobile from personnel where user_type = ? order by id', ['doctor']);
            res.status(200).send(list);
        }
        catch(err) { 
            res.status(403).send('error occured');
        }
    });

    
    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try{
            var [user] = await pp.query('select id, first_name, last_name, national_number, mobile1 as mobile from personnel where id = ? and user_type = ?', [req.params.id, 'doctor']);
            if(user.length == 1) { 
                res.status(200).send(user[0]);
            }
            else { 
                res.status(403).send('دکتر در سامانه وارد نشده است');
            }
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    });



    app.put(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            if(req.body.id && req.body.first_name && req.body.last_name && req.body.national_number) {
                var _password = '';

                if(req.body.password) { 
                    _password = crypt.encrypt(req.body.password);
                }

                if(_password != '') { 
                    await pp.query('update personnel set first_name = ?, last_name=?, national_number=?, mobile1=? , password = ? where id=?',[
                        req.body.first_name,
                        req.body.last_name,
                        req.body.national_number,
                        req.body.mobile,
                        _password,
                        req.body.id
                    ])
                    res.status(200).send('done');
                }
                else { 
                    await pp.query('update personnel set first_name = ?, last_name=?, national_number=?, mobile1=?  where id=?',[
                        req.body.first_name,
                        req.body.last_name,
                        req.body.national_number,
                        req.body.mobile,
                        req.body.id
                    ]);
                    res.status(200).send('done');
                }
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
        if(req.body.id) { 
            try{
                await pp.query('delete from personnel where id = ?', [req.body.id]);
                res.status(200).send('done');
            }
            catch(err) { 
                console.log(err);
                res.status(403).send('error occured');
            }
        }
        else { 
            res.status(403).send('incomplete request');
        }
    })
})