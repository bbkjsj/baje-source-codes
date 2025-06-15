const auth = require('../../../../middlewares/auth');

module.exports = ((app) => {
    const prefix = '/api/admin/hr/variables/annual';
    const pp = app.get('pool').promise();

    app.post(`${prefix}`, auth.authorized, async(req, res) => { 
        try{
            if(req.body.year && req.body.min_salary && req.body.max_salary && req.body.bonus && req.body.housing) {
                var [dup] = await pp.query('select * from hr_yearly_variable where year = ?', [req.body.year]);
                if(dup.length >0) { 
                    res.status(403).send(`duplicate item in ${req.body.year}`);
                }
                else { 
                    await pp.query('insert into hr_yearly_variable (year, min_daily_salary, max_daily_salary, bonus, housing, description) values (?,?,?,?,?,?)',[
                        req.body.year,
                        req.body.min_salary,
                        req.body.max_salary,
                        req.body.bonus,
                        req.body.housing,
                        req.body.description
                    ]);
                    res.status(200).send('done');
                }
            }
            else { 
                res.status(403).send('incomplete request');
            }
        }
        catch(err){
            console.log(err);
            res.status(403).send('error occured');
        }
    });

    app.put(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try{
            if(req.body.min_salary && req.body.max_salary && req.body.bonus && req.body.housing) {
                await pp.query('update hr_yearly_variable set min_daily_salary=?, max_daily_salary=?, bonus=?, housing=?, description=? where id=?',[
                    req.body.min_salary,
                    req.body.max_salary,
                    req.body.bonus,
                    req.body.housing,
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
    });

    app.delete(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            if(req.body.ids) { 
                var arr = req.body.ids;
                for(let i=0;i<arr.length;i++) { 
                    await pp.query('delete from hr_yearly_variable where id=?', [arr[i]]);
                }
                res.status(200).send('done');
            }
            else { 
                res.status(403).send('incomplete request');
            }
        }
        catch(err){
            res.status(403).send('error occured');
        }
    })

    app.get(`${prefix}/:id`, auth.authorized, async(req, res) => {
        try{
            var [item] = await pp.query('select * from hr_yearly_variable where id=?', [req.params.id]);
            res.status(200).send(item[0]);
        }
        catch(err) {
            res.status(403).send('error occured');
        }
    });

    app.get(`${prefix}`, auth.authorized, async(req, res) => {
        try{
            var [list] = await pp.query('select * from hr_yearly_variable order by year desc');
            res.status(200).send(list);
        }
        catch(err) { 
            res.status(403).send('error occured');
        }
    })
    
})