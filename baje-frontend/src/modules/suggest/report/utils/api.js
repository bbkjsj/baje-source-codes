import axios from "api/appAxios";
import { reportTypes } from "../const";
import endpoints from "../../endpoints";
const api = endpoints.report;

export const _POST = async (data) => {
  return axios.post(api.post, data);
};

export const _GET_REPORT = async (type, data) => {
  if (
    type === reportTypes.TOTAL ||
    type === reportTypes.COUNT ||
    type === reportTypes.QUALITY
  ) {
    return axios.post(api.getReportUsers(type), data);
  } else {
    return axios.post(api.getReport(type), data);
  }
};
