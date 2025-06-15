import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.socialInsurance;

export const _getContractWithCode = (rowCode, workShopCode, company_id) =>
  axios.get(api.getContractWithCode(rowCode, workShopCode, company_id));

export const _GET_SOCIALINSURANCE_LIST = (company_id, contract_id) => {
  return axios.get(api.getSocialInsuranceLIst(company_id, contract_id));
};

export const _GET_SOCIALINSURANCE = (id) => {
  return axios.get(api.getSocialInsurance(id));
};
export const _GET_CONTRACT_LIST = (payload) => {
  return axios.get(api.getContractList);
};
export const _GET_ERRORS = (id) => axios.get(api.getErrors(id));

export const _POST = (data) => axios.post(api.post, data);

export const _PUT = (id, data) => axios.put(api.put(id), data);

export const _DELETE = (ids) =>
  axios.delete(api.delete, { data: { ids: ids } });

export const _PUT_STATUS = (id, data) =>
  axios.put(api.putStatus(id), { status: data });

export const _POST_GET_DISKET = (data) => axios.post(api.getDisket, data);

export const _GET_DISKET = (id) => axios.get(api.getDisketById(id));

// get list for print
export const _GET_PRINT_DATA = (id) => axios.get(api.getPrintData(id));

//compare two list
export const _POST_COMPARE = (data) => {
  const config = {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/xls",
    },
  };
  return axios.post(api.compare, data, config);
};

//total two list
export const _POST_TOTAL = (data) => {
  return axios.post(api.total, data);
};

export const _GET_PERSONNEL_REPORT = (id) => {
  return axios.get(api.getPersonnelReport(id));
};

export const _GET_PERSONNEL_REPORT_PRINT = (id) => {
  return axios.get(api.getPersonnelReportPrint(id));
};
