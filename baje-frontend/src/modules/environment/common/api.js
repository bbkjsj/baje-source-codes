import { message } from "antd";
import api from "api/appAxios";
import endpoints from "modules/personnel/endpoints";

const rootURL = "/api/v1/baje";

const conf = {
  headers: {
    Accept: "application/json",
  },
};

function endpoint(url) {
  return rootURL + url;
}

export function getEnvironmentUsageList() {
  return api.get(endpoint("/environment/usage/list"));
}

export function getEnvironmentUsage(id) {
  return api.get(endpoint("/environment/usage/list/" + id));
}

export function createEnvironmentUsage(data) {
  return api.post(endpoint("/environment/usage"), data);
}

export function updateEnvironmentUsage(data, id) {
  return api.patch(endpoint("/environment/usage/" + id), data);
}

export function deleteEnvironmentUsage(id) {
  return api.delete(endpoint("/environment/usage/" + id));
}
