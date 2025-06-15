import api from "api/appAxios";

const rootURL = "/api/v1/baje";

export function endpoint(url) {
  return rootURL + url;
}

export function getPermissionsList() {
  return api.get(endpoint("/access"));
}

export function updatePermissionStatus(id, newStatus) {
  return api.put(endpoint(`/access/status/${id}`), { enable: newStatus });
}

export function addPermissionPrerequisites(body) {
  return api.post(endpoint("/access/prerequisite"), body);
}

export function getPermissionPrerequisites(id) {
  return api.get(endpoint("/access/prerequisite/" + id));
}

export function assignPermissionsToUser(body) {
  return api.post(endpoint("/access"), body);
}

export function getUserPermissions(id) {
  return api.get(
    endpoint(id !== "all" ? "/access/personnel/" + id : "/access/personnel")
  );
}

export function deleteUserPermission(body) {
  return api.delete(endpoint("/access/personnel"), { data: body });
}

export function updateUserPermission(body, id) {
  return api.put(endpoint("/access/personnel/" + id), body);
}

export function getPermissionJobs(code) {
  return api.get(endpoint("/jobs/permission/by-code/" + code));
}
