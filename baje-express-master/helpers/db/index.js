const mysql = require('mysql2');
const public = 'test.baje724.ir'; //'185.255.88.145';
const private = '127.0.0.1';
const pool = mysql.createPool({
    host: private,
    user: 'bajedb_user',
    password: 'HWFSzN&CFwU^zgq',
    database: 'bjdb',
    timezone: 'utc',
    dateStrings: true
});
module.exports = pool;
