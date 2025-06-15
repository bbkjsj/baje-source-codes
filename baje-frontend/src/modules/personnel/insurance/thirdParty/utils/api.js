import axios from "api/appAxios";
import Axios from "axios";
import endpoints from "../../../endpoints";
const api = endpoints.insurance.thirdPartyInsurance;

export const _GET = () => {
  return axios.get(api.get);
};

export const _POST = (data) => {
  return axios.post(api.post, data);
};

export const _PUT = (id, data) => {
  return axios.patch(api.put(id), data);
};

export const _DELETE = (id) => {
  return axios.delete(api.delete(id));
};

export const _GET_ITEM = (id) => {
  return axios.get(api.getItem(id));
};

export const _CHANGE_STATUS = (id, data) => {
  return axios.patch(api.changeStatus(id), { status: data });
};

const cpt =
  "aHR0cHM6Ly9zYW5oYWJpbnEuY2VudGluc3VyLmlyL2JhY2svYXBpL2NhcHRjaGFCYXNlNjQ=";
const pth =
  "aHR0cHM6Ly9zYW5oYWJpbnEuY2VudGluc3VyLmlyL2JhY2svYXBpL2lucXVpcnkvR2V0QnlVbmlxdWVJZA==";

export const _GET_CAPTCHA = () => {
  return Axios.get(atob(cpt));
};
export const _POST_INQUIRY = (body) => {
  return Axios.post(atob(pth), body);
};
