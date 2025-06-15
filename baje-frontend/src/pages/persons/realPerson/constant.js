export const endpoints = {
  realPerson: {
    get: (id) => `/api/v1/baje/personnel/${id}`,
    validate: `/api/v1/baje/personnel/national-code/validate/`,
    getFamily: (id) => "/api/v1/baje/family/" + id,
    getBrief: (id) => "/api/v1/baje/family/brief/" + id,
  },
  subordinate: {
    add: (id) => `/api/v1/baje/personnel/subordinates/${id}`,
    update: (id) => `/api/v1/baje/personnel/subordinates/${id}`,
    delete: (id) => `/api/v1/baje/personnel/subordinate/${id}`,
  },
};

export const additionalTypes = {
  CONTACT: "CONTACT",
  BANK_ACCOUNTS: "BANK_ACCOUNTS",
  DOCUMENTS: "DOCUMENTS",
  ACCESS_LEVEL: "ACCESS_LEVEL",
  USER_ACCOUNT: "USER_ACCOUNT",
  INSURANCE_INFO: "INSURANCE_INFO",
  OTHER_INFO: "OTHER_INFO",
};
