import { Col, Form, Modal, Row } from "antd";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";
import AppTag from "components/general/AppTag";
import { range } from "lodash";
import React from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import moment from "moment-jalaali";

const MonthlySchedule = () => {
  

  const [form] = Form.useForm();
  const { dispatch, state } = useCreateTaskConditionContext();

  const handleFinish = (payload) => {
    dispatch({ type: createTaskConditionActions.addMonthlySchedule, payload });
    form.resetFields();
  };

  const handleRemoveMonthlyItem = (payload) => {
    dispatch({
      type: createTaskConditionActions.removeMonthlySchedule,
      payload,
    });
  };

  return (
    <>
      <Form form={form} onFinish={handleFinish}>
        <Row gutter={16} align="middle">
          <Col md={6} sm={24} xs={24}>
            {/* <AppFormItem required name="day" label="روز">
              <AppSelect
                options={range(1, 32)
                  .filter(
                    (item) => !state.monthlySchedule.find((m) => m.day === item)
                  )
                  .map((item) => ({
                    label: item,
                    value: item,
                  }))}
              />
            </AppFormItem> */}
            <AppFormItem required name="month" label="تعداد ماه">
              <AppSelect
                options={range(1, 13).map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppButton className="mt-3" htmlType="submit">
              افزودن
            </AppButton>
          </Col>
        </Row>
      </Form>

      {state.monthlySchedule.map((item, index) => (
        <>
          <AppTag
            onClick={() => handleRemoveMonthlyItem(index)}
            key={item.month + index}
            className="pointer"
          >
            {/* {"از تاریخ " +
              item.fromDate +
              " روز " +
              item.day +
              " هر ماه ساعت 7:30 دقیقه"} */}
            {`از تاریخ ${item.fromDate} به مدت ${item.month} ماه هر ماه ساعت 7:30 دقیقه`}
          </AppTag>
        </>
      ))}
    </>
  );
};

export default MonthlySchedule;
