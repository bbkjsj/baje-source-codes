import axios from "api/appAxios";
import { endpoints } from "../constant";

export const GET_PERSON = async (id) => {
  return await axios.get(endpoints.realPerson.get(id));
};

export const UPDATE_SUBORDINATE = async (id, payload) => {
  return await axios.put("/api/v1/baje/family", payload);
};

export const ADD_SUBORDINATE = async (payload) => {
  return await axios.post("/api/v1/baje/family", payload);
};

export const DELETE_SUBORDINATE = async (id) => {
  return await axios.delete(endpoints.subordinate.delete(id));
};

export const VALIDATE_NID = async (nid) => {
  return await axios.post(endpoints.realPerson.validate, { nationalCode: nid });
};

export const GET_FAMILY = async (id) => {
  return await axios.get(endpoints.realPerson.getFamily(id));
};

export const GET_FAMILY_LIST = async (id) => {
  return await axios.get(endpoints.realPerson.getBrief(id));
};

export const DELETE_FAMILY = async (payload) => {
  return await axios.delete("/api/v1/baje/family/" + payload.relativeId);
};

export const SWAP_FAMILY = async (payload) => {
  return await axios.post("/api/v1/baje/family/swap", payload);
};

export const UPDATE_PERSON_STATUS = async (id, payload) => {
  return await axios.patch("/api/v1/baje/personnel/" + id, payload);
};
