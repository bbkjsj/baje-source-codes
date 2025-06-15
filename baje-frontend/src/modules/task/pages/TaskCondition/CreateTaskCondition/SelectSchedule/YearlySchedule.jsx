import React from "react";
import { Col, Divider, Form, Row } from "antd";
import AppSelect from "components/general/AppSelect";
import AppTag from "components/general/AppTag";
import { range } from "lodash";
import { jalaaliMonths } from "modules/task/constant";
import { Calendar } from "react-modern-calendar-datepicker";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import AppButton from "components/general/AppButton";
import AppFormItem from "components/general/AppFormItem";

const YearlySchedule = () => {
  const { state: parentState, dispatch } = useCreateTaskConditionContext();
  const [form] = Form.useForm();

  const handleFinish = ({ month, ...payload }) => {
    dispatch({
      type: createTaskConditionActions.addYearlySchedule,
      payload: {
        month: JSON.parse(month),
        ...payload,
      },
    });
    form.resetFields();
  };

  const handleRemoveYearlyItem = (payload) => {
    dispatch({
      type: createTaskConditionActions.removeYearlySchedule,
      payload,
    });
  };

  return (
    <div className="h-100">
      <Form onFinish={handleFinish} form={form}>
        <Row gutter={16} align="middle">
          <Col md={6} sm={12} xs={24}>
            {!!parentState.toDate && (
              <div className="h-100 w-100">
                <AppFormItem
                  label="انتخاب ماه"
                  required
                  name="month"
                  className="w-100">
                  <AppSelect
                    options={range(
                      parseInt(parentState.fromDate.format("jMM")),
                      parseInt(parentState.toDate?.format("jMM")) <
                        parseInt(parentState.fromDate?.format("jMM"))
                        ? parseInt(parentState.toDate?.format("jMM")) + 13
                        : parseInt(parentState.toDate?.format("jMM")) + 1
                    )
                      .map((item) =>
                        jalaaliMonths.find(
                          (month) =>
                            month.value === (item > 12 ? item - 12 : item)
                        )
                      )
                      .map((item) => ({
                        label: item.label,
                        value: JSON.stringify(item),
                      }))}
                  />
                </AppFormItem>
                <div></div>
              </div>
            )}
          </Col>
          <Col md={6} sm={12} xs={24}>
            <div className="w-100">
              <AppFormItem required name="day" label="انتخاب روز">
                <AppSelect
                  options={range(1, 32).map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </AppFormItem>
            </div>
          </Col>
          <Col md={4} sm={12} xs={24}>
            <AppButton className="mt-4" htmlType="submit">
              افزودن
            </AppButton>
          </Col>
        </Row>
      </Form>
      {parentState.yearlySchedule.length > 0 && (
        <>
          {parentState.yearlySchedule.map((item, index) => (
            <AppTag
              onClick={() => handleRemoveYearlyItem(index)}
              key={item.month + item.day}>
              {"از تاریخ " +
                item.fromDate +
                " تا تاریخ " +
                item.toDate +
                " هر سال در روز " +
                item.day +
                " " +
                item.month.label +
                " ساعت 7:30 دقیقه"}
            </AppTag>
          ))}
          <Divider />
        </>
      )}
    </div>
  );
};

export default YearlySchedule;
