import { actionTypes } from "./constant";

export const setLoading = (payload) => {
  return {
    type: actionTypes.SET_LOADING,
    payload,
  };
};

export const setBoss = (payload) => {
  return {
    type: actionTypes.SET_BOSS,
    payload,
  };
};

export const setCompanies = (payload) => {
  return {
    type: actionTypes.SET_COMPANIES,
    payload,
  };
};

export const setContractor = (payload) => {
  return {
    type: actionTypes.SET_CONTRACTOR,
    payload,
  };
};

export const setEmployer = (payload) => {
  return {
    type: actionTypes.SET_EMPLOYER,
    payload,
  };
};

export const setContractType = (payload) => {
  return {
    type: actionTypes.SET_CONTRACT_TYPE,
    payload,
  };
};

export const setMainContractDate = (payload) => {
  return {
    type: actionTypes.SET_MAIN_CONTRACT_DATE,
    payload,
  };
};

export const setMainContractFinishDate = (payload) => {
  return {
    type: actionTypes.SET_MAIN_CONTRACT_FINISH_DATE,
    payload,
  };
};

export const setManager = (payload) => {
  return {
    type: actionTypes.SET_MANAGER,
    payload,
  };
};

export const setSubject = (payload) => {
  return {
    type: actionTypes.SET_SUBJECT,
    payload,
  };
};

export const setCanNotEdit = (payload) => {
  return {
    type: actionTypes.SET_CAN_NOT_EDIT,
    payload,
  };
};

export const setContract = (payload) => {
  return {
    type: actionTypes.SET_CONTRACT,
    payload,
  };
};
