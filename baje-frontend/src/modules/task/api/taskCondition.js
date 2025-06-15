import api from "api/appAxios";
import { endPoint } from "../constant";

export const getTaskConditions = () => api.get(endPoint.taskCondition.base);

export const getTaskCondition = ({ id }) =>
  api.get(`${endPoint.taskCondition.base}/${id}`);

/**
 *
 * @param {{tableId:number, condition:string}} taskCondition
 * @returns
 */
export const postTaskCondition = (taskCondition) =>
  api.post(endPoint.taskCondition.base, taskCondition, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const patchTaskCondition = (id, data) =>
  api.patch(`${endPoint.taskCondition.base}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteTaskCondition = (taskCondition) =>
  api.delete(`${endPoint.taskCondition.base}/${taskCondition.id}`);

export const postTaskConditionNew = (taskCondition) =>
  api.post("/api/v1/baje/tasks/test", taskCondition, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const downloadFile = (file) => {
  return api.get("/api/v1/baje/files/" + file, {
    responseType: "blob",
  });
};
