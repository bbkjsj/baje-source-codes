import axios from "api/appAxios";
import endpoints from "../../../endpoints";
const api = endpoints.socialInsurance.personnel;

export const _PUT_INSURANCE_NUMBER = ({ id, payload }) => {
  return axios.put(api.putInsuranceNumber(id), payload);
};
export const _GET_COMPANY_ID = (id) => {
  return axios.get(api.getCompanyId(id));
};
export const _PUT_JOB = ({ id, payload }) => {
  return axios.put(api.putJob(id), payload);
};
export const _GET_COMPANY_PERSONNEL = (currentOffice) => {
  return axios.get(api.getCompanyPersonnel(currentOffice));
};

export const _GET = (id) => {
  return axios.get(api.getById(id));
};

export const _GET_ALL = () => {
  return axios.get(api.get);
};

export const _POST = (data) => {
  return axios.post(api.post, data);
};

export const _PUT = (id, data) => {
  return axios.put(api.put(id), data);
};

export const _DELETE = (id) => {
  return axios.delete(api.delete, { data: { ids: id } });
};

export const _GET_ITEM = (id) => {
  return axios.get(api.getItem(id));
};

export const _GET_PERSON = (id) => {
  return axios.get(api.getPerson(id));
};

export const _POST_copyList = (data) => axios.post(api.copyList, data);

export const _POST_importExcel = (data) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(api.importExcel, data, config);
};

export const _POST_DBF_GROUP_PERSON = (data) => {
  return axios.post(api.dbfGroupPerson, data);
};
export const _POST_EXCEL_GROUP_PERSON = (data) => {
  return axios.post(api.excelGroupPerson, data);
};
export const _DELETE_All = (id) => axios.delete(api.deleteAll(id));
