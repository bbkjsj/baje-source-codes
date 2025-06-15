import { Divider, Typography } from "antd";
import AppTag from "components/general/AppTag";
import AppRadioGroup from "components/general/AppRadioGroup";
import React, { useEffect } from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import { constant, logicalOperators } from "../../../../constant";
import AppAnimations from "components/general/AppAnimations";

const Conditions = () => {
  const { state, dispatch } = useCreateTaskConditionContext();

  const handleChangeLogicalOperator = ({ target }) => {
    dispatch({
      type: createTaskConditionActions.changeAttribute,
      payload: { value: target.value, attribute: "operator" },
    });
  };

  const handleConditionClick = (payload) => {
    dispatch({ type: createTaskConditionActions.deleteCondition, payload });
  };

  useEffect(() => {
    console.log("STATE:", state);
  }, [state]);

  console.log("STATE:", state);

  return (
    <AppAnimations.SlideUp duration={500}>
      <Divider />
      <div className="flex justify-between">
        <Typography.Title level={5}>شرط ها</Typography.Title>
        <div className="flex flex-column">
          <p>عملگر بین شروط</p>
          <AppRadioGroup
            value={state.operator}
            onChange={handleChangeLogicalOperator}
            options={[
              { label: "و", value: logicalOperators.and },
              { label: "یا", value: logicalOperators.or },
            ]}
          />
        </div>
      </div>
      {state.conditions.map((condition, index) => (
        <>
          <AppTag onClick={() => handleConditionClick(condition)}>
            {`اگر ${
              condition.column?.title ||
              state.tableColumns.find(
                (item) => item.columnName === condition.column.columnName
              )?.title ||
              condition.column?.columnName
            } ${state.selectedTable?.title || ""} ${
              condition.operator + " " + condition.value === constant.isNull
                ? "خالی باشد"
                : condition.operator
            } ${
              condition.value && condition.value != "null"
                ? condition.value.toString().replaceAll(",", "‌")
                : ""
            }`}
          </AppTag>
          {index !== state.conditions.length - 1 && (
            <AppTag color="red">
              {state.operator === logicalOperators.and ? "و" : "یا"}
            </AppTag>
          )}
        </>
      ))}
      <Divider />
    </AppAnimations.SlideUp>
  );
};

export default Conditions;
