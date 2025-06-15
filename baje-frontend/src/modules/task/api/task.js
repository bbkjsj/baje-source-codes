import api from "api/appAxios";
import { endPoint } from "../constant";

export const getTasks = () => api.get(endPoint.tasks.openTask);

export const getTask = (taskId) =>
  api.get(endPoint.tasks.detail + "/" + taskId);

export const getTaskCartboard = (status) =>
  api.get(`${endPoint.tasks.cartboards}/${status}`);

export const postTasks = (task) => api.post(endPoint.tasks.base, task);

export const deleteTask = (task) =>
  api.delete(`${endPoint.tasks.base}/${task.id}`);

export const patchTask = (id, data) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return api.patch(`${endPoint.tasks.base}/${id}`, data, config);
};

export const approveTask = ({ id }) =>
  api.patch(`${endPoint.tasks.taskApprove}/${id}`, { status: "done" });

/**
 *
 * @param {object} params
 * @param {number} params.taskId - task id
 * @param {string} params.description - description
 * @returns
 */
export const postNotMyDuty = ({ taskId, description }) =>
  api.post(endPoint.tasks.notMyDuty, { description, taskId });

/**
 *
 * @param {object} params
 * @param {number} params.taskId - task id
 * @param {boolean} params.status - status
 * @returns
 */
export const approveNotMyDuty = ({ taskId, status = true }) =>
  api.patch(`${endPoint.tasks.notMyDuty}/${taskId}/${status}`);

export const getUnreadCount = () => api.get(endPoint.tasks.unreadCount);

export const postReadTask = (id) =>
  api.patch(`${endPoint.tasks.saveRead}/${id}`);

export const postForwardTask = (id, data) =>
  api.patch(endPoint.tasks.forward(id), data);
