const config = require('./config');
const baseServerUrl = config.baseServerUrl;

module.exports = {
	login:  `http://${baseServerUrl}whoami`,
}
