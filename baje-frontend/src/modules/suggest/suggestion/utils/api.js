import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.suggestion;

export const _GET = async () => {
  return axios.get(api.get);
};

export const _GET_CARTABLE = async (filter) => {
  return axios.get(api.getCartable(filter));
};

export const _GET_PUBLIC = async () => {
  return axios.get(api.getPublic);
};

export const _GET_BY_CALL = async (id) => {
  return axios.get(api.getByCall(id));
};

export const _POST = async (data) => {
  return axios({
    method: "post",
    url: api.post,
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

export const _PUT_PUBLIC = async (id, data) => {
  return axios({
    method: "put",
    url: api.putPublic(id),
    data,
  });
};

export const _DELETE = async (id) => {
  return axios.delete(api.delete, {
    data: { ids: id },
  });
};

export const _DELETE_PUBLIC = async (id) => {
  return axios.delete(api.deletePublic, {
    data: { ids: id },
  });
};

export const _GET_ITEM = async (id) => {
  return axios.get(api.getItem(id));
};

export const _GET_ITEM_PUBLIC = async (id) => {
  return axios.get(api.getItemPublic(id));
};

export const _GET_PERSONNEL = async (id) => {
  return axios.get(api.getPersonnel(id));
};

export const _CHANGE_STATUS = async (suggestId, data) => {
  return axios({
    method: "put",
    url: api.changeStatus(suggestId),
    data: data,
  });
};

export const _CHANGE_STATUS_PUBLIC = async (suggestId, data) => {
  return axios({
    method: "put",
    url: api.changeStatusPublic(suggestId),
    data: data,
  });
};

export const _STARTER_REVIEW_REQUEST = async (id) => {
  return axios.put(api.starterReviewRequest(id));
};

export const _CHANGE_COMMITTEE = async (id, workgroupId) => {
  return axios({
    method: "put",
    url: api.changeCommittee(id),
    data: { workgroup_id: workgroupId },
  });
};

export const _EXCELLENT_COMMITTEE_VOTE = async (data) => {
  return axios({
    method: "post",
    url: api.excellentCommitteeVote,
    data,
  });
};

export const _GET_SCORES = async (id) => {
  return axios.get(api.getScores(id));
};
export const _GET_PUBLIC_SCORES = async (id) => {
  return axios.get(api.getPublicScores(id));
};

export const _GET_UPCOMING_CALLS = async () => {
  return axios.get(api.getUpcomingCalls);
};

export const _POST_SUBSCRIBE_CALL = async (body) => {
  return axios.post(api.subscribeCall, body);
};

export const _GET_COMPANIES = async () => {
  return axios.get(api.getCompanies);
};

export const _GET_WORKGROUP_REJECT_REASON = async (id) => {
  return axios.get(api.getWorkgroupRejectReason(id));
};

export const _SET_AS_SEEN = async (id) => {
  return axios({
    method: "put",
    url: api.setAsSeen(id),
  });
};

export const _SET_AS_SEEN_PUBLIC = async (id) => {
  return axios({
    method: "put",
    url: api.setAsSeenPublic(id),
  });
};

export const _RESET_EXCELLENT_NEGATIVE_VOTES = async (id) => {
  return axios({
    method: "post",
    url: api.resetExcellentNegativeVotes(id),
    data: { survey_id: id },
  });
};

export const _GET_UNREAD_COUNT = async () => {
  return axios({
    method: "get",
    url: api.getUnreadCount,
  });
};

export const _GET_UNREAD_COUNT_PUBLIC = async () => {
  return axios({
    method: "get",
    url: api.getUnreadCountPublic,
  });
};

export const _GET_EXECUTION_INFO = async (id) => {
  return axios({
    method: "get",
    url: api.getExecutionInfo(id),
  });
};

export const _GET_STATUS_LOG = async (id) => {
  return axios({
    method: "get",
    url: api.getStatusLog(id),
  });
};

export const _GET_STATUS_LOG_PUBLIC = async (id) => {
  return axios({
    method: "get",
    url: api.getStatusLogPublic(id),
  });
};

export const _GET_PERSONNEL_INFO = async (id) => {
  return axios({
    method: "get",
    url: api.getPersonnelInfo(id),
  });
};

export const _SET_AS_PENDING = async (id, data) => {
  return axios({
    method: "put",
    url: api.setAsPending(id),
    data,
  });
};
