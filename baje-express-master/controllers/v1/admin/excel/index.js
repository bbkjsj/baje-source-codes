const auth = require('../../../../middlewares/auth');
const json2xls = require('json2xls');
const crypt = require('../../../../helpers/crypt');

module.exports = ((app) => {
    const pp = app.get('pool').promise();
    app.get('/api/excel/create/:hash', async (req, res) => {
        try {
            var hash = req.params.hash.toString().replace(/__/g, '/');
            var cmd = crypt.decrypt(hash);
            var [list] = await pp.query(cmd);
            const xls = json2xls(list);
            res.xls('excel.xls', list);
        }
        catch (err) {
            console.log(err);
            res.status(403).send(err.toString())
        }
    })

    app.post('/api/excel/create', async (req, res) => {
        if (req.body.hash) {
            try {
                var hash = req.body.hash.toString().replace(/__/g, '/');
                var cmd = crypt.decrypt(hash);
                var [list] = await pp.query(cmd);
                const xls = json2xls(list);
                res.xls('excel.xls', list);
            }
            catch (err) {
                console.log(err);
                res.status(403).send('error occured')
            }
        }
        else if(req.body.json) { 
            try{
                var object = JSON.parse(req.body.json);
                res.xls('excel.xlsx', object);
            }
            catch(err){
                console.log(err);
                res.status(403).send('error occured');
            }
        }
        else {
            res.status(403).send('incomplete request');
        }
    })
})