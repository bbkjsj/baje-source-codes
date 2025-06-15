import axios from "api/appAxios";
import endpoints from "../endpoints";
const api = endpoints.auth;

export const loginSubmit = (inputs) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.login, inputs)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const verifyCode = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.verifyCode, data)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
