import { Col, Divider, Row, Typography } from "antd";
import AppButton from "components/general/AppButton";
import AppModal from "components/general/AppModal";
import AppSelect from "components/general/AppSelect";
import { range } from "lodash";
import React from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "./context";

const DueDate = () => {
  const { state, dispatch } = useCreateTaskConditionContext();

  const handleCloseModal = () => {
    dispatch({ type: createTaskConditionActions.toggleDueDateModal });
  };

  const handleChangeDueDate = (attribute, value) => {
    dispatch({
      type: createTaskConditionActions.changeAttribute,
      payload: { attribute, value },
    });
  };

  return (
    <AppModal
      closable={false}
      footer={null}
      visible={state.dueDateModal}
      onCancel={handleCloseModal}
      centered>
      <Typography.Title level={3}>مهلت انجام وظیفه</Typography.Title>
      <Typography.Text>
        زمان ثبت شده به منزله مهلت انجام وظیفه از زمان ساخت آن است.
      </Typography.Text>
      <Divider />
      <Row justify="center">
        <Col md={5} sm={24} xs={24}>
          <AppSelect
            className="w-100"
            value={state.hoursAfterCreate}
            style={{ minWidth: "auto" }}
            label="ساعت"
            onChange={(value) => handleChangeDueDate("hoursAfterCreate", value)}
            options={range(0, 1000).map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </Col>
        <Col md={5} sm={24} xs={24}>
          <AppSelect
            className="w-100"
            value={state.daysAfterCreate}
            style={{ minWidth: "auto" }}
            label="روز"
            onChange={(value) => handleChangeDueDate("daysAfterCreate", value)}
            options={range(0, 1000).map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </Col>
        <Col md={5} sm={24} xs={24}>
          <AppSelect
            value={state.monthsAfterCreate}
            className="w-100"
            label="ماه"
            style={{ minWidth: "auto" }}
            onChange={(value) =>
              handleChangeDueDate("monthsAfterCreate", value)
            }
            options={range(0, 100).map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </Col>
        <Col md={5} sm={24} xs={24}>
          <AppSelect
            value={state.yearsAfterCreate}
            label="سال"
            className="w-100"
            style={{ minWidth: "auto" }}
            onChange={(value) => handleChangeDueDate("yearsAfterCreate", value)}
            options={range(0, 10).map((item) => ({
              label: item,
              value: item,
            }))}
          />
        </Col>
      </Row>
      <Divider />
      <AppButton type="primary" onClick={handleCloseModal}>
        بستن
      </AppButton>
    </AppModal>
  );
};

export default DueDate;
