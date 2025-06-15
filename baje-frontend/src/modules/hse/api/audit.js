import api from "api/appAxios";
import { omit } from "lodash";
import { endPoints } from "../constant";

/**
 *
 * @param {{date:string, description:string, questions:Array<{questionId:number}>}} audit - audit object
 * @returns
 */
export const createAudit = (audit) => api.post(endPoints.audit.base, audit);

export const getAudit = (id = "") => api.get(`${endPoints.audit.base}/${id}`);

export const deleteAudit = (audit) =>
  api.delete(`${endPoints.audit.base}/${audit.id}`);

export const updateAudit = (audit) =>
  api.patch(`${endPoints.audit.base}/${audit.id}`, omit(audit, ["id"]));

export const getExclusiveQuesitons = ({
  personnelId,
  vehicleId,
  environmentId,
}) =>
  api.post(endPoints.audit.exclusiveQuestion, {
    personnelId,
    vehicleId,
    environmentId,
  });
