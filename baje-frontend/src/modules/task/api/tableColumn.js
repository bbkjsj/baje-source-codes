import api from "api/appAxios";
import { endPoint } from "../constant";

export const getTableColumn = (tableName) =>
  api.get(`${endPoint.tableName.columns.base}/${tableName.id}`);

export const getTableDbColumn = (tableName) =>
  api.get(
    `${endPoint.tableName.columns.dbColumns}/${tableName.table_name}/fields`
  );

export const postTableColumn = (tableColumn) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await api.post(
        endPoint.tableName.columns.column,
        tableColumn
      );
      resolve({
        ...result,
        data: { ...tableColumn, id: result.data.identifiers[0].id },
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteTableColumn = (tableColumn) =>
  api.delete(`${endPoint.tableName.columns.column}/${tableColumn.id}`);

export const patchTableColumn = ({ id, ...tableColumn }) =>
  api.patch(`${endPoint.tableName.columns.column}/${id}`, tableColumn);
