const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports.create = ((userModel) => {
  return new Promise((resolve, reject) => {
    let cert = fs.readFileSync('private.key');
    jwt.sign({
      UserModel: userModel
    }, cert, {
      algorithm: 'RS256',
      expiresIn: '10d'
    }, (err, token) => {
      if (err) {
        reject(err.toString());
      }
      if (token) {
        resolve(token);
      }
    })
  });
});

module.exports.verify = ((token) => {
  return new Promise((resolve, reject) => {
    var cert = fs.readFileSync('./public.pem');
    jwt.verify(token, cert, {
      algorithms: ['RS256']
    }, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
});

module.exports.survey = ((userModel) => {
  return new Promise((resolve, reject) => {
    try{
      let cert = fs.readFileSync('private_survey.key');
      jwt.sign({
        UserModel: userModel
      }, cert, {
        algorithm: 'RS256',
        expiresIn: '2d'
      }, (err, token) => {
        if(err) { reject(err); }
        if(token) { resolve(token); }
      })
    }
    catch(err) {
      reject(err);
    }
  })
})

module.exports.survey_verify = ((token) => {
  return new Promise((resolve, reject) => {
    var cert = fs.readFileSync('./public_survey.pem');
    jwt.verify(token, cert, {
      algorithms: ['RS256']
    }, (err, data) => {
      if (err) {
        reject();
      }
      else {
        resolve(data);
      }
    });
  });
})
