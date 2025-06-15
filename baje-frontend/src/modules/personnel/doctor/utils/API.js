import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.doctor;

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

export { checkNationalNumber };
