import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.forum;

export const _GET = async () => {
  return axios.get(api.get);
};

export const _POST_POINT = async (data) => {
  return axios({
    method: "post",
    url: api.postPoint,
    data,
  });
};

export const _POST_COMMENT = async (data) => {
  return axios({
    method: "post",
    url: api.postComment,
    data,
  });
};

export const _POST_REACTION = async (data) => {
  return axios({
    method: "post",
    url: api.postReaction,
    data,
  });
};

export const _POST_REACTION_COMMENT = async (data) => {
  return axios({
    method: "post",
    url: api.postReactionComment,
    data,
  });
};

export const _PUT = async (id, data) => {
  return axios({
    method: "put",
    url: api.put(id),
    data,
  });
};

export const _DELETE = async (id) => {
  return axios.delete(api.delete, {
    data: { ids: id },
  });
};

export const _DELETE_POINTS = async (id) => {
  return axios.delete(api.deletePoints(id));
};

export const _GET_ITEM = async (id) => {
  return axios.get(api.getItem(id));
};

export const _GET_PERSONNEL = async (id) => {
  return axios.get(api.getPersonnel(id));
};
