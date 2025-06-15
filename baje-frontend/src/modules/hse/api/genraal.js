import api from "api/appAxios";
import { endPoints } from "../constant";

export const getJobs = () => api.get(endPoints.jobs);

export const searchPerson = ({
  page = 1,
  size = 10,
  filter = "national_number",
  nationalNumber,
}) =>
  api.get(endPoints.searchPerson, {
    params: { page, size, [filter]: nationalNumber },
  });

export const getVehicles = ({
  engine_number,
  chassis_number,
  organization_code,
}) =>
  api.get(endPoints.vehicles, {
    params: { engine_number, chassis_number, organization_code },
  });

export const getVehicleTypes = () => api.get(endPoints.vehicleTypes);
