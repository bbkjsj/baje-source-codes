import axios from "api/appAxios";
import endpoints from "../../../endpoints";
const api = endpoints.supplementaryInsurance.deductions;

export const _POST = (data) => axios.post(api.post, data);
export const _PUT = (id, data) => axios.put(api.put(id), data);
export const _GET = (personnel_id) => axios.get(api.get(personnel_id));
export const _GET_BY_ID = (id) => axios.get(api.getById(id));
export const _DELETE = (ids) =>
  axios.delete(api.delete, { data: { ids: ids } });
