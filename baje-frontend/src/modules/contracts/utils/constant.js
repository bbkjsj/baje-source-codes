export const endpoints = {
  getList: ({ id, type }) =>
    `api/v1/baje/contract/list/${type}${
      id && id != "-1" ? "?companyId=" + id : ""
    }`,
  delete: "api/v1/baje/contract",
  add: "api/v1/baje/contract",
  edit: (id) => "api/v1/baje/contract/" + id,
  get: (id) => `api/v1/baje/contract/${id}`,
  getCompanies: "api/v1/baje/company",
  editStatus: (id) => `api/v1/baje/contract/${id}/status`,
  getExcel: (id, type) =>
    `api/v1/baje/contract/excel/${type}${
      id && id != "-1" ? "?companyId=" + id : ""
    }`,
};

export const aliasContractTypes = {
  MAIN_CONTRACT: "main",
  SUBSIDIARY_CONTRACT: "subsidiary",
};

export const contractTypes = {
  MAIN_CIVIL: "main_civil",
  MAIN_NON_CIVIL: "main_non_civil",
  SUB_CIVIL: "sub_civil",
  SUB_NON_CIVIL: "sub_non_civil",
};

export const initialState = (form) => ({
  loading: false,
  contractType: null,
  mainContractDate: null,
  mainContractFinishDate: null,
  SUBJECT: form.getFieldValue("subject"),
  companies: [],
  contractor: null,
  employer: null,
  manager: null,
  boss: null,
  canNotEdit: false,
  contract: {},
});

export const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_CONTRACT_TYPE: "SET_CONTRACT_TYPE",
  SET_MAIN_CONTRACT_DATE: "SET_MAIN_CONTRACT_DATE",
  SET_MAIN_CONTRACT_FINISH_DATE: "SET_MAIN_CONTRACT_FINISH_DATE",
  SET_SUBJECT: "SET_SUBJECT",
  SET_COMPANIES: "SET_COMPANIES",
  SET_CONTRACTOR: "SET_CONTRACTOR",
  SET_EMPLOYER: "SET_EMPLOYER",
  SET_MANAGER: "SET_MANAGER",
  SET_BOSS: "SET_BOSS",
  SET_CAN_NOT_EDIT: "SET_CAN_NOT_EDIT",
  SET_CONTRACT: "SET_CONTRACT",
};
