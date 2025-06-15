import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.realPerson;

// check exist person in db
const checkNationalNumber = (nationalNumber) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.checkNationalNumber(nationalNumber))
      .then((res) => {
        reject();
      })
      .catch((err) => {
        resolve();
      });
  });
};

const checkInsuranceNumber = (insuranceNumber) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.checkInsuranceNumber(insuranceNumber))
      .then((res) => {
        reject();
      })
      .catch((err) => {
        resolve();
      });
  });
};

const getAllPermission = () => {
  return new Promise((resole, reject) => {
    axios
      .get(api.getAllPermission)
      .then((res) => {
        resole(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const newRealPerson = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.newRealPerson, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const editRealPerson = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.editRealPerson, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getSingleRealPerson = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(api.getSingleRealPerson(id))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const searchPersonnel = (codeMelli) => {
  return new Promise((resolve, reject) => {
    axios
      .post(api.searchPersonnel(codeMelli))
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  checkNationalNumber,
  checkInsuranceNumber,
  getAllPermission,
  newRealPerson,
  getSingleRealPerson,
  editRealPerson,
};
