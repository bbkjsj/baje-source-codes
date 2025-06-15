const auth = require('../../../../../middlewares/auth');
const moment = require('moment');
const multer = require('multer');
const path = require('path');

module.exports = ((app) => {
    const pp = app.get('pool').promise();
    const prefix = '/api/admin/personnel/timeoff';


    var timeoffStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './_uploads/timeoff');
        },
        filename: function (req, file, cb) {
            var fn = moment().utc(true).format('YYMMDDHHmmss');
            fn = `${fn}_survey${path.extname(file.originalname)}`;
            cb(null, fn)
        }
    })

    var timeoffMulter = multer({ storage: timeoffStorage })

    app.post(`${prefix}`, auth.authorized, timeoffMulter.single('file'), async (req, res) => {
        try {
            let allowToSubmitTimeOff = false;
            const arr = req.user.access;
            arr.forEach(item => { 
                if(item.access == 'person/submit-timeoff-forothers') { 
                    allowToSubmitTimeOff = true;
                }
            })
            if(req.user.id == req.body.personnel_id || req.user.super || allowToSubmitTimeOff) { 
                if (req.body.type && req.body.request_type && req.body.from_date && req.body.to_date && req.body.personnel_id) {

                    if(req.body.request_type == 'روزانه') { 
                        const fd = moment(req.body.from_date).utc(true).format('YYYY/MM/DD 00:00:00');
                        const td = moment(req.body.to_date).add(1, 'days').utc(true).format('YYYY/MM/DD 00:00:00');
    
                        await pp.query('insert into personnel_timeoff (type, request_type, from_date, to_date, description, status, personnel_id_fk, file_url) values (?,?,?,?,?,?,?,?)', [
                            req.body.type,
                            req.body.request_type,
                            fd,
                            td,
                            req.body.description,
                            req.body.status,
                            req.body.personnel_id,
                            req.file != null ? `/api/file/${req.file.filename}` : null
                        ]);
                        res.status(200).send('done');
                    }
                    else if(req.body.request_type == 'ساعتی') { 
                        await pp.query('insert into personnel_timeoff (type, request_type, from_date, to_date, description, status, personnel_id_fk, file_url) values (?,?,?,?,?,?,?,?)', [
                            req.body.type,
                            req.body.request_type,
                            req.body.from_date,
                            req.body.to_date,
                            req.body.description,
                            req.body.status,
                            req.body.personnel_id,
                            req.file != null ? `/api/file/${req.file.filename}` : null
                        ]);
                        res.status(200).send('done');
                    }
                    else { 
                        res.status(403).send('unknown request_type');
                    }
                    
                }
                else {
                    res.status(403).send('incomplete request');
                }
            }
            else {
                res.status(400).send('permission required');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.put(`${prefix}/:id`, auth.authorized, timeoffMulter.single('file'), async (req, res) => {
        try {
            var [timeoff] = await pp.query('select * from personnel_timeoff where id=?', [req.params.id]);
            
            if (req.body.type && req.body.request_type && req.body.from_date && req.body.to_date && req.body.personnel_id) {

                if(timeoff[0].personnel_id_fk == req.user.id || req.user.super) { 
                    if (req.file != null) {
                        await pp.query('update personnel_timeoff set type=?, request_type=?, from_date=?, to_date=?, description=?, status=?, personnel_id_fk=?, file_url=? where id=?', [
                            req.body.type,
                            req.body.request_type,
                            req.body.from_date,
                            req.body.to_date,
                            req.body.description,
                            req.body.status,
                            req.body.personnel_id,
                            `/api/file/${req.file.filename}`,
                            req.params.id
                        ]);
                    }
                    else {
                        await pp.query('update personnel_timeoff set type=?, request_type=?, from_date=?, to_date=?, description=?, status=?, personnel_id_fk=? where id=?', [
                            req.body.type,
                            req.body.request_type,
                            req.body.from_date,
                            req.body.to_date,
                            req.body.description,
                            req.body.status,
                            req.body.personnel_id,
                            req.params.id
                        ]);
                    }
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.put(`${prefix}/status/:id`, auth.authorized, async (req, res) => {
        try {
            if (req.body.status) {
                let allowToPermit = false;
                const arr = req.user.access;
                
                arr.forEach(item => {
                    if(item.access == 'person/submit-timeoff-forothers' || item.access == 'person/approve-timeoff') { 
                        allowToPermit=true;
                    }
                });
                if(req.user.super) { allowToPermit = true };

                if(allowToPermit) {
                    const [timeOff] = await pp.query('select id from personnel_timeoff where id=? and personnel_id_fk=?',[
                        req.params.id,
                        req.user.id
                    ]);
                    if(timeOff.length > 0) {
                        return res.status(400).send('شما نمیتوانید مرخصی خودتان رو تایید کنید')
                    }
                    else { 
                        await pp.query('update personnel_timeoff set status = ?, operator_id_fk=? where id=?', [
                            req.body.status,
                            req.user.id,
                            req.params.id
                        ]);
                    }
                    
                }
                
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.delete(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            if (req.body.ids) {
                var arr = req.body.ids;

                for (let i = 0; i < arr.length; i++) {
                    if(req.user.super) { 
                        await pp.query('delete from personnel_timeoff where id=? and status is null', [
                            arr[i]
                        ]);
                    }
                    else { 
                        await pp.query('delete from personnel_timeoff where id=? and personnel_id_fk=? and status is null', [
                            arr[i],
                            req.user.id
                        ]);
                    }
                    
                }
                res.status(200).send('done');
            }
            else {
                res.status(403).send('incomplete request');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            var [item] = await pp.query('select t1.*,TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date))  as seconds, t2.first_name, t2.last_name, t2.national_number from personnel_timeoff as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.id=? and t2.id', [req.params.id, req.user.id]);

            //to save
            if (item.length == 1) {
                res.status(200).send(item[0]);
            }
            else {
                res.status(403).send('item not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured')
        }
    })

    app.get(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            const arr = req.user.access;
            let allowToView = false;

            arr.forEach(item => { 
                if(item.access == 'person/approve-timeoff') { 
                    allowToView = true;
                }
            })
            if (req.user.super || allowToView) {
                var [list] = await pp.query('select t1.*, TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date)) as seconds,  t2.first_name, t2.last_name, t2.national_number from personnel_timeoff as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id order by t1.status asc');
                res.status(200).send(list);
            }
            else {
                var [list] = await pp.query('select t1.*, TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date)) as seconds,  t2.first_name, t2.last_name, t2.national_number from personnel_timeoff as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.personnel_id_fk=? order by t1.status asc', [req.user.id]);
                res.status(200).send(list);
            }

        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured')
        }
    })
})