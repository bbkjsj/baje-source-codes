import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.rightFull;

const checkNationalId = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.checkNationalId(id))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const checkFinanceCode = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.checkFinanceCode(id))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const newRightFull = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.newRightFull, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSingleRightFull = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.getSingleRightFull(id))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export { newRightFull, checkFinanceCode, checkNationalId, getSingleRightFull };
