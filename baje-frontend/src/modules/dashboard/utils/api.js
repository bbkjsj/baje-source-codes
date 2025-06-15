import axios from "api/appAxios";
import endpoints from "../endpoints";
const api = endpoints.misc;

export const _GET_CONTRACTS = (payload) => {
  return axios.post(api.getContracts, payload);
};
