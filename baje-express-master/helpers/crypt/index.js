const iv = "Z66RYU1AT6AZ2";
const key = "HPP775p42CzU3yZU7Imelj37D52XvW19";
const clib = require('cryptlib');

module.exports.encrypt = ((phrase) => {
    return clib.encrypt(phrase, key, iv);
});

module.exports.decrypt = ((cipher) => {
    return clib.decrypt(cipher, key, iv);
});



