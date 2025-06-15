import { Col, Row } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppRadioGroup from "components/general/AppRadioGroup";
import AppSelect from "components/general/AppSelect";
import {
  constant,
  taskApproveSequence,
  taskDoneCondition,
  taskPunishment,
} from "modules/task/constant";
import React from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";

const ApproveCondition = () => {
  const { state, dispatch } = useCreateTaskConditionContext();

  const handleChangeApproveCondition = (payload) => {
    dispatch({
      type: createTaskConditionActions.setApproveCondition,
      payload,
    });
  };

  if (state.taskCreateType === constant.conditionalTask) return null;

  return (
    <Row gutter={16}>
      <Col md={12} sm={24} xs={24}>
        <AppFormItem
          required
          label="تشخیص انجام شدن وظیفه"
          name="approveCondition"
        >
          <AppSelect
            onChange={handleChangeApproveCondition}
            options={taskDoneCondition}
          />
        </AppFormItem>
      </Col>
      {state.approveCondition === constant.specificPerson && (
        <Col md={12} sm={24} xs={24}>
          <AppFormItem
            label="انتخاب شخص تایید کننده"
            extra="جستجو بر اساس کد ملی و نام و نام خانوادگی"
            name="approverPersonnelId"
          >
            <AppSelect
              placeholder="جستجو بر اساس شماره ملی"
              showSearch
              filterOption={(search, { nationalNumber, label }) =>
              nationalNumber?.includes(search) || label?.includes(search)
              }
              options={state.personnels.map(
                ({ first_name, last_name, id, national_number }) => ({
                  label: `${first_name} ${last_name} - ${national_number}`,
                  value: id,
                  nationalNumber: national_number,
                })
              )}
              loading={state.personnelLoading}
            />
          </AppFormItem>
        </Col>
      )}
      {state.approveCondition === constant.specificJob && (
        <>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              required
              label="تایید مشاغل خاص"
              name="approveJobsSequence"
            >
              <AppRadioGroup options={taskApproveSequence} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem
              required
              label="انتخاب شغل تایید کننده"
              name="approveJobsId"
            >
              <AppSelect
                showSearch
                mode="tags"
                filterOption={(search, { value, label }) =>
                  label.includes(search)
                }
                options={state.jobs.map(({ id: value, title: label }) => ({
                  label,
                  value,
                }))}
              />
            </AppFormItem>
          </Col>
        </>
      )}
    </Row>
  );
};

export default ApproveCondition;
