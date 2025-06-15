import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.accidentReport;

// get user Info
const getUserApi = (nationalId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.getUser(nationalId))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// get machine Info
const getMachineApi = (machineCode) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.getMachine(machineCode))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// send to server
const postAccidentReport = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.post, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAccidentReport = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.get)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSingleAccidentReport = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.getSingle(id))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editAccidentReport = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .put(api.put, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const deleteAccidentReport = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(api.delete, { data: { id: id } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  getUserApi,
  postAccidentReport,
  getMachineApi,
  getAccidentReport,
  getSingleAccidentReport,
  editAccidentReport,
  deleteAccidentReport,
};
