import axios from "api/appAxios";
import endpoints from "../../../endpoints";
const api = endpoints.realPerson.leaveRequest;

export const _GET = () => {
  return axios.get(api.get);
};

export const _POST = (data) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(api.post, data, config);
};

export const _PUT = (id, data) => {
  return axios.put(api.put(id), data);
};

export const _CHANGE_STATUS = (id, data) => {
  return axios.put(api.changeStatus(id), { status: data });
};

export const _DELETE = (id) => {
  return axios.delete(api.delete, { data: { ids: id } });
};

export const _GET_ITEM = (id) => {
  return axios.get(api.getItem(id));
};

export const testPromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("success");
    }, 2000);
  });
};
