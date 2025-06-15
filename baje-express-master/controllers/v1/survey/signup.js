const token = require('../../../helpers/token');
const crypt = require('../../../helpers/crypt');
const randomNumber = require('../../../helpers/randomnumber');
const sms = require('../../../services/sms');
const auth = require('../../../middlewares/auth');
const moment = require('moment');

module.exports = ((app) => {
    const prefix = '/api/survey/signup';
    const pp = app.get('pool').promise();


    app.post(`${prefix}`, async(req, res) => {
        try{
            if(req.body.national_code) { 
                var [personnel] = await pp.query('select * from personnel where national_number = ? and (not(mobile1 is null) or mobile1<>?)', [
                    req.body.national_code,
                    ''
                ]);
                var [user] = await pp.query('select * from survey_user where national_code = ?', [ 
                    req.body.national_code
                ]);


                if(personnel.length > 0 && user.length == 0) { 
                    //register personnel into new survey_user
                    var code = await randomNumber.generate(100000, 999999);
                    var hash = await crypt.encrypt(code.toString());
                    var [userId] = await pp.query('insert into survey_user (first_name, last_name, national_code, id_number, father_name, gender, mobile, code) values (?,?,?,?,?,?,?,?)', [
                        personnel[0].first_name,
                        personnel[0].last_name,
                        personnel[0].national_number,
                        personnel[0].id_number,
                        personnel[0].father_name,
                        personnel[0].sex,
                        personnel[0].mobile1,
                        hash
                    ]);

                    //send sms
                    sms.sendSMS(code, personnel[0].mobile1);

                    res.status(200).send({
                        exist: true,
                        mobile: personnel[0].mobile1
                    })
                }
                else if(user.length > 0) { //update code and send code to mobile
                    var code = await randomNumber.generate(10000, 999999);
                    var hash = await crypt.encrypt(code.toString());
                    await pp.query('update survey_user set code = ? where id=?', [
                        hash,
                        user[0].id
                    ]);
                    sms.sendSMS(code.toString(), user[0].mobile);
                    res.status(200).send({
                        exist: true,
                        mobile: user[0].mobile
                    });
                }
                else { 
                    res.status(200).send({
                        exist: false,
                        national_code: req.body.national_code
                    });
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


    app.post(`${prefix}/new`, async(req, res) => {
        try{
            if(req.body.first_name && req.body.last_name && req.body.father_name && req.body.national_code && req.body.id_number && req.body.gender && req.body.mobile) { 
                //duplicate
                var [duplicate] = await pp.query('select * from survey_user where national_code = ? or mobile=?', [
                    req.body.national_code,
                    req.body.mobile
                ]);
                if(duplicate.length > 0) { 
                    res.status(403).send('duplicate user');
                }
                else { 
                    var rn = await randomNumber.generate(100000, 999999);
                    var hash = crypt.encrypt(rn.toString());
                    await pp.query('insert into survey_user (first_name, last_name, national_code, id_number, father_name, gender, mobile, code, birth_date) values (?,?,?,?,?,?,?,?,?)', [
                        req.body.first_name,
                        req.body.last_name,
                        req.body.national_code,
                        req.body.id_number,
                        req.body.father_name,
                        req.body.gender,
                        req.body.mobile,
                        hash,
                        req.body.birth_date != null ? req.body.birth_date : null
                    ]);

                    //send sms to user
                    sms.sendSMS(rn.toString(), req.body.mobile);

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

    app.post(`${prefix}/verify`, async(req, res) => {
        try{
            if(req.body.mobile && req.body.code) { 
                var hash = crypt.encrypt(req.body.code);
                var [user] = await pp.query('select * from survey_user where mobile=? and code=?', [
                    req.body.mobile,
                    hash
                ]);

                if(user.length == 1) { 
                    var usermodel = { 
                        id: user[0].id,
                        fullname: `${user[0].first_name} ${user[0].last_name}`,
                        national_code: user[0].national_code,
                        mobile: user[0].mobile,
                        type: 'survey_user'
                    }
                    var _token = await token.survey(usermodel);
                    res.status(200).send({
                        token: _token,
                        fullname: `${user[0].first_name} ${user[0].last_name}`,
                        national_code: user[0].national_code,
                        mobile: user[0].mobile,
                    });
                }
                else { 
                    res.status(403).send('incorrect mobile/code');
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

    app.get(`${prefix}`, auth.survey_authorized, (req, res) => {

        res.status(200).send(req.user);
    })

    
})


