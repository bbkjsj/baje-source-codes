module.exports.response = (response, code = 200) => {
    if (typeof (response) === 'string') response = { message: response };
    return {response, code };
}
module.exports.error = (error, code = 500) => {
    if (typeof (code) === 'undefined') code = 500;
    if(error instanceof Object){
        if(error.name && error.name === 'SequelizeUniqueConstraintError' && error.errors){
            error = error.errors.map(item => item.message);
        }
        if(error.type && error.type === 'system'){
            error = [error.message];
        }
    } else if (typeof (error) === 'string') error = [error];
    return { error, code };
}