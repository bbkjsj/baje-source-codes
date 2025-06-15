const { check } = require('express-validator');
const moment = require('moment');
const {
    MINIMUM_CHARACTER,
    MAXIMUM_CHARACTER,
    NATION_CODE_EXACT,
    RELATION_ONE_OF,
    SPONSORSHIP_STATUS_ONE_OF
} = require('../constant/validation');
const {
    ADD_SUBORDINATE_FIELD_MIN_LENGTH,
    ADD_SUBORDINATE_FIELD_EXACT_LENGTH,
    ADD_SUBORDINATE_FIELD_BETWEEN_LENGTH,
    ADD_SUBORDINATE_FIELD_IS_ONE_OF,
    ADD_SUBORDINATE_FIELD_INVALID_DATE
} = require('../exceptionTypes/user');

module.exports.formatValidation = errors => {
    return errors.filter(item => typeof(item.msg) !== 'string').map(item => ({
        field: item.param,
        ...item.msg
    }));
}

const isDate = (date) => {
    return moment(date).isValid();
}

const checkSponsorshipStatus = (val, record) => {
    if(record.sponsorship_status === SPONSORSHIP_STATUS_ONE_OF[1]) return true;
    if(!val || !val.match(/^\d+$/) || !(val.length >= 8 && val.length <= 10)) return false;
    return true;
}

module.exports.validateSubordinateAdd = () => [
    check('first_name').trim().isLength({ min: MINIMUM_CHARACTER, max: MAXIMUM_CHARACTER }).withMessage(ADD_SUBORDINATE_FIELD_MIN_LENGTH(MINIMUM_CHARACTER)),
    check('last_name').trim().isLength({ min: MINIMUM_CHARACTER, max: MAXIMUM_CHARACTER }).withMessage(ADD_SUBORDINATE_FIELD_MIN_LENGTH(MINIMUM_CHARACTER)),
    check('father_name').trim().isLength({ min: MINIMUM_CHARACTER, max: MAXIMUM_CHARACTER }).withMessage(ADD_SUBORDINATE_FIELD_MIN_LENGTH(MINIMUM_CHARACTER)),
    check('id_number').trim().isNumeric().isLength({ min: 1 }).withMessage(ADD_SUBORDINATE_FIELD_MIN_LENGTH(1)),
    check('national_code').trim().isNumeric().isLength({ min: NATION_CODE_EXACT, max: NATION_CODE_EXACT }).withMessage(ADD_SUBORDINATE_FIELD_EXACT_LENGTH(NATION_CODE_EXACT)),
    check('birth_date').custom((date) => isDate(date)).withMessage(ADD_SUBORDINATE_FIELD_INVALID_DATE),
    check('issue_place').trim().isLength({ min: MINIMUM_CHARACTER, max: MAXIMUM_CHARACTER }).withMessage(ADD_SUBORDINATE_FIELD_MIN_LENGTH(1)),
    check('sponsor_date').custom((date, { req }) => isDate(date)).withMessage(ADD_SUBORDINATE_FIELD_INVALID_DATE),
    check('relation').trim().isIn(RELATION_ONE_OF).withMessage(ADD_SUBORDINATE_FIELD_IS_ONE_OF(RELATION_ONE_OF)),
    check('sponsorship_status').trim().isIn(SPONSORSHIP_STATUS_ONE_OF).withMessage(ADD_SUBORDINATE_FIELD_IS_ONE_OF(SPONSORSHIP_STATUS_ONE_OF)),
    check('insurance_number').custom((insurance_number, { req }) => checkSponsorshipStatus(insurance_number, req.body)).withMessage(ADD_SUBORDINATE_FIELD_BETWEEN_LENGTH(8, 10)),
];

