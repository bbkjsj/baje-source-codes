import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.problemReport;

export const _GET = async () => {
  return axios.get(api.get);
};

export const _GET_BY_SURVEY = async (id) => {
  return axios.get(api.getBySurvey(id));
};

export const _POST = async (data) => {
  return axios.post(api.post, data);
};

export const _PUT = async (id, data) => {
  return axios.put(api.put(id), data);
};

export const _DELETE = async (id) => {
  return axios.delete(api.delete, { data: { ids: id } });
};

export const _GET_ITEM = async (id) => {
  return axios.get(api.getItem(id));
};
