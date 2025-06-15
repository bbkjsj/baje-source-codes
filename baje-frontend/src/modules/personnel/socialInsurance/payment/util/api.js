import axios from "api/appAxios";
import endpoints from "../../../endpoints";
const api = endpoints.socialInsurance.payments;

export const _POST = (data) => axios.post(api.post, data);
export const _GET = (insuranceID) => axios.get(api.get);
export const _DELETE = (ids) =>
  axios.delete(api.delete, { data: { ids: ids } });

export const _GET_BY_ID = (id) => axios.get(api.getById(id));
export const _PUT = (id, data) => axios.put(api.put(id), data);

export const _PUT_STATUS = (id, data) =>
  axios.put(api.putStatus(id), { status: data });

export const _GET_PERSON_CONTRACTS = (contractID) =>
  axios.get(api.getPersonContracts(contractID));
