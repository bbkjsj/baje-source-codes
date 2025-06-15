import axios from "api/appAxios";
import { insurancePolicyTypeValues } from "modules/personnel/SupplementaryInsurance/const";

export const getUserDataWithSubordinate = (nationalId, insuranceType) => {
  return axios.post(`api/insurance/person/check`, {
    national_number: nationalId,
    insurance_type:
      insuranceType === insurancePolicyTypeValues.SUPPLEMENTARY
        ? "بیمه تکمیلی"
        : "حادثه",
  });
};

//get server date & time
export const getServerDateTime = () => {
  return axios.get(`/api/common/time`);
};
