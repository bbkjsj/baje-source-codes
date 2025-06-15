const express =  require('express');
const bodyParser =  require('body-parser');
const requestIp = require('request-ip');
const Sequelize = require('sequelize');
const cors = require('cors')
const config = require('./config');
const routes = require('./routes');
const app = express();

app.use(cors())

//set sequelize
    const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
        host: config.database.host,
        dialect: config.database.dialect,
        logging: process.env.NODE_ENV === 'development'
    });
    try {
        sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:');
    }
//set body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(requestIp.mw())

// set context for route
    const context = { app, sequelize };

// set routes
    routes(context);


app.get('/welcome', (req, res) => {
	res.json({
		message: 'welcome'
	});
});
// start App
    app.listen(config.applicationPort,'0.0.0.0',  () => console.log(`server running on port ${config.applicationPort}`));
