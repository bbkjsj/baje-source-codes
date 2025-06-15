import api from "api/appAxios";

const rootURL = "/api/v1/wb";

function endpoint(url) {
  return rootURL + url;
}

// user

export function getUser() {
  return api.get(rootURL);
}

export function getCurrentUser() {
  return api.get(endpoint("/user"));
}

export function getUserSubordinates() {
  return api.get(endpoint("/user/subordinates"));
}

export function createSubordinate(data) {
  return api.post(endpoint("/user/subordinate"), data);
}

export function editSubordinate(id, data) {
  return api.put(endpoint("/user/subordinate/" + id), data);
}

export function uploadSubordinateFiles(data) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return api.post(endpoint("/user/subordinateUpload"), data, config);
}

export function getPersonData(id) {
  return api.get(`/api/v1/baje/personnel/${id}`);
}

// insurance

export function getCompanyInsurances(companyId) {
  return api.get(endpoint("/insurance/insuranceByCompany/" + companyId));
}

export function getInsurance(insuranceId) {
  return api.get(endpoint("/insurance/details/" + insuranceId));
}

export function getUserInsurancesList() {
  return api.get(endpoint("/insurance"));
}

export function getUserInsurance(insuranceId) {
  return api.get(endpoint("/insurance/" + insuranceId));
}

export function addInsurance(data) {
  return api.post(endpoint("/insurance"), data);
}

export function editInsurance(insuranceId, data) {
  return api.put(endpoint("/insurance/" + insuranceId), data);
}

export function deleteInsurance(insuranceId) {
  return api.delete(endpoint("/insurance/" + insuranceId));
}
