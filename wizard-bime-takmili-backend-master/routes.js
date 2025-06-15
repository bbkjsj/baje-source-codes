'use strict';

const { checkToken } = require('./middleWare/checkToken');
const { setResponse } = require('./middleWare/setResponse');
const insuranceController = require('./controllers/insuranceController');
const userController = require('./controllers/userController');

module.exports = context => {
    //application routes
    context.app.use('/insurance', checkToken, insuranceController(context), setResponse);
    context.app.use('/user', checkToken, userController(context), setResponse);
}
