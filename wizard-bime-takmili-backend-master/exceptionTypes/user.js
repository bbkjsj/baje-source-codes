const NO_USER = {
    message: "No User Found",
    code: "NO_USER"
};
const NO_SUBORDINATE = {
    message: "No Subordinate Found",
    code: "NO_SUBORDINATE"
};
const DUPLICATED_PARENTS = {
    message: "Duplicated Parents",
    code: "DUPLICATED_PARENTS"

};
const SUBORDINATE_CREATE_FAIL = {
    message: "Subordinate Create Fail",
    code: "SUBORDINATE_CREATE_FAIL"
};
const SUBORDINATE_MODIFY_FAIL = {
    message: "Subordinate MODIFY Fail",
    code: "SUBORDINATE_MODIFY_FAIL"
};
const SUBORDINATE_REMOVE_FAIL = {
    message: "Subordinate Remove Fail",
    code: "SUBORDINATE_REMOVE_FAIL"
};
const WRONG_SUBORDINATE = {
    message: "Subordinate is not in your Subordinates!",
    code: "WRONG_SUBORDINATE"
};
const WRONG_FILE = {
    message: "wrong file!",
    code: "WRONG_FILE"
};

const ADD_SUBORDINATE_FIELD_MIN_LENGTH =  (min) => ({
    message: `field min value must more than ${min} and is required`,
    code: "ADD_SUBORDINATE_FIELD_MIN_LENGTH",
    min,
});

const ADD_SUBORDINATE_FIELD_BETWEEN_LENGTH =  (min, max) => ({
    message: `field min value must more than ${min} and max value must less than ${max} and is required`,
    code: "ADD_SUBORDINATE_FIELD_BETWEEN_LENGTH",
    min,
    max
});

const ADD_SUBORDINATE_FIELD_EXACT_LENGTH =  (exact) => ({
    message: `field value must ${exact} numbers and is required`,
    code: "ADD_SUBORDINATE_FIELD_EXACT_LENGTH",
    exact
});

const ADD_SUBORDINATE_FIELD_IS_ONE_OF =  (oneOf) => ({
    message: `field value must one of ${oneOf.map(item => item)}`,
    code: "ADD_SUBORDINATE_FIELD_IS_ONE_OF",
    oneOf: oneOf.map(item => item),
});

const ADD_SUBORDINATE_FIELD_INVALID_DATE = {
    message: `invalid date format`,
    code: "ADD_SUBORDINATE_FIELD_INVALID_DATE",
};

const ADD_SUBORDINATE_FIELD_DUPLICATED_NATION_CODE = {
    message: `Duplicated Nation Code`,
    code: "ADD_SUBORDINATE_FIELD_DUPLICATED_NATION_CODE",
};


module.exports = {
    NO_USER,
    NO_SUBORDINATE,
    DUPLICATED_PARENTS,
    SUBORDINATE_CREATE_FAIL,
    SUBORDINATE_MODIFY_FAIL,
    WRONG_SUBORDINATE,
    SUBORDINATE_REMOVE_FAIL,
    WRONG_FILE,
    ADD_SUBORDINATE_FIELD_MIN_LENGTH,
    ADD_SUBORDINATE_FIELD_EXACT_LENGTH,
    ADD_SUBORDINATE_FIELD_BETWEEN_LENGTH,
    ADD_SUBORDINATE_FIELD_IS_ONE_OF,
    ADD_SUBORDINATE_FIELD_INVALID_DATE,
    ADD_SUBORDINATE_FIELD_DUPLICATED_NATION_CODE
}
