import axios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.accidentInsurance;

const _GET = async (company_id, filter) => {
  return axios.get(api.get(company_id, filter));
};

const _GET_GENERAL_INFO = async (id) => {
  return axios.get(api.getGeneralInfo(id));
};

const _POST = async (data) => {
  return axios.post(api.post, data);
};

const _PUT = async (data, id) => {
  return axios.put(api.put(id), data);
};

const _DELETE = async (id) => {
  return axios.delete(api.delete, { data: { ids: id } });
};

const _GET_BY_ID = async (id) => {
  return axios.get(api.getById(id));
};

const _GET_ExcelReport = () => {
  const config = {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/xls",
    },
  };
  return axios.get(api.getExcelReport, config);
};

export const _POST_importDeductionExcel = (data) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return axios.post(api.importDeductionExcel, data, config);
};

const _GET_FILE = async (id) => {
  const config = {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
    },
  };

  return axios.get(api.getFile(id), config);
};

export {
  _GET,
  _PUT,
  _DELETE,
  _GET_BY_ID,
  _POST,
  _GET_ExcelReport,
  _GET_FILE,
  _GET_GENERAL_INFO,
};
