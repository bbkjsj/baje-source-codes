const tokenHelper = require('../../../helpers/token');
const permissions = require('../../../helpers/permissions');

module.exports = ((app) => { 
    const prefix = '/api/microservice';

    app.post(`${prefix}/verify`, async(req, res) => {
        try{
            if(req.body.token ) { 
                const tokenData = await tokenHelper.verify(req.body.token)
                if(tokenData) {
                     res.status(200).send(tokenData.UserModel);
                }
                else {
                    res.status(403).send({
                        statusCode: 400,
                        error: 'invalid token'
                    });
                }
            }
            else {
                res.status(403).send(
                    {
                        statusCode: 400,
                        error: 'incomplete request'
                    }
                );
            }
        }
        catch(err){ 
            res.status(403).send({
                statusCode: 403,
                error: err
            });
        }
    })

    app.get(`${prefix}/permissions`, async(req, res) => { 
        try{
            const list = await permissions.permissions();
            console.table(list);
            res.status(200).send(list);
        }
        catch(err) {
            throw err;
        }
    })
})