import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.productionReport;

export const _GET_PRODUCTION_REPORT_LIST = (id) => {
  return axios.get(api.getProductionReportList(id));
};

export const _UPDATE_PRODUCTION = (data) => {
  return axios.put(api.updateProduction, data);
};

export const _GET_SINGLE_PRODUCTION_REPORT = (id) => {
  return axios.get(api.getSingleProductionReport(id));
};
