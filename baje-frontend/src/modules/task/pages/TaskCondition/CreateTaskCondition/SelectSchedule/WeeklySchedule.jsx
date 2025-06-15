import { Col, Form, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";
import AppTag from "components/general/AppTag";
import { range } from "lodash";
import { weekDays } from "modules/task/constant";
import React from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";

const WeeklySchedule = () => {
  const { dispatch, state } = useCreateTaskConditionContext();
  const [form] = Form.useForm();

  const handleFinish = (payload) => {
    dispatch({ type: createTaskConditionActions.addWeeklySchedule, payload });
    form.resetFields();
  };

  const handleRemove = (payload) => {
    dispatch({
      type: createTaskConditionActions.removeWeeklySchedule,
      payload,
    });
  };

  return (
    <>
      <Form onFinish={handleFinish} form={form}>
        <Row gutter={16} align="middle">
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required name="dayName" label="روز هفته">
              <AppSelect options={weekDays} />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required name="hour" label="ساعت">
              <AppSelect
                options={range(0, 24).map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required name="minute" label="دقیقه">
              <AppSelect
                options={[0, 15, 30, 45].map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppButton className="mt-3" htmlType="submit">
              ثبت
            </AppButton>
          </Col>
        </Row>
      </Form>

      {state.weeklySchedule.map((item, index) => (
        <AppTag onClick={() => handleRemove(index)}>
          {`از تاریخ  ${item.fromDate}  تاریخ ${item.toDate} هر ${
            weekDays.find((day) => item.dayName === day.value)?.label
          }، ساعت ${item.hour} و ${item.minute} دقیقه`}
        </AppTag>
      ))}
    </>
  );
};

export default WeeklySchedule;
