import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.category;

export const _GET = async () => {
  return axios.get(api.get);
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

export const _CHECK_SUGGESTION_DEPENDENCY = async (name) => {
  return axios.get(api.checkSuggestionDependency(name));
};
