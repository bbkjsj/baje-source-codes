
module.exports.isInRoleOfContract = ((user, contract_id, role, pool) => {
    return new Promise(async (resolve, reject) => {
        if(user.super == 1){
            resolve(true);
            return;
        }
        var pp = pool.promise();
        var [check] = await pp.query('select id from personnel_access where personnel_id_fk = ? and contract_id_fk = ? and access = ?', [
            user.id,
            contract_id,
            role
        ]);
        
        if(check.length > 0) {
            resolve(true);
        }
        else { 
            resolve(false);
        }
    });
})