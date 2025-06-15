import { Col, Row } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";
import { range } from "lodash";
import React from "react";
import AppButton from "components/general/AppButton";
import { Form } from "antd";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import AppAnimations from "components/general/AppAnimations";
import AppTag from "components/general/AppTag";

const DailySchedule = () => {
  const { dispatch, state } = useCreateTaskConditionContext();
  const [form] = Form.useForm();

  const handleFinish = (payload) => {
    dispatch({
      type: createTaskConditionActions.addDailySchedule,
      payload,
    });
    form.resetFields();
  };

  const handleRemoveDailySchedule = (payload) => {
    dispatch({
      type: createTaskConditionActions.removeDailySchedule,
      payload,
    });
  };

  return (
    <>
      <Form onFinish={handleFinish} form={form}>
        <Row gutter={16} align="middle">
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required label="ساعت" name="hour">
              <AppSelect
                options={range(0, 24).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required label="دقیقه" name="minute">
              <AppSelect
                options={[0, 15, 30, 45].map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={1} sm={24} xs={24}>
            <AppButton htmlType="submit" className="mt-3 mr-3">
              ثبت
            </AppButton>
          </Col>
        </Row>
      </Form>
      {state.dailySchedule.map((item, index) => (
        <AppAnimations.SlideUp key={index}>
          <AppTag
            onClick={() =>
              handleRemoveDailySchedule(index)
            }>{`از تاریخ ${item.fromDate} تا تاریخ ${item.toDate} ساعت ${item.minute} : ${item.hour} دقیقه هر روز`}</AppTag>
        </AppAnimations.SlideUp>
      ))}
    </>
  );
};

export default DailySchedule;
