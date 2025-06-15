import axios from "api/appAxios";
import { endpoints } from "./constant";

export const GET_LIST = async ({ id, type }) => {
  return await axios.get(endpoints.getList({ id, type }));
};

export const DELETE_CONTRACT = async (ids) => {
  return await axios.delete(endpoints.delete, { data: { ids } });
};

export const ADD_CONTRACT = async (paylaod) => {
  return await axios.post(endpoints.add, paylaod);
};

export const EDIT_CONTRACT = async (paylaod, id) => {
  return await axios.put(endpoints.edit(id), paylaod);
};

export const GET_CONTRACT = async (paylaod) => {
  return await axios.get(endpoints.get(paylaod));
};

export const GET_COMPANIES = async () => {
  return await axios.get(endpoints.getCompanies);
};

export const EDIT_CONTRACT_STATUS = async (id, paylaod) => {
  return await axios.put(endpoints.editStatus(id), paylaod);
};
