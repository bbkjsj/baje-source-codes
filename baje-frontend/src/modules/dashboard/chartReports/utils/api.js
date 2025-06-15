import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.chartReports;

export const _GET_REPORTS_CONTRACTS = (payload) => {
  return axios.post(api.getReportContracts, payload);
};

export const _Get_CHART_DATA = (url, payload) => {
  return axios.post(api.getChartData(url), payload);
};
