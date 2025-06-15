import axios from "api/appAxios";
import endpoints from "../endpoints";
const api = endpoints.auth;

export const _GET_PHONE = (body) => {
  return axios.post(api.getPhone, body);
};

export const _VERIFY = (body) => {
  return axios.post(api.verify, body);
};

export const _REGISTER = (body) => {
  return axios.post(api.register, body);
};
