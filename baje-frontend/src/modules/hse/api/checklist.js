import api from "api/appAxios";
import { omit } from "lodash";
import { endPoints } from "modules/hse/constant";

/**
 * create check list
 * @param {{group:string,jobsId:number,questions:Array<{questionId:number,weight_factor:number,critical:number}>}} checklist - checklist object
 * @returns
 */
export const createChecklist = (checklist) =>
  api.post(endPoints.checklist.base, checklist);

/**
 * create check list
 * @param {{id:number}} checklist - checklist object
 * @returns
 */
export const updateChecklist = (checklist) =>
  api.patch(
    `${endPoints.checklist.base}/${checklist.id}`,
    omit(checklist, ["id"])
  );

export const getChecklist = (checklist) =>
  api.get(`${endPoints.checklist.base}/${checklist.id}`);

export const getChecklists = () => api.get(endPoints.checklist.base);

export const deleteChecklist = (checklist) =>
  api.delete(`${endPoints.checklist.base}/${checklist.id}`);
