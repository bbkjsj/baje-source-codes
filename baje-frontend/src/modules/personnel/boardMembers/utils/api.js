import api from "api/appAxios";

const rootURL = "/api/v1/baje/company/board-members";

function endpoint(url) {
  return rootURL + url;
}

export function getBoardMembersList(company_id) {
  return api.get(endpoint("/by-company/" + company_id));
}

export function addBoardMember(data) {
  return api.post(endpoint(""), data);
}

export function updateBoardMember(data, id) {
  return api.patch(endpoint("/" + id), data);
}

export function deleteBoardMember(id) {
  return api.delete(endpoint("/" + id));
}

export function getBoardMember(id) {
  return api.get(endpoint("/by-id/" + id));
}

export function getBoardMemberByPersonId(id) {
  return api.get(endpoint("/by-person/" + id));
}
