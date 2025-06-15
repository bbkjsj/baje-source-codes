// https://baje724.ir/api/admin/personnel/list/-1/-1?page=1&size=20&sort=last_name&stype=asc&filter=last_name&fvalue=0014148171

import api from "api/appAxios";
import { endPoint } from "../constant";

export const getPersonnel = () => api.get(endPoint.personnel);

export const getJobs = () => api.get(endPoint.jobs);
