import api from "api/appAxios";

const rootURL = "/api/v1/baje/personnel";

const conf = {
  headers: {
    Accept: "application/json",
  },
};

function endpoint(url) {
  return rootURL + url;
}

export function getResumeList(personnel_id) {
  return api.get(endpoint(`/jobs/person/${personnel_id}`));
}

export function createResume(data) {
  return api.post(endpoint("/jobs"), data);
}

export function updateResume(data, id) {
  return api.patch(endpoint("/jobs/" + id), data);
}

export function deleteResume(id) {
  return api.delete(endpoint("/jobs/" + id));
}

export function getResume(id) {
  return api.get(endpoint("/jobs/" + id));
}
