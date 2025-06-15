import { Divider, Row } from "antd";
import AppButton from "components/general/AppButton";
import React, { useEffect } from "react";
import ConditionRow from "./ConditionRow";
import Conditions from "./Conditions";
import Tables from "./Tables";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import { getTableNames } from "modules/task/api/tableName";
import { getTableColumn } from "modules/task/api/tableColumn";

const CreateTaskConditionStep1 = () => {
  const { state, dispatch } = useCreateTaskConditionContext();

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (state.selectedTable) loadTableColumns();
  }, [state.selectedTable]);

  const loadTables = async () => {
    try {
      const { data: payload } = await getTableNames();
      dispatch({ type: createTaskConditionActions.setTables, payload });
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadTableColumns = async () => {
    try {
      const { data: payload } = await getTableColumn(state.selectedTable);
      dispatch({ type: createTaskConditionActions.setTableColumns, payload });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleNextStep = () => {
    dispatch({
      type: createTaskConditionActions.handleThirdStep,
    });
  };

  const handlePreviousStep = () => {
    dispatch({
      type: createTaskConditionActions.handleFirstStep,
    });
  };

  return (
    <div style={{ height: "100vh" }} className="mt-3">
      <Tables />
      <Divider />
      {!!state.selectedTable && <ConditionRow />}
      {state.conditions.length > 0 && <Conditions />}

      <Row justify="end" className="w-100">
        <AppButton danger onClick={handlePreviousStep}>
          مرحله قبل
        </AppButton>
        <AppButton className="mx-2" onClick={handleNextStep}>
          مرحله بعد
        </AppButton>
      </Row>
    </div>
  );
};

export default CreateTaskConditionStep1;
