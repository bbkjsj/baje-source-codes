
module.exports = ((app) => { 
    const prefix = '/api/search';
    const pp = app.get('pool').promise();

    app.post(`${prefix}/personnel`, async(req, res) => { 
        if(req.body.codeMelli) { 
            const [personnel] = await pp.query('select * from personnel where national_number = ?', [
                req.body.codeMelli
            ]);

            
            if(personnel.length == 1) { 
                const [taminList] = await pp.query('select t1.* from insurance_tamin as t1 inner join insurance_tamin_personnel as t2 on t1.id = t2.insurance_tamin_id_fk where t2.personnel_id_fk=?', [
                    personnel[0].id
                ]);


                res.status(200).send({
                    personnel: personnel[0],
                    tamin: taminList
                });
            }
            else { 
                res.status(403).send('unknown national number');
            }

        }
        else {
            res.status(403).send('incomplete request');
        }
    });
})