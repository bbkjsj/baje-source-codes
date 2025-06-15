import securedAxios from "api/appAxios";
import endpoints from "../../endpoints";
const api = endpoints.realPerson.recordClaim;

export const postRecordClaim = (data) => {
  return securedAxios.post(api.post, data);
};

export const getRecordClaim = (id) => {
  return securedAxios.get(api.get(id));
};

export const deleteRecordClaim = (ids) => {
  console.log("geowpgke", ids);
  return securedAxios.delete(api.delete, { data: { ids: ids } });
};

export const changeStatusRecordClaim = (id, data) => {
  return securedAxios.put(api.changeStatus(id), { status: data });
};

//get user info with national id,
export const getUserDataProjectApi = (nationalId) => {
  return securedAxios.get(api.getUserDataProject(nationalId));
};
