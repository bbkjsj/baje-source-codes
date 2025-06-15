import { message } from "antd";
import api from "api/appAxios";
import endpoints from "modules/personnel/endpoints";

const rootURL = "/api/v1/baje";

const conf = {
  headers: {
    Accept: "application/json",
  },
};

function endpoint(url) {
  return rootURL + url;
}

export function getJobsList(page) {
  return api.get(endpoint("/jobs?page=" + page));
}

export function createJob(data) {
  return api.post(endpoint("/jobs"), data);
}

export function updateJob(data, id) {
  return api.patch(endpoint("/jobs/" + id), data);
}

export function deleteJob(id) {
  return api.delete(endpoint("/jobs/" + id));
}

export function getPermissionsList() {
  return api.get(endpoints.realPerson.getAllPermission);
}

export function getJobInsuranceCodes(id) {
  return api.get(endpoint("/jobs/tamin/" + id));
}

export function submitJobInsuranceCodes(body) {
  return api.post(endpoint("/jobs/tamin"), body);
}

export function getJobPermissions(id) {
  return api.get(endpoint("/jobs/permission/" + id));
}

export function getInsuranceJobCode(id) {
  return api.get("api/jobtitle/" + id);
}

export function getInsuranceJobCodesList(body) {
  return api.post(endpoint("/jobs/title"), body);
}

export function submitJobPermissions(body) {
  return api.post(endpoint("/jobs/permission"), body);
}

export function uploadSubordinateFiles(data) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return api.post(endpoint("/user/subordinateUpload"), data, config);
}

export function getCompanyCharts(id) {
  return api.get(endpoint(`/jobs/${id}/in-company-chart`));
}

// exceptions
const defaultError = "مشکلی پیش آمده است لطفا دوباره تلاش کنید";

export function handleExceptions(errObj) {
  console.error("jobs api error: ", errObj);
}

// success
const defaultMessage = "با موفقیت انجام شد";

export function handleSuccess(res) {
  if (res && res?.data?.message) {
    message.success(res && res?.data?.message);
  } else {
    message.success(defaultMessage);
  }
}
