import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.committee;

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

//=========================================

export const _GET_MEMBER = async (wid) => {
  return axios.get(api.getMembers(wid));
};

export const _POST_MEMBER = async (data) => {
  return axios.post(api.postMember, data);
};

export const _PUT_MEMBER = async (id, data) => {
  return axios.put(api.putMember(id), data);
};

export const _DELETE_MEMBER = async (id) => {
  return axios.delete(api.deleteMember, { data: { ids: id } });
};

export const _GET_ITEM_MEMBER = async (id) => {
  return axios.get(api.getMemberItem(id));
};

export const _CHECK_MEMBER_COMMITTEE_DEPENDENCY = async (id, wid = "-1") => {
  return axios.get(api.checkMemberCommitteeDependency(id, wid));
};

export const _CHECK_MEMBER_EXCELLENT_DEPENDENCY = async (id) => {
  return axios.get(api.checkMemberExcellentDependency(id));
};

export const _SET_AS_EXPIRED = async (id) => {
  return axios.put(api.setAsExpired(id), {});
};
