import axios from "api/appAxios";
import endpoints from "../../../endpoints";
const api = endpoints.supplementaryInsurance.person;

export const _POST = (data) => axios.post(api.post, data);

export const _PUT = (id, data) => axios.put(api.put(id), data);

export const _DELETE = (ids) =>
  axios.delete(api.delete, { data: { ids: ids } });

export const _GET = (id) => axios.get(api.get(id)); // insurance id

export const _GET_COMPANY_PERSONNEL = (currentOffice) => {
  return axios.get(api.getCompanyPersonnel(currentOffice));
};

export const _GET_BY_ID = (id) => axios.get(api.getById(id));

export const _POST_IntroLetter = (data) =>
  axios.post(api.postIntroLetter, data);

export const _GET_IntroLetter = (id) => axios.get(api.getIntroLetter(id));
export const _POST_copyList = (data) => axios.post(api.postCopyList, data);
export const _POST_importExcel = (data) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(api.importExcel, data, config);
};

export const _UPDATE_PERSON_STATUS = (id, payload) => {
  const status = payload === true ? "true" : "false";
  return axios.put(api.updatePersonStatus(id), {
    is_approved: status,
  });
};
