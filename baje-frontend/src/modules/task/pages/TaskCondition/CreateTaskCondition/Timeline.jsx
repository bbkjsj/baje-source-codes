import React from "react";
import { Row, Timeline } from "antd";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "./context";
import AppButton from "components/general/AppButton";

const CreateTaskConditionTimeline = () => {
  const {
    state,
    handleModifyTaskCondition,
    dispatch,
  } = useCreateTaskConditionContext();

  const handleBack = (params) => {
    dispatch({ type: createTaskConditionActions.handleThirdStep });
  };

  return (
    <div className="mt-3 flex flex-column ">
      <Timeline mode="right">
        <Timeline.Item
          color={!state.selectedTable ? "gray" : "blue"}
          pending={!state.selectedTable}>
          <p>انتخاب جدول</p>
        </Timeline.Item>
        <Timeline.Item
          pending={state.conditions.length === 0}
          color={state.conditions.length === 0 ? "gray" : "blue"}>
          <p>ساخت شرط</p>
        </Timeline.Item>
        <Timeline.Item
          pending={state.step >= 1}
          color={state.step >= 2 ? "blue" : "gray"}>
          <p>مشخصات وظیفه</p>
        </Timeline.Item>
        <Timeline.Item
          pending={state.step === 3}
          color={state.step === 3 ? "blue" : "gray"}>
          <p>انتخاب افراد</p>
        </Timeline.Item>
      </Timeline>
      {state.step === 4 &&
        (state.personnelMembers.length > 0 ||
          state.selectedJobs.length > 0) && (
          <Row className="w-100" justify="space-around">
            <AppButton variant="danger" onClick={handleBack}>
              مرحله قبل
            </AppButton>
            <AppButton onClick={handleModifyTaskCondition}>ثبت</AppButton>
          </Row>
        )}
    </div>
  );
};

export default CreateTaskConditionTimeline;
