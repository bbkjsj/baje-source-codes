import api from "api/appAxios";

const rootURL = "/api/v1/baje/jobs";

const conf = {
  headers: {
    Accept: "application/json",
  },
};

function endpoint(url) {
  return rootURL + url;
}

export function getChartsList(/*company_id, page*/) {
  return api.get(
    endpoint("/chart")
  ); /*, {
    params: {
       company_id,
       page: page || 1,
     },
   });*/
}

export function createChart(data) {
  return api.post(endpoint("/chart"), data);
}

export function updateChart(data, id) {
  return api.patch(endpoint("/chart/" + id), data);
}

export function addChildNode(data, id) {
  return api.patch(endpoint("/chart/node/add-child/" + id), data);
}

export function updateNode(data, id) {
  return api.patch(endpoint("/chart/node/" + id), data);
}

export function deleteChartNode(id) {
  return api.delete(endpoint("/chart/node/" + id));
}

export function updateChartStatus(data, id) {
  return api.put(endpoint("/charts/status/" + id), data);
}

export function deleteChart(id) {
  return api.delete(endpoint("/chart/" + id));
}

export function cloneChart(id) {
  return api.get(endpoint("/shift/copy/from/" + id));
}

export function getChart(id) {
  return api.get(endpoint("/chart/" + id));
}
