import axios from "api/appAxios";

export const _POST_LOGIN = (data) => {
  return axios.post("/api/v1/baje/sign", data);
};

export const _POST_VERIFY_CODE = (data) => {
  return axios.post("/api/v1/baje/sign/verify", data);
};
