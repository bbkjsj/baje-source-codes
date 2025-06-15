import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.configuration;

export const _GET = async () => {
  return axios.get(api.get);
};

export const _POST = async (data) => {
  return axios.post(api.post, data);
};
