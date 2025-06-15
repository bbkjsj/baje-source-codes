const fs = require('fs');
const auth = require('../../../middlewares/auth');
const path = require('path');

module.exports = ((app) => { 
    app.get('/api/file/:module/:filename',  (req, res) => { 
        try{
            if(req.params.module == 'survey' || req.params.module == 'timeline_survey') { 
                fs.readFile('/var/www/baje724/_uploads/survey/' + req.params.filename, (_err, data) => {
                    console.log(_err);
                    if(_err) { 
                        res.status(403).send('خطا رخ داده است');
                    }
                    else { 
                        res.sendFile('/var/www/baje724/_uploads/survey/' + req.params.filename);
                    }
                });
            }
            else if(req.params.module == 'bck_survey') { 
                fs.readFile(`/var/www/baje724/_uploads/survey/background/${req.params.filename}`, (_err, data) => {
                    if(_err) { 
                        res.status(403).send('no file');
                    }
                    else { 
                        res.sendFile(`/var/www/baje724/_uploads/survey/background/${req.params.filename}`);
                    }
                })
            }
            else if(req.params.module == 'insurance') { 
                fs.readFile(`/var/www/baje724/_uploads/insurance/${req.params.filename}`, (_err, data) => {
                    if(_err) { 
                        console.log(_err);
                        res.status(403).send('no file');
                    }
                    else { 
                        res.sendFile(`/var/www/baje724/_uploads/insurance/${req.params.filename}`);
                    }
                })
            }
            else if (req.params.module === 'vehicle-system') { 
                
                fs.readFile(`${process.cwd()}/_uploads/vehicle/system/logo/${req.params.filename}`, (err, data) => { 
                    if(err){ 
                        res.status(404).send('not found');
                    }
                    else { 
                        res.sendFile(`${process.cwd()}/_uploads/vehicle/system/logo/${req.params.filename}`);
                    }
                })
            }
        }
        catch(err) { 
            console.log(err);
            res.status(403).send('error occured');
        }
    });
});