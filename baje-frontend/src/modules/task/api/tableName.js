import api from "api/appAxios";
import { endPoint } from "../constant";

export const getTableNames = () => api.get(endPoint.tableName.base);

export const postTableName = (tableName) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await api.post(endPoint.tableName.base, tableName);
      resolve({
        ...result,
        data: { ...tableName, id: result.data.identifiers[0].id },
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteTableName = (tableName) =>
  api.delete(`${endPoint.tableName.base}/${tableName.id}`);

export const getDbTableNames = () => api.get(endPoint.tableName.dbTableName);

export const patchTableName = ({ id, ...tableName }) =>
  api.patch(`${endPoint.tableName.base}/${id}`, tableName);
