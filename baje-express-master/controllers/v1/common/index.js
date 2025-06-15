const moment = require('moment');
const jmoment = require('jalali-moment');

module.exports = ((app) => {
    const prefix = '/api/common';


    app.get(`${prefix}/time`, async(req, res) => {
        res.status(200).send({
            date: moment().utc(true).format('YYYY/MM/DD'),
            time: moment().utc(true).format('HH:mm:ss'),
            shamsi: jmoment().utc(true).format('jYYYY/jMM/jDD')
        });
    })

})