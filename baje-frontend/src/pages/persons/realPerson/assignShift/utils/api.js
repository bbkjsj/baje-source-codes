import api from "api/appAxios";

const rootURL = "/api/v1/baje";

function endpoint(url) {
  return rootURL + url;
}

export function getAssignedShift(id) {
  return api.get(endpoint("/jobs/shift/personnel/" + id));
}

export function assignNewShift(data) {
  return api.post(endpoint("/personnel/shift"), data);
}

export function updateAssignedShift(data) {
  return api.put(endpoint("/personnel/shift"), data);
}
