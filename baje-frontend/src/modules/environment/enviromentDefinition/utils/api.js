import axios from "api/appAxios";

const rootURL = "/api/v1/baje";

const conf = {
  headers: {
    Accept: "application/json",
  },
};

function endpoint(url) {
  return rootURL + url;
}

export const _GET = () => {
  return axios.get(endpoint("/environment"));
};

export const _POST = (data) => {
  return axios.post(endpoint("/environment"), data);
};

export const _PUT = (id, data) => {
  return axios.patch(endpoint("/environment/" + id), data);
};

export const _DELETE = (id) => {
  return axios.delete(endpoint("/environment/" + id));
};

export const _GET_ITEM = (id) => {
  return axios.get(endpoint("/environment/flow/") + id);
};
