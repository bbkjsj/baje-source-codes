const auth = require('../../../../middlewares/auth');

module.exports = ((app) => {
    const prefix = '/api/admin/incident';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async (req, res) => {
        try {


            if (req.body.type && req.body.date && (req.body.project_id || req.body.address)) {

                var [incident] = await pp.query('insert into incident (type, date, contract_id_fk, address, reason, description, medicine, approved, accident_reason, reason_other) values (?,?,?,?,?,?,?,?,?,?)', [
                    req.body.type.toString(),
                    req.body.date,
                    req.body.project_id,
                    req.body.address != null ? req.body.address : null,
                    req.body.reason.toString(),
                    req.body.description,
                    req.body.medicine,
                    0,
                    req.body.accident_reason != null ? req.body.accident_reason.toString() : null,
                    req.body.reason_other
                ]);

                const incidentId = incident.insertId;

                if (req.body.vehicles) {
                    var varr = req.body.vehicles;
                    for (let i = 0; i < varr.length; i++) {
                        await pp.query('insert into incident_vehicle (vehicle_id_fk, incident_id_fk, damage) values (?,?,?)', [
                            varr[i].id,
                            incidentId,
                            varr[i].damage
                        ])
                    }
                }


                if (req.body.personnel) {
                    var persons = req.body.personnel;
                    for (let i = 0; i < persons.length; i++) {
                        await pp.query('insert into incident_personnel (personnel_id_fk, injury, injury_type, relation, incident_id_fk, injury_other, injury_type_other) values (?,?,?,?,?,?,?)', [
                            persons[i].id,
                            persons[i].injury.toString(),
                            persons[i].injury_type.toString(),
                            persons[i].relation,
                            incidentId,
                            persons[i].injury_other,
                            persons[i].injury_type_other
                        ])
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

    });


    app.get(`${prefix}/:id`, auth.authorized, async (req, res) => {
        try {
            var [incident] = await pp.query('select t1.reason_other, t1.accident_reason, t1.contract_id_fk as project_id, t1.approved, t1.id, t1.type, t1.address, t2.subject as project_name, t1.date, t1.reason, t1.description, t1.medicine from incident as t1 left join contract as t2 on t1.contract_id_fk = t2.id where t1.id = ?', [req.params.id]);

            if (incident.length == 1) {
                //get personnels
                var [persons] = await pp.query('select t2.id, t1.injury_type_other,  t1.injury_other, t2.first_name, t2.last_name, t2.national_number, t1.relation, t1.injury, t1.injury_type from incident_personnel as t1 inner join personnel as t2 on t1.personnel_id_fk = t2.id where t1.incident_id_fk = ?', [incident[0].id]);


                //vehicles
                var [vehicles] = await pp.query('select t2.id, t1.damage, t2.organization_code, t3.title as type, t4.title as system, t5.title as style from incident_vehicle as t1 inner join vehicle as t2 on t1.vehicle_id_fk = t2.id left join vehicle_type as t3 on t2.type_id_fk = t3.id left join vehicle_system as t4 on t2.system_id_fk = t4.id left join vehicle_style as t5 on t2.style_id_fk = t5.id where t1.incident_id_fk = ?', [
                    req.params.id
                ]);


                res.status(200).send({
                    incident: incident[0],
                    persons: persons,
                    vehicles: vehicles
                })
            }
            else {
                res.status(403).send('حادثه در سامانه پیدا نشد');
            }
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}`, auth.authorized, async (req, res) => {
        try {
            var [list] = await pp.query('select t1.approved, t1.id, t1.type, t1.address, t2.subject as location, t1.date, t1.reason from incident as t1 left join contract as t2 on t1.contract_id_fk = t2.id order by id');

            res.status(200).send(list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send('error occured')
        }
    });


    app.put(`${prefix}`, auth.authorized, async (req, res) => {
        try {


            if (req.body.id && req.body.type && req.body.date && (req.body.project_id || req.body.address)) {
                await pp.query('update incident set type = ?, date=?, contract_id_fk=?, address=?, reason=?, description=?, medicine=?, approved = ?, reason_other=?, accident_reason=? where id=?', [
                    req.body.type != null ? req.body.type.toString() : null,
                    req.body.date,
                    req.body.project_id != null ? req.body.project_id : null,
                    req.body.address,
                    req.body.reason != null ? req.body.reason.toString() : null,
                    req.body.description,
                    req.body.medicine,
                    0,
                    req.body.reason_other != null ? req.body.reason_other.toString() : null,
                    req.body.accident_reason != null ? req.body.accident_reason.toString() : null,
                    req.body.id
                ]);

                const incidentId = req.body.id;

                if (req.body.vehicles) {
                    //delete previous vehicles of incident
                    await pp.query('delete from incident_vehicle where incident_id_fk = ?', [incidentId]);

                    var varr = req.body.vehicles;
                    for (let i = 0; i < varr.length; i++) {
                        await pp.query('insert into incident_vehicle (vehicle_id_fk, damage, incident_id_fk) values (?,?,?)', [
                            varr[i].id,
                            varr[i].damage,
                            incidentId
                        ])
                    }
                }


                if (req.body.personnel) {
                    //delete previous personnel
                    await pp.query('delete from incident_personnel where incident_id_fk =?', [incidentId]);
                    var persons = req.body.personnel;
                    for (let i = 0; i < persons.length; i++) {
                        await pp.query('insert into incident_personnel (personnel_id_fk, injury, injury_type, relation, incident_id_fk) values (?,?,?,?,?)', [
                            persons[i].id,
                            persons[i].injury.toString(),
                            persons[i].injury_type.toString(),
                            persons[i].relation,
                            incidentId
                        ])
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
            if (req.body.id) {
                var arr = req.body.id;
                for (let i = 0; i < arr.length; i++) {
                    await pp.query('delete from incident where id = ?', [arr[i]]);
                    await pp.query('delete from incident_vehicle where incident_id_fk=?', [arr[i]]);
                    await pp.query('delete from incident_personnel where incident_id_fk=?', [arr[i]]);
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
})