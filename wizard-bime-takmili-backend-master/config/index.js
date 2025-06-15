const baseServerUrl = 'localhost:4001/api/';
const dbConfig = require('./config.json');
const processes = require('./../processes.json');
if(!process.env.NODE_ENV) process.env.NODE_ENV = processes.apps[0].env_development.NODE_ENV;
if(!process.env.PORT) process.env.PORT = processes.apps[0].env_development.PORT;

module.exports = {
    applicationPort: 4005,
    database: dbConfig[process.env.NODE_ENV],
    baseServerUrl,
};
