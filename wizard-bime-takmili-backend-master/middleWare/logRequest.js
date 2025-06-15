const uuidv4 = require('uuid/v4');

module.exports.log = (admin_user_id, type, method, requestUrl, details, ip, status, requestDetails, req) => {
    try {
        const adminActivityModel = require('../models/adminActivity')(req.sequelize);
        if(type) adminActivityModel.create({ admin_user_id, type, details, status});
    } catch (error) {
        throw error.toString();
    }
}
