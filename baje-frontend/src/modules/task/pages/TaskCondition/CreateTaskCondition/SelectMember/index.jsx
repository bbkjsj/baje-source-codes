import { Row, Tabs } from "antd";
import React from "react";
import Jobs from "./Jobs";
import {
  useCreateTaskConditionContext,
  createTaskConditionActions,
} from "../context";
import Personnel from "./Personnel";
import { constant } from "modules/task/constant";
import AppButton from "components/general/AppButton";

const CreateTaskConditionStep4 = ({loading}) => {
  const {
    state,
    dispatch,
    handleModifyTaskCondition,
  } = useCreateTaskConditionContext();

  const handleChangeType = (payload) => {
    dispatch({
      type: createTaskConditionActions.changeMemberType,
      payload,
    });
  };

  const handleBack = () => {
    dispatch({ type: createTaskConditionActions.handleSecondStep });
  };

  return (
    <>
      <Tabs
        activeKey={state.memberType}
        type="card"
        onChange={handleChangeType}>
        <Tabs.TabPane key={constant.job} tab="مشاغل">
          <Jobs />
        </Tabs.TabPane>
        <Tabs.TabPane key={constant.personnel} tab="پرسنل">
          <Personnel />
        </Tabs.TabPane>
      </Tabs>
      <Row>
        <AppButton variant="danger" onClick={handleBack}>
          مرحله قبل
        </AppButton>
        {(state.selectedJobs?.length > 0 ||
          state.personnelMembers?.length > 0) && (
          <AppButton loading={loading} onClick={handleModifyTaskCondition}>ثبت</AppButton>
        )}
      </Row>
    </>
  );
};

export default CreateTaskConditionStep4;
