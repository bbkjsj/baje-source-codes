import axios from "api/appAxios";

import endpoints from "../../endpoints";
const api = endpoints.peymanManagement;

export const _GET_PEYMAN_REPORT_LIST = (id) => {
  return axios.get(api.getPeymanReportList(id));
};

export const _UPDATE_PEYMAN = (data) => {
  return axios.put(api.updatePeyman, data);
};

export const _GET_SINGLE_PEYMAN_REPORT = (id) => {
  return axios.get(api.getSinglePeymanReport(id));
};
