'use strict';
const express = require('express');
const {unlinkSync} = require('fs');
const router = express.Router();
const userException = require("../exceptionTypes/user");
const {upload, uploadPath, fileFormat} = require("../constant/subordinateUpload");
const {validateSubordinateAdd, formatValidation} = require("../middleWare/validator");
const {validationResult} = require('express-validator');
const fileException = require("../exceptionTypes/file");
const sharp = require('sharp');

module.exports = context => {

    const {sequelize} = context;
    const personnel = require('../models/personnel')(sequelize);
    const personnelSubordinate = require('../models/personnel_subordinate')(sequelize);
    const insuranceTakmiliSubordinateUpload = require('../models/insurance_takmili_subordinate_upload')(sequelize);

    //set one to many relations
    personnel.hasMany(personnelSubordinate, {foreignKey: 'personnel_id_fk'});
    personnelSubordinate.hasMany(insuranceTakmiliSubordinateUpload, {foreignKey: 'subordinate_id_fk'});

    /*
     *   get current user
     */
    router.get('/', async (req, res, next) => {
        try {
            const response = await personnel.findOne({where: {id: res.user.id}});
            if (response) {
                req.result = response;
                req.errorStatus = 200;

            } else {
                req.errorStatus = 404;
                throw (userException.NO_USER);
            }
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   get current user subordinates
     */
    router.get('/subordinates', async (req, res, next) => {
        try {
            const response = await personnelSubordinate.findAll(
                {
                    where: {
                        personnel_id_fk: res.user.id
                    },
                });
            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 404;
                throw (userException.NO_SUBORDINATE);
            }
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   get subordinate by id
     *   params: subordinate id <personnelSubordinate> model
     */
    router.get('/subordinate/:id', async (req, res, next) => {
        try {
            const response = await personnelSubordinate.findOne(
                {
                    where: {
                        personnel_id_fk: res.user.id,
                        id: req.params.id
                    },
                    include: [
                        {
                            model: insuranceTakmiliSubordinateUpload,
                            required: true
                        }
                    ]
                });
            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 404;
                throw (userException.NO_SUBORDINATE);
            }
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   add subordinate to current user
     *   params: <personnelSubordinate> model
     */
    router.post('/subordinate', validateSubordinateAdd(), async (req, res, next) => {
        try {
            //validate subordinate request
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                req.errorStatus = 400;
                throw formatValidation(validationErrors.array());
            }

            //create subordinate request
            const subordinateRequest = {personnel_id_fk: res.user.id, ...req.body};

            //check for duplicated mother or father
            const findDuplicateParents = await checkSubordinateDuplicate(subordinateRequest, {req, res})
            if (findDuplicateParents && findDuplicateParents.length > 0) {
                req.errorStatus = 400;
                throw userException.DUPLICATED_PARENTS
            }
            //check duplicated nation code
            const duplicatedNationCode = await personnelSubordinate.findAll({
                where: {
                    national_code: subordinateRequest.national_code,
                    personnel_id_fk: res.user.id
                }
            })
            if (duplicatedNationCode && duplicatedNationCode.length > 0) {
                req.errorStatus = 400;
                throw userException.ADD_SUBORDINATE_FIELD_DUPLICATED_NATION_CODE;
            }
            //add Subordinate
            const response = await personnelSubordinate.create(subordinateRequest);

            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 500;
                throw (userException.SUBORDINATE_CREATE_FAIL);
            }

        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   edit subordinate
     *   params: <personnelSubordinate> model
     */
    router.put('/subordinate/:id', validateSubordinateAdd(), async (req, res, next) => {
        try {
            //validate subordinate request
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                req.errorStatus = 400;
                throw formatValidation(validationErrors.array());
            }

            //get subordinate request
            const currentSubordinate = await personnelSubordinate.findOne({
                where: {
                    id: req.params.id,
                    personnel_id_fk: res.user.id
                }
            });

            //check for subordinate is in user subordinates
            if (!currentSubordinate) {
                req.errorStatus = 403;
                throw userException.WRONG_SUBORDINATE;
            }

            //create subordinate request
            const subordinateRequest = {...req.body};


            //modify Subordinate
            const response = await personnelSubordinate.update(subordinateRequest, {where: {id: req.params.id}});

            if (response) {

                req.result = {...currentSubordinate.dataValues, ...subordinateRequest};
                req.errorStatus = 200;
            } else {
                req.errorStatus = 500;
                throw (userException.SUBORDINATE_CREATE_FAIL);
            }

        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
 *   upload subordinate file
 *   params: <file>
 */
    router.post('/subordinateUpload', upload.single('file'), async (req, res, next) => {
        try {
            //create file variables
            const file = req.file
            if (!file) {
                req.errorStatus = 400;
                throw (fileException.NO_FILE_UPLOAD);
            }

            //check subordinate is own of personnel
            const checkSubordinate = await personnelSubordinate.findOne(
                {
                    where: {
                        personnel_id_fk: res.user.id,
                        id: req.body.subordinateId
                    },
                });
            if (!checkSubordinate) {
                await unlinkSync(`${process.cwd()}/${file.path}`)
                req.errorStatus = 400;
                throw(userException.WRONG_SUBORDINATE);
            }
            let path = `/${file.path}`;
            const newFileName = `${process.cwd()}/${uploadPath}${fileFormat(req.body.subordinateId)}`;
            //resize and optimize and convert
            try {
                await sharp(`${process.cwd()}/${file.path}`)
                    .rotate()
                    .resize(1000)
                    .jpeg()
                    .toFile(newFileName)
                    .then(async (response) => {
                        await unlinkSync(`${process.cwd()}/${file.path}`)
                        path = `/${uploadPath}${fileFormat(req.body.subordinateId)}`;
                    })

            } catch (error) {
                path = `/${file.path}`;
            }
            //create upload request model
            const insuranceTakmiliSubordinateUploadRequest = {
                path,
                description: req.body.description,
                subordinate_id_fk: req.body.subordinateId,
            };

            //add Subordinate file
            const response = await insuranceTakmiliSubordinateUpload.create(insuranceTakmiliSubordinateUploadRequest);

            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 500;
                throw (userException.SUBORDINATE_CREATE_FAIL);
            }

        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 500;
        }
        next();
    });
    /*
     *   remove subordinate
     *   params: <personnelSubordinate> model
     */
    router.delete('/subordinate/file/:id', async (req, res, next) => {
        try {
            const subordinateUpload = await insuranceTakmiliSubordinateUpload.findOne({where: {id: req.params.id}})
            if (!subordinateUpload) {
                req.errorStatus = 403;
                throw (userException.WRONG_FILE);
            }
            const subordinate = await personnelSubordinate.findOne({
                where: {
                    id: subordinateUpload.subordinate_id_fk,
                    personnel_id_fk: res.user.id
                }
            });
            if (!subordinate) {
                req.errorStatus = 403;
                throw (userException.WRONG_SUBORDINATE);
            }
            //remove Subordinate upload file
            const response = await insuranceTakmiliSubordinateUpload.update({is_deleted: 1}, {where: {id: req.params.id}});

            if (response) {

                req.result = "file deleted successfully";
                req.errorStatus = 200;
            } else {
                req.errorStatus = 500;
                throw (userException.SUBORDINATE_REMOVE_FAIL);
            }

        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 500;
        }
        next();
    });
    //check for duplicated mother or father
    const checkSubordinateDuplicate = async (subordinateRequest, {res}) => {
        if (subordinateRequest.relation === 'father' || subordinateRequest.relation === 'mother') {
            const findDuplicateParents = await personnelSubordinate.findAll({
                where: {
                    personnel_id_fk: res.user.id,
                    relation: subordinateRequest.relation
                }
            });
            return findDuplicateParents
        }

    }
    return router;
}
