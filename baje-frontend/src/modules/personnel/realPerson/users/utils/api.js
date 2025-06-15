import axios from "api/appAxios";
import { endpoints } from "./const";

export const GET_USER_WITH_NATIONAL_NUMBER = async (payload) => {
  return await axios.get(endpoints.getUserWithNationalNumber(payload));
};

export const ADD_USER = async (payload) => {
  return await axios.post(endpoints.addUser, payload);
};

export const UPDATE_USER = async (id, payload) => {
  return await axios.patch(endpoints.updateUser(id), payload);
};

export const GET_USER_ACCESS = async (payload) => {
  return await axios.get(endpoints.getUserPermission(payload));
};

export const UPDATE_USER_PERMISSION = async (id, payload) => {
  return await axios.patch(endpoints.updateUserPermission(id), {
    data: payload,
  });
};

export const UPDATE_USER_DOCUMENT = async (id, payload) => {
  return await axios.patch(endpoints.updateUserDocument(id), payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const GET_USER = async (payload) => {
  return await axios.get(endpoints.getUser(payload));
};

export const CHECK_INSURANCE_NUMBER = async (insuranceNumber) => {
  return await axios.get(endpoints.checkInsuranceNumber(insuranceNumber));
};

export const GET_PERMISSIONS = async () => {
  return await axios.get(endpoints.getPermissios);
};

export const GET_NEW_PERMISSIONS = async () => {
  return await axios.get(endpoints.getNewPermissios);
};
