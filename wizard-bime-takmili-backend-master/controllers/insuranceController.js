'use strict';
const express = require('express');
const router = express.Router();
const insuranceException = require("../exceptionTypes/insurance");
const {takmiliType} = require("../constant/instranceType");
const {Op} = require('sequelize');
module.exports = context => {

    
    const {sequelize} = context;
    const insuranceModel = require('../models/insurance')(sequelize);
    const insuranceTakmiliPersonnel = require('../models/insurance_takmili_personnel')(sequelize);
    const insuranceTakmiliSubordinate = require('../models/insurance_takmili_subordinate')(sequelize);
    const personnel = require('../models/personnel')(sequelize);
    const personnelSubordinate = require('../models/personnel_subordinate')(sequelize);
    //set one to many relations
    insuranceTakmiliPersonnel.belongsTo(insuranceModel, {foreignKey: 'insurance_id_fk'});
    insuranceTakmiliPersonnel.belongsTo(personnel, {foreignKey: 'personnel_id_fk'});
    insuranceTakmiliPersonnel.hasMany(insuranceTakmiliSubordinate, {foreignKey: 'insurance_takmili_subordinate_id_fk'});
    insuranceTakmiliSubordinate.belongsTo(personnelSubordinate, {foreignKey: 'subordinate_id_fk'});
    insuranceTakmiliSubordinate.belongsTo(insuranceModel, { foreignKey: 'insurance_id_fk'});
    personnel.hasMany(personnelSubordinate, {foreignKey: 'personnel_id_fk'});
    personnelSubordinate.hasMany(insuranceTakmiliSubordinate, {foreignKey: 'subordinate_id_fk'});
    personnelSubordinate.belongsTo(personnel, {foreignKey: 'personnel_id_fk'});
    insuranceModel.hasMany(insuranceTakmiliSubordinate, { foreignKey: 'insurance_id_fk'})
    /*
     *   get user insurances
     *   No Params
     */
    router.get('/', async (req, res, next) => {
        try {
            const response = await insuranceTakmiliPersonnel.findAll(
                {
                    where: {
                        personnel_id_fk: res.user.id,
                        is_deleted: null
                    },
                    include: [
                        {
                            model: insuranceModel,
                            required: true,
                        },
                    ]
                }
            );
            req.result = response || [];
            req.errorStatus = 200;
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   get user insurance by details by id
     *   :insuranceId Number, Required
     */
    router.get('/:insuranceId', async (req, res, next) => {
        try {
            const id = req.params.insuranceId;
            
            const response = await insuranceModel.findOne({
                where: { 
                    id: id
                },
                include:[
                    {
                        model: insuranceTakmiliSubordinate,
                        required: false,
                        include: [
                            {
                                model: personnelSubordinate, 
                                required: true,
                                where: { 
                                    personnel_id_fk: res.user.id
                                },
                                include: [
                                    {
                                        model: personnel,
                                        require: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 404;
                throw (insuranceException.INSURANCE_NOT_EXIST);
            }
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   get insurance row By Id
     *   :companyId: Number, Optional, -1 => All
     */
    router.get('/insuranceByCompany/:companyId', async (req, res, next) => {
        try {
            const company_id_fk = req.params.companyId;
            const searchInsuranceCompanyWhere = {
                type: takmiliType
            };
            if (company_id_fk !== "-1") searchInsuranceCompanyWhere.company_id_fk = company_id_fk;
            const response = await insuranceModel.findAll({where: searchInsuranceCompanyWhere});
            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 404;
                throw (insuranceException.INSURANCE_NOT_EXIST);
            }
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   get insurance details By Id
     *   :id: Number
     */
    router.get('/details/:id', async (req, res, next) => {
        try {
            const response = await insuranceModel.findOne({where: {id: req.params.id}});
            if (response) {
                req.result = response;
                req.errorStatus = 200;
            } else {
                req.errorStatus = 404;
                throw (insuranceException.INSURANCE_NOT_EXIST);
            }
        } catch (error) {
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   set insurance
     */
    router.put('/:id', async (req, res, next) => {
        const transaction = await sequelize.transaction();


        try {
            //check for insurance
            const insurance = await insuranceTakmiliPersonnel.findOne({
                where: {
                    id: req.params.id,
                    personnel_id_fk: res.user.id,
                    is_deleted: null
                }
            });
            if (!insurance || insurance.length < 1) throw insuranceException.WRONG_INSURANCE;

            //create personnel insurance model
            const insuranceTakmiliPersonnelRequest = {
                description: req.body.description,
            };

            //update insurance
            const resultInsuranceTakmiliPersonnel = await insuranceTakmiliPersonnel.update(insuranceTakmiliPersonnelRequest, {
                where: {
                    id: req.params.id,
                    personnel_id_fk: res.user.id,
                    is_deleted: null
                }, transaction
            });

            //check for insurance created
            if (!resultInsuranceTakmiliPersonnel) throw insuranceException.CREATE_PERSONNEL_INSURANCE_ERROR;
            //check if add subordinates
            let resultInsuranceTakmiliSubordinate = [];

            //destroy all subordinates and check for recreate
            await insuranceTakmiliSubordinate.destroy({
                where: {
                    insurance_takmili_subordinate_id_fk: req.params.id
                },transaction
            });

            
            if (req.body.subordinates && req.body.subordinates.length > 0) {
                //check for user subordinate
                const userSubordinates = await personnelSubordinate.findAll({
                    where: {
                        personnel_id_fk: res.user.id,
                    }
                });
                req.body.subordinates.forEach(subordinate => {
                    const search = userSubordinates.filter(userSubordinate => userSubordinate.id == subordinate.id);
                    if (search.length < 1) throw insuranceException.CREATE_PERSONNEL_SUBORDINATE_ERROR;
                })
                //create subordinates model
                const insuranceTakmiliSubordinateRequest = req.body.subordinates.map(subordinate => ({
                    start_date: insurance.start_date,
                    end_date: insurance.end_date,
                    subordinate_id_fk: subordinate.id,
                    description: subordinate.description,
                    insurance_id_fk: insurance.insurance_id_fk,
                    insurance_takmili_subordinate_id_fk: req.params.id
                }));
                //bulk create subordinate
                resultInsuranceTakmiliSubordinate = await insuranceTakmiliSubordinate.bulkCreate(insuranceTakmiliSubordinateRequest, {transaction});
                //check for create subordinates
                if (!resultInsuranceTakmiliSubordinate || resultInsuranceTakmiliSubordinate.length < 1) throw insuranceException.CREATE_PERSONNEL_SUBORDINATE_ERROR;
            }
            await transaction.commit();
            req.result = {
                personnelInsurance: resultInsuranceTakmiliPersonnel,
                subordinates: resultInsuranceTakmiliSubordinate,
            }
            req.errorStatus = 200;
        } catch (error) {
            await transaction.rollback();
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   modify insurance
     */
    router.post('/', async (req, res, next) => {
        const transaction = await sequelize.transaction();

        try {
            //check for insurance
            const insurance = await insuranceModel.findOne({
                where: {
                    id: req.body.insuranceId,
                }
            });
            if (!insurance || insurance.length < 1) {
                req.errorStatus = 400;
                throw insuranceException.WRONG_INSURANCE;
            }

            //check for duplicated insurance
            const duplicatedInsurance = await insuranceTakmiliPersonnel.findAll({
                where: {
                    personnel_id_fk: res.user.id,
                    insurance_id_fk: req.body.insuranceId,
                    is_deleted: null,
                    is_approved: null,
                }
            });
            if (duplicatedInsurance && duplicatedInsurance.length > 0) {
                req.errorStatus = 400;
                throw insuranceException.DUPLICATE_INSURANCE;
            }

            //create personnel insurance model
            const insuranceTakmiliPersonnelRequest = {
                personnel_id_fk: res.user.id,
                start_date: insurance.contract_date_from_date,
                end_date: insurance.to_date,
                description: req.body.description,
                insurance_id_fk: insurance.id,
                main_insurer_personnel_id_fk: res.user.id,
                is_approved: null,
                is_deleted: null
            };

            //create insurance
            const resultInsuranceTakmiliPersonnel = await insuranceTakmiliPersonnel.create(insuranceTakmiliPersonnelRequest, {transaction});

            //check for insurance created
            if (!resultInsuranceTakmiliPersonnel) throw insuranceException.CREATE_PERSONNEL_INSURANCE_ERROR;
            //check if add subordinates
            let resultInsuranceTakmiliSubordinate = [];

            if (req.body.subordinates && req.body.subordinates.length > 0) {
                //check for user subordinate
                const userSubordinates = await personnelSubordinate.findAll({
                    where: {
                        personnel_id_fk: res.user.id,
                    }
                });
                req.body.subordinates.forEach(subordinate => {
                    const search = userSubordinates.filter(userSubordinate => userSubordinate.id == subordinate.id);
                    if (search.length < 1) throw insuranceException.CREATE_PERSONNEL_SUBORDINATE_ERROR;
                })
                //create subordinates model
                const insuranceTakmiliSubordinateRequest = req.body.subordinates.map(subordinate => ({
                    start_date: insurance.contract_date_from_date,
                    end_date: insurance.to_date,
                    subordinate_id_fk: subordinate.id,
                    description: subordinate.description,
                    insurance_id_fk: insurance.id,
                    insurance_takmili_subordinate_id_fk: resultInsuranceTakmiliPersonnel.id,
                }));
                //bulk create subordinate
                resultInsuranceTakmiliSubordinate = await insuranceTakmiliSubordinate.bulkCreate(insuranceTakmiliSubordinateRequest, {transaction});
                //check for create subordinates
                if (!resultInsuranceTakmiliSubordinate || resultInsuranceTakmiliSubordinate.length < 1) throw insuranceException.CREATE_PERSONNEL_SUBORDINATE_ERROR;
            }
            await transaction.commit();
            req.result = {
                personnelInsurance: resultInsuranceTakmiliPersonnel,
                subordinates: resultInsuranceTakmiliSubordinate,
            }
            req.errorStatus = 200;
        } catch (error) {
            await transaction.rollback();
            req.error = error;
            req.errorStatus = req.errorStatus ? req.errorStatus : 404;
        }
        next();
    });
    /*
     *   cancel insurance
     */
    router.delete('/:id', async (req, res, next) => {
        try {
            const result = await insuranceTakmiliPersonnel.update({'is_deleted': 1}, {
                where: {
                    id: req.params.id,
                    personnel_id_fk: res.user.id
                }
            })
            if (result) {
                req.result = insuranceException.DELETE_SUCCESS;
                req.errorStatus = 200;
            } else {
                req.result = insuranceException.DELETE_FAIL;
                req.errorStatus = 403;
            }
        } catch (error) {
            req.error = insuranceException.DELETE_FAIL;
            req.errorStatus = req.errorStatus ? req.errorStatus : 500;
        }
        next();
    });


    return router;
}
