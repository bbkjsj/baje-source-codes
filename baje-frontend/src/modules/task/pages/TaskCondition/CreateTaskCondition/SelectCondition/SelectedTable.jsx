import AppTable from "components/general/AppTable";
import React from "react";
import { useCreateTaskConditionContext } from "../context";

const SelectedTable = () => {
  const { state } = useCreateTaskConditionContext();
  if (state.tableColumns.length === 0) return null;
  return (
    <AppTable
      size="small"
      loading={state.selectedTableLoading}
      columns={state.tableColumns
        .filter(
          (item) => !state.conditions.find((cond) => cond.column.id === item.id)
        )
        .map((item) => ({ title: item.title }))}
    />
  );
};

export default SelectedTable;
