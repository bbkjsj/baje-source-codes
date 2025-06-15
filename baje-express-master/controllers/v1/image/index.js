const fs = require('fs');
const auth = require('../../../middlewares/auth');
const path = require('path');

module.exports = ((app) => { 
    app.get('/api/image/:type/:filename',  (req, res) => { 
        try{
            const rootPath = process.cwd();
            let fileName = null;

            if(req.params.type == 'personnel') { 
                fileName = `${rootPath}/_uploads/personnel/${req.params.filename}`;

                fs.readFile(fileName, (_err, data) => {
                    if(_err) { 
                        res.status(403).send('خطا رخ داده است');
                    }
                    else { 
                        res.sendFile(fileName);
                    }
                });
            }
            else if(req.params.type == 'company') { 
                fileName = `${rootPath}/_uploads/company/${req.params.filename}`;
                fs.readFile(fileName, (_err, data) => {
                    if(_err) { 
                        res.status(403).send('خطا رخ داده است');
                    }
                    else { 
                        res.sendFile(fileName);
                    }
                });
            }
            else if(req.params.type == 'vehicle') { 
                fileName = `${rootPath}/_uploads/vehicle/img/${req.params.filename}`;
                fs.readFile(fileName, (_err, data) => {
                    if(_err) { 
                        
                        res.status(403).send('خطا رخ داده است');
                    }
                    else { 
                        res.sendFile(fileName);
                    }
                })
            }
            else  {
                res.status(403).send('type not found');
            }
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    });
});