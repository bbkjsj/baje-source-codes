const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const fs = require('fs');
const token = require('../../helpers/token');


module.exports = {
    authorized: async function(req, res, next) {

        var auth =  await authenticated(req, res);

        if(auth == true) {
            next();
        }
        else {
            res.status(401).send('authentication required');
        }
    },
    isInRoles: function(arrayOfRoles) {
        return async (req, res, next) => {
            if(await authenticated(req, res)) {
                var user = req.user;

                if(user.super == 1) {
                    next();
                }
                else {
                    var access = await userAccess(user.id, req);

                    console.table(access);
                    var duplicate = access.filter((val) => {
                        return arrayOfRoles.indexOf(val.access) != -1;
                    });



                    if(duplicate.length > 0) {
                        next();
                    }
                    else {
                        res.status(303).send('سطح دسترسی شما به این قسمت محدود میباشد. لطفا با مدیر سامانه هماهنگ فرمایید');
                    }
                }
            }
            else {
                res.status(403).send('authorization required');
            }
        };
    },

    survey_authorized: async function(req, res, next) {
        try{

            if(req.headers.authorization) {
                var model = await token.survey_verify(req.headers.authorization);
                req.user = model.UserModel;
                next();
            }
            else {
                res.status(401).send('authorization required');
            }
        }
        catch(err) {
            console.log(err);
            res.status(401).send('authorization failed');
        }

    }
}

var authenticated = ((req, res) =>{
    return new Promise(async(resolve, reject) => {
        if (req.headers.authorization) {
            var cert = fs.readFileSync('./public.pem');
            jwt.verify(req.headers.authorization, cert, {
                algorithms: ['RS256']
                    }, async (err, data) => {
                if(err){
                    resolve(false);
                }
                else {

                    req.user = data;
                    if (req.user.access == null) {
                        //get access from database
                        const pp = req.app.get('pool').promise();

                        var [access] = await pp.query('select access from personnel_access where personnel_id_fk = ?', [data.id]);

                        req.user.access = access;
                    }

                    resolve(true);
                }
            });
        }
        else {
            resolve(false);
        }
    });
})

var userAccess = ((userId, req) => {
    return new Promise(async (resolve , reject) => {
        const pool = req.app.get('pool');
        const pp = pool.promise();
        var [access] = await pp.query('select t1.* from personnel_access as t1  where t1.personnel_id_fk = ?', [userId]);
        resolve(access);
    })
})