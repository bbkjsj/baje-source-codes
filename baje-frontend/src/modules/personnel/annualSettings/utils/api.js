import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.annualSettings;

export const _GET = () => {
  return axios.get(api.get);
};

export const _POST = (data) => {
  return axios.post(api.post, data);
};

export const _PUT = (id, data) => {
  return axios.put(api.put(id), data);
};

export const _DELETE = (id) => {
  return axios.delete(api.delete, { data: { ids: id } });
};

export const _GET_ITEM = (id) => {
  return axios.get(api.getItem(id));
};
