const normalize = require('./normalizer');

module.exports.setResponse = (req, res) => {
    try {
        const header = req.headers;
        if(header.token) header.token = "<--USER TOKEN-->"
    }catch (e) {
        //console.log('cant send log', e);
    }
    try {
        if(req.error) throw req.error;
        res.status(200).json(normalize.response(req.result, 200)).end();
    } catch (error) {
        //console.log(error);
        res.status(req.errorStatus ? req.errorStatus : 500).json( normalize.error(req.error, req.errorStatus ? req.errorStatus : 500) ).end();
    }
}
