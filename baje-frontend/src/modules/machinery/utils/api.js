import axios from "api/appAxios";
import { endpoints } from "../constant";
import personnelEndpoints from "modules/personnel/endpoints";
const getSingleRightFull = personnelEndpoints.rightFull.getSingleRightFull;
// machineray
const ADD_MACHINE = async (payload) => {
  //old
  // return await axios.post(endpoints.machine.add, payload);
  //new
  return await axios.post(endpoints.machine.addNew, payload);
};

const ADD_GROUP_MACHINE = async (payload) => {
  return await axios.post(endpoints.machine.addGroup, payload);
};

const EDIT_MACHINE = async (id, payload) => {
  //old--
  // return await axios.post(endpoints.machine.edit, payload);
  return await axios.patch(endpoints.machine.editNew(id), payload);
};

const GET_MACHINE = async (id) => {
  //old
  // await axios.get(endpoints.machine.get(id));
  //new
  return await axios.get(endpoints.machine.getNew(id));
};

const GET_MACHINE_LIST = async (officeID, contractID, environmentId) => {
  //old
  // const res1 = await axios.get(endpoints.machine.getList(officeID, contractID));

  //new
  const params = {};
  if (officeID !== "-1") {
    params.companyId = officeID;
  }

  if (contractID !== "-1") {
    params.contractId = contractID;
  }

  if (environmentId !== "-1") {
    params.environmentId = environmentId;
  }

  const res2 = await axios.get(endpoints.machine.getListNew(), {
    params: params,
  });

  return res2;
};

const GET_ALL_MACHINE = async () => {
  //old
  // await axios.get(endpoints.machine.get(id));
  //new
  return await axios.get(endpoints.machine.getAllList());
};

const DELETE_MACHINE = async (ids) => {
  //new
  return await axios.delete(endpoints.machine.deleteNew, {
    data: { ids },
  });
};

export const GET_COMPANY_INFO = async (id) => {
  return await axios.get(getSingleRightFull(id));
};
//
export const GET_VEHICLE_REFRENCES = async () => {
  return await axios.get(endpoints.machine.getRefrence);
};

// type
const GET_TYPE_LIST = async () => {
  //new
  return await axios.get(endpoints.type.listNew);
};

const ADD_TYPE = async (payload) => {
  //new
  return await axios.post(endpoints.type.addNew, payload);
};

const DELETE_TYPE = async (payload) => {
  //new
  return await axios.delete(endpoints.type.deleteNew, {
    data: { ids: payload },
  });
};

// system
const GET_RELATED_SYSTEM_LIST = async (id) => {
  //new
  return await axios.get(endpoints.system.listNew);
};

const GET_SYSTEM_LIST = async () => {
  //new
  return await axios.get(endpoints.system.listNew);
};

const ADD_SYSTEM = async (payload) => {
  //new
  return await axios.post(endpoints.system.addNew, payload);
};

const EDIT_SYSTEM = async (id, payload) => {
  //new
  return await axios.patch(endpoints.system.editNew(id), payload);
};

const DELETE_SYSTEM = async (payload) => {
  return await axios.delete(endpoints.system.delete, {
    data: { ids: payload },
  });
};

// tip
const GET_RELATED_TIP_LIST = async (id) => {
  return await axios.get(endpoints.tip.getRelatedList(id));
};

const GET_TIP_LIST = async () => {
  return await axios.get(endpoints.tip.list);
};

const ADD_TIP = async (payload) => {
  return await axios.post(endpoints.tip.add, payload);
};

const DELETE_TIP = async (payload) => {
  return await axios.delete(endpoints.tip.delete, { data: { ids: payload } });
};

// contract
const GET_CONTRACT_LIST = async (payload) => {
  return await axios.post(endpoints.contractList, payload);
};

export {
  ADD_MACHINE,
  ADD_GROUP_MACHINE,
  EDIT_MACHINE,
  GET_MACHINE,
  GET_MACHINE_LIST,
  DELETE_MACHINE,
  GET_TYPE_LIST,
  DELETE_TYPE,
  ADD_TYPE,
  GET_RELATED_SYSTEM_LIST,
  GET_SYSTEM_LIST,
  ADD_SYSTEM,
  EDIT_SYSTEM,
  DELETE_SYSTEM,
  GET_TIP_LIST,
  GET_RELATED_TIP_LIST,
  ADD_TIP,
  DELETE_TIP,
  GET_CONTRACT_LIST,
  GET_ALL_MACHINE,
};
