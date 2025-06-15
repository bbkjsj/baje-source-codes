const request = require('request');
const https = require('https');
const querystring = require('querystring');

module.exports.sendSMS = ((code, tonumber) => {
    
    const token = '64643961466156775571762F4D45726B2B48582B703872586E4B4F706F536C49546F66476E56785A435A633D';
    
    const params = { 
        receptor: tonumber,
        token: code,
        template: 'verify'
    };
    const postdata = querystring.stringify(params);
    
    var req = https.request({
        host: `api.kavenegar.com`,
        path: `/v1/${token}/verify/lookup.json`,
        method: 'POST',
        headers: { 
            'Content-Length': postdata.length,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        port: '443'
    }, (e) => {
        e.setEncoding('utf8');
        var result = '';
        e.on('data', (data) => {
            result += data;
        });
        e.on('end', () =>{ 
            try{
                var jsonObject = JSON.parse(result);
                console.log(jsonObject);
            }
            catch(err) {
                console.log(err);
            }
        });
    });

    req.write(postdata, 'utf-8');
    req.on('error', (e) => { 
        console.log(`error while writing: ${e}`);
    });
    req.end();
});


module.exports.sendInsuranceApproval = ((firstName, lastName, tonumber) => {
    const token = '64643961466156775571762F4D45726B2B48582B703872586E4B4F706F536C49546F66476E56785A435A633D';
    const params = {
        receptor: tonumber,
        token: 'باتشکر',
        token10: `${firstName} ${lastName}`,
        template: 'insurancetakmili'
    }
    const postdata = querystring.stringify(params);
    
    

    var req = https.request({
        host: `api.kavenegar.com`,
        path: `/v1/${token}/verify/lookup.json`,
        method: 'POST',
        headers: { 
            'Content-Length': postdata.length,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        port: '443'
    }, (e) => {
        e.setEncoding('utf8');
        var result = '';
        e.on('data', (data) => {
            result += data;
        });
        e.on('end', () =>{ 
            try{
                var jsonObject = JSON.parse(result);
                console.log(jsonObject);
            }
            catch(err) {
                console.log(err);
            }
        });
    });

    req.write(postdata, 'utf-8');
    req.on('error', (e) => { 
        console.log(`error while writing: ${e}`);
    });
    req.end();

});
