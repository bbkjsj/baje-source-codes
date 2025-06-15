const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cluster = require('cluster');
const sticky = require('sticky-session');
const http = require('http');
const server = http.Server(app);
const passport = require('passport');
const router = express.Router();
const xls = require('json2xls');
const moment = require('moment');
const requestIp = require('request-ip');

//constants
const pool = require('./helpers/db');
const { exit } = require('process');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
app.set('pool', pool);

//middlewares
app.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb'
}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, cid");
    next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(xls.middleware);

//audit service
app.use((req, res, next) => {
    try {


        var pp = pool.promise();
        pp.query('insert into audit (body, request_type, path, date, user_object, ip_address) values (?,?,?,?,?,?)', [
            req.body != null ? JSON.stringify(req.body) : '',
            req.method,
            req.url,
            moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
            req.user != null ? JSON.stringify(req.user) : '',
            requestIp.getClientIp(req)
        ]);

        next();
    }
    catch (err) {
        console.log(err);
        next();
    }
})
//routes
require('./routes')(app);





const port = 4001;

if (!sticky.listen(server, port, '0.0.0.0')) {


    server.once('listening', async () => {
        console.log('server is listening on port: ' + port);
    });

    if (cluster.isMaster) {

    }
}
else {

    console.log('child server started on port ' + port + ' case worker id=' + cluster.worker.id);
}


var readExcel = (() => {
    const excelReader = require('read-excel-file/node');
    const fs = require('fs');

    fs.readFile('/Users/amir/Downloads/jobs.csv', async (err, data) => {
        const arr = data.toString().split('\n');
        const pp = pool.promise();
        let cmd = 'insert into job_title (title, code) values ';

        let counter = 1;

        let min = 80001;
        let max = arr.length;//arr.length;

        for (let i = min; i < max; i++) {
            const itemArr = arr[i].split(',');
            if (i == max - 1) {
                cmd += `('${itemArr[1]}' , '${itemArr[0]}');`;
            }
            else {
                cmd += `('${itemArr[1]}' , '${itemArr[0]}'),`
            }
            counter++;
        }
        console.log('loop finished', counter);
        await pp.query(cmd);
        console.log('done');
    });

    // excelReader(fs.createReadStream('/home/amir/Downloads/jobs.xlsx')).then(rows => { 

    // })
})

const prepareContracts = (async () => {
    const pp = pool.promise();
    const [contracts] = await pp.query(`select * from contract where type='main_non_civil' or type='main_civil'`);



    for (let i = 0; i < contracts.length; i++) {
        const fromDate = moment(contracts[i].start_date);
        const toDate = moment(contracts[i].end_date);
        const diff = toDate.diff(fromDate, 'days');

        
        if (diff < 30000) {

            for (j = 0; j < diff + 1; j++) {

                const d = moment(contracts[i].start_date).utc(true).add(j, 'day').format('YYYY/MM/DD');

                //insert into contract progress
                await pp.query('insert into contract_progress (contract_id_fk, date, real_progress, program_progress) values (?,?,?,?)', [
                    contracts[i].id,
                    d,
                    0,
                    0
                ]);


                if (contracts[i].activity == 'mineral') {
                    //insert into contract production report
                    await pp.query('insert into contract_production_report (stone_tonnage, dust_tonnage, stone_load_quantity, dust_load_quantity, contract_id_fk, date) values (?,?,?,?,?,?)', [
                        0,
                        0,
                        0,
                        0,
                        contracts[i].id,
                        d
                    ]);
                }

                if (contracts[i].type == 'main_civil' || contracts[i].type == 'main_non_civil') {
                    //insert into contract peyman report
                    await pp.query('insert into contract_peyman_report (contract_id_fk, date, disabled_car_no_tier_quantity, disabled_car_no_part_quantity, active_car_quantity, ready_to_work_factor) values (?,?,?,?,?,?)', [
                        contracts[i].id,
                        d,
                        0,
                        0,
                        0,
                        0
                    ]);
                }

                console.log(`${d} => ${contracts[i].id}`);
            }
        }
    }
});
