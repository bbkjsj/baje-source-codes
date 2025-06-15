import api from "api/appAxios";
import { endPoints } from "../constant";

// /**
//  *
//  * @param {Array<number>} questionIds
//  * @param {number} personId
//  * @param {string} fromDate
//  * @param {string} toDate
//  * @param {number} weightFactor
//  * @param {string} requirements
//  * @param {string} description
//  * @param {string} critical
//  * @returns
//  */
export const allocateToPerson = ({
  questionIds = [],
  personnelId = 1,
  fromDate = "",
  toDate = "",
  weightFactor = 1,
  requirements = "",
  description = "",
  critical = "",
}) =>
  api.post(endPoints.allocate.base, {
    questionIds,
    personnelId,
    fromDate,
    toDate,
    weightFactor,
    requirements,
    description,
    critical,
  });

// /**
//  *
//  * @param {Array<number>} questionIds
//  * @param {number} personId
//  * @param {string} fromDate
//  * @param {string} toDate
//  * @param {number} weightFactor
//  * @param {string} requirements
//  * @param {string} description
//  * @param {string} critical
//  * @returns
//  */
export const allocateToVehicle = ({
  questionIds = [],
  vehicleId = 1,
  fromDate = "",
  toDate = "",
  weightFactor = 1,
  requirements = "",
  description = "",
  critical = "",
}) =>
  api.post(endPoints.allocate.base, {
    questionIds,
    vehicleId,
    fromDate,
    toDate,
    weightFactor,
    requirements,
    description,
    critical,
  });
