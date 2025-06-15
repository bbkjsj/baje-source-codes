const endpoints = {
  accidentInsurance: {
    get: (companyId, filter) => `/api/insurance/list/${companyId}/${filter}`,
    getGeneralInfo: (id) => `/api/insurance/detail/${id}`,
    post: "/api/insurance",
    put: (id) => `/api/insurance/${id}`,
    delete: "/api/insurance",
    getById: (id) => `/api/insurance/${id}`,
    getExcelReport: "/api/insurance/main/report",
    importDeductionExcel: "/api/admin/personnel/salary/deduct", //post
    getFile: (id) => `/api/insurance/pdf/${id}`,
  },
  accidentReport: {
    getUser: (nationalId) => `/api/admin/personnel/lookup/${nationalId}`,
    getMachine: (machineCode) => `/api/admin/vehicle/lookup/${machineCode}`,
    post: `/api/admin/incident`,
    get: "/api/admin/incident",
    getSingle: (id) => `/api/admin/incident/${id}`,
    put: "/api/admin/incident",
    delete: "/api/admin/incident",
  },
  annualSettings: {
    get: "/api/admin/hr/variables/annual",
    post: "/api/admin/hr/variables/annual",
    put: (id) => `/api/admin/hr/variables/annual/${id}`,
    delete: "/api/admin/hr/variables/annual",
    getItem: (id) => `/api/admin/hr/variables/annual/${id}`,
  },
  doctor: {
    checkNationalNumber: (nationalNumber) =>
      `/api/admin/personnel/lookup/${nationalNumber}`,
  },
  insurance: {
    thirdPartyInsurance: {
      get: "/api/v1/baje/insurance/third-party",
      post: "/api/v1/baje/insurance/third-party",
      put: (id) => `/api/v1/baje/insurance/third-party/${id}`,
      delete: (id) => `/api/v1/baje/insurance/third-party/${id}`,
      getItem: (id) => `/api/v1/baje/insurance/third-party/${id}`,
      changeStatus: (id) => `/api/v1/baje/insurance/third-party/${id}`,
    },
  },
  jobs: {
    get: (id) => `/api/insurance/tamin/person`,
    post: "/api/insurance/tamin/person",
    put: (id) => `/api/insurance/tamin/person/${id}`,
    delete: "api/insurance/tamin/person",
    getItem: (id) => `/api/insurance/tamin/person/${id}`,
    getPerson: (id) => `api/admin/personnel/${id}`,
    copyList: "/api/insurance/tamin/copy", //post
    importExcel: "/api/insurance/persons/add/file", //post
    deleteAll: (id) => `/api/insurance/tamin/remove/all/${id}`,
  },
  realPerson: {
    myName: "daniel",
    checkNationalNumber: (nationalNumber) =>
      `/api/admin/personnel/lookup/${nationalNumber}`,
    checkInsuranceNumber: (insuranceNumber) =>
      `/api/admin/personnel/lookup/insurance/${insuranceNumber}`,
    getAllPermission: "/api/admin/personnel/permissions",
    newRealPerson: "/api/admin/personnel/person",
    editRealPerson: "/api/admin/personnel/edit",
    getSingleRealPerson: (id) => `/api/v1/baje/personnel/${id}`,
    searchPersonnel: (nationalNumber) =>
      `/api/search/personnel/${nationalNumber}`,
    checkout: {
      get: "/api/admin/settle",
      post: "/api/admin/settle",
      put: (id) => `/api/admin/settle/${id}`,
      delete: "/api/admin/settle",
      getItem: (id) => `/api/admin/settle/${id}`,
      changeStatus: (id) => `/api/admin/settle/status/${id}`, //put
    },
    examination: {
      post: "/api/visit",
    },
    leaveRequest: {
      get: "/api/v1/baje/time-off",
      post: "/api/v1/baje/time-off",
      put: (id) => `/api/v1/baje/time-off/${id}`,
      changeStatus: (id) => `/api/v1/baje/time-off/status/${id}`, //put
      delete: "/api/v1/baje/time-off",
      getItem: (id) => `/api/v1/baje/time-off/${id}`,
    },
    loanRequest: {
      get: (userId) => `/api/imprest/${userId}`,
      post: "/api/imprest",
      put: (id) => `/api/imprest/${id}`,
      delete: "/api/imprest",
      getItem: (id) => `/api/imprest/item/${id}`,
    },
    mission: {
      get: "api/v1/baje/mission",
      post: "/api/admin/personnel/mission",
      put: (id) => `/api/admin/personnel/mission/${id}`,
      delete: "/api/admin/personnel/mission",
      getItem: (id) => `/api/admin/personnel/mission/${id}`,
      changeStatus: (id) => `/api/admin/personnel/mission/status/${id}`, //put
    },
    recordClaim: {
      post: "/api/hclaim",
      get: (id) => `/api/hclaim/item/${id}`,
      delete: "/api/hclaim",
      changeStatus: (id) => `/api/hclaim/status/${id}`, //put
      getUserDataProject: (nationalId) => `/api/hclaim/${nationalId}`,
    },
    service: {
      post: "/api/v1/baje/damage-service",
    },
    verifyNationalIds: "api/v1/baje/personnel/availability",
  },
  rightFull: {
    checkNationalId: (id) =>
      `/api/admin/personnel/legal/check/nationalid/${id}`,
    checkFinanceCode: (id) =>
      `/api/admin/personnel/legal/check/financecode/${id}`,
    newRightFull: "/api/admin/personnel/legal", //post
    getSingleRightFull: (id) => `/api/admin/personnel/legal/${id}`,
  },
  shiftWork: {
    post: "/api/v1/baje/jobs/shift",
    get: "/api/v1/baje/jobs/shift",
    getItem: (id) => `/api/v1/baje/jobs/shift/detail/${id}`,
    delete: (id) => `/api/v1/baje/jobs/shift/${id}`,
    put: (id) => `/api/v1/baje/jobs/shift/${id}`,
  },
  socialInsurance: {
    getContractWithCode: (rowCode, workShopCode, company_id) =>
      `/api/admin/contract/find/${workShopCode}/${rowCode}/${company_id}`,
    getSocialInsuranceLIst: (company_id, contract_id) =>
      `/api/insurance/tamin/${company_id}/${contract_id}`,
    getSocialInsurance: (id) => `/api/insurance/tamin/detail/${id}`,
    getContractList: `/api/v1/baje/contract/list/main`,
    getErrors: (id) => `/api/insurance/tamin/check/${id}`,
    post: "/api/insurance/tamin",
    put: (id) => `/api/insurance/tamin/${id}`,
    delete: "/api/insurance/tamin",
    putStatus: (id) => `/api/insurance/tamin/status/${id}`,
    getDisket: "/api/insurance/tamin/disk", //post
    getDisketById: (id) => `/api/insurance/tamin/disk/${id}`, //post
    getPrintData: (id) => `/api/insurance/tamin/list/${id}`,
    compare: "/api/insurance/tamin/compare", //post
    total: "/api/insurance/tamin/su", //post
    getPersonnelReport: (id) => `/api/insurance/tamin/report/individual/${id}`,
    getPersonnelReportPrint: (id) => `/api/insurance/tamin/report/person/${id}`,
    payments: {
      post: "/api/insurance/payment",
      get: "/api/insurance/payment",
      delete: "/api/insurance/payment",
      getById: (id) => `/api/insurance/payment/${id}`,
      put: (id) => `/api/insurance/payment/${id}`,
      putStatus: (id) => `/api/insurance/payment/status/${id}`,
      getPersonContracts: (contractId) =>
        `/api/hclaim/filter/ثبت فرم/${contractId}`,
    },
    personnel: {
      putInsuranceNumber: (id) => `/api/admin/personnel/add/insurance/${id}`,
      getCompanyId: (id) => `api/insurance/tamin/get/company/${id}`,
      putJob: (id) => `/api/admin/personnel/add/job/${id}`,
      getCompanyPersonnel: (currentOffice) =>
        `/api/v1/baje/personnel/list/${currentOffice}/-1`,
      getById: (id) => `api/insurance/tamin/persons/${id}`,
      get: "api/insurance/tamin/person",
      post: "/api/insurance/tamin/person",
      put: (id) => `/api/insurance/tamin/person/${id}`,
      delete: "api/insurance/tamin/person",
      getItem: (id) => `/api/insurance/tamin/person/${id}`,
      getPerson: (id) => `api/admin/personnel/${id}`,
      copyList: "/api/insurance/tamin/copy", //post
      importExcel: "/api/insurance/persons/add/file", //post
      dbfGroupPerson: "/api/admin/personnel/tamin/dbf", //post
      excelGroupPerson: "/api/admin/personnel/tamin/excel", //post
      deleteAll: (id) => `/api/insurance/tamin/remove/all/${id}`,
    },
  },
  supplementaryInsurance: {
    get: (company_id, filter) => `/api/insurance/list/${company_id}/${filter}`,
    getGeneralInfo: (id) => `/api/insurance/detail/${id}`,
    post: "/api/insurance",
    put: (id) => `/api/insurance/${id}`,
    delete: "/api/insurance",
    getById: (id) => `/api/insurance/${id}`,
    excelReport: "/api/insurance/main/report",
    importDeductionExcel: "/api/admin/personnel/salary/deduct", //post
    getFile: (id) => `/api/insurance/pdf/${id}`,
    updateInsuranceStatus: (id) => `api/insurance/approve/${id}`, //put
    deductions: {
      post: "/api/insurance/deduction",
      put: (id) => `/api/insurance/deduction/${id}`,
      get: (personnelId) => `/api/insurance/deduction/personnel/${personnelId}`,
      getById: (id) => `/api/insurance/deduction/${id}`,
      delete: "/api/insurance/deduction/delete",
    },
    person: {
      post: "/api/insurance/person/add",
      postSubordinate: "api/insurance/person/subordinate",
      put: (id) => `/api/insurance/person/edit/${id}`,
      putSubordinate: (id) => `/api/insurance/person/subordinate/${id}`,
      delete: "/api/insurance/person/delete",
      deleteSubordinate: "api/insurance/takmili/subordinate/remove",
      get: (id) => `/api/v1/baje/insurance/takmili/personnel/${id}`,
      excel: (id) => `/api/v1/baje/insurance/takmili/personnel/${id}/excel`,
      getCompanyPersonnel: (currentOffice) =>
        `/api/v1/baje/personnel/list/${currentOffice}/-1`,
      getById: (id) => `/api/insurance/history/${id}`,
      getByTypeId: (type, id) => `/api/insurance/history/${type}/${id}`,
      postIntroLetter: "/api/insurance/introletter", //post
      getIntroLetter: (id) => `/api/insurance/introletter/${id}`,
      postCopyList: "/api/insurance/person/copy",
      importExcel: "/api/insurance/persons/add/file", //post
      updatePersonStatus: (id) => `/api/insurance/persons/${id}/status`,
    },
  },
  jobsAndCharts: {
    jobs: "/api/v1/baje/jobs",
    job: (id) => `/api/v1/baje/jobs/${id}`,
  },
  resume: {
    list: "/api/v1/baje/personnel/jobs/person",
  },
};

export default endpoints;
