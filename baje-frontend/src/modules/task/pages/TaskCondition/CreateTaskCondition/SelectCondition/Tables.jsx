import { Card, Typography } from "antd";
import AppAnimations from "components/general/AppAnimations";
import React from "react";
import colors from "utils/colors";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";

const Tables = () => {
  const { state, dispatch } = useCreateTaskConditionContext();

  const handleSelectTable = (payload) => {
    dispatch({ type: createTaskConditionActions.setSelectedTable, payload });
  };

  return (
    <>
      <Typography.Title level={5}>جدول ها</Typography.Title>
      <div className="flex flex-wrap">
        {state.tables.map((item, index) => (
          <AppAnimations.SlideUp delay={index * 200}>
            <Card
              size="small"
              hoverable
              loading={state.tablesLoading}
              style={{
                minWidth: "150px",
                marginLeft: 10,
                marginTop: 5,
                borderColor:
                  !state.tablesLoading &&
                  state.selectedTable?.id === item.id &&
                  colors.primary,
              }}
              key={item.id}
              onClick={() => handleSelectTable(item)}
              title={item.title}
              bordered>
              {/* <p>{`شناسه جدول : ${item.id}`}</p>
            <p>{`نام در دیتابیس : ${item.table_name}`}</p> */}
            </Card>
          </AppAnimations.SlideUp>
        ))}
      </div>
    </>
  );
};

export default Tables;
