import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.projectProgress;

export const _GET_PROGRESS = (id) => {
  return axios.get(api.getProgress(id));
};

export const _PUT_PROGRESS = (data) => {
  return axios.put(api.putProgress, data);
};
