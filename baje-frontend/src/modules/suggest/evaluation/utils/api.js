import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.evaluation;

export const _POST = async (data) => {
  return axios({
    method: "post",
    url: api.post,
    data,
  });
};

export const _GET_ITEM = async (id) => {
  return axios.get(api.getItem(id));
};
