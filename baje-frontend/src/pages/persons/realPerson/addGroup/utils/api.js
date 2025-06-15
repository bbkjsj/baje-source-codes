import axios from "api/appAxios";

export const _POST_MAIN_PERSONS_DBF = (payload) => {
  return axios.post("/api/v1/baje/personnel/dbf", payload);
};

export const _POST_MAIN_PERSONS_EXCEL = (payload) => {
  return axios.post("/api/v1/baje/personnel/excel", payload);
};

export const _POST_SUBORDINATE_PERSONS_EXCEL = (payload) => {
  return axios.post("/api/admin/subordinate/excel", payload);
};
