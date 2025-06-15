const { setResponse } = require('./setResponse');
const {FetchData} =  require("./rest");
const {login} =  require("../var");
module.exports.checkToken = async (req, res, next) => {
    try {
	
        const user = await FetchData(req.headers.authorization, login);
	res.user = user;
	    console.log('user is', user);
        next();
    } catch (error) {
	console.log('error', error);
        req.error = error;
        req.errorStatus = error.status ? error.status : 401;
        setResponse(req, res, next);
    }
}
