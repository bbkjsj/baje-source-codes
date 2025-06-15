import axios from "api/appAxios";
import endpoints from "../../../endpoints";
const api = endpoints.realPerson.loanRequest;

export const _GET = (user_id) => {
  return axios.get(api.get(user_id));
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
