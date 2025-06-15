import { Col, Form, Row, Typography } from "antd";
import AppFormItem from "components/general/AppFormItem";
import AppSelect from "components/general/AppSelect";
import React, { useState } from "react";
import {
  createTaskConditionActions,
  useCreateTaskConditionContext,
} from "../context";
import { operators, columnTypes, constant } from "../../../../constant";
import AppInput from "components/general/AppInput";
import AppButton from "components/general/AppButton";
import AppNumInput from "components/general/AppNumInput";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import AppAnimations from "components/general/AppAnimations";

const ConditionRow = () => {
  const { state: parentState, dispatch } = useCreateTaskConditionContext();
  const [state, setState] = useState({ columnType: {}, operator: "" });

  const [form] = Form.useForm();

  const handleAddCondition = ({ column, ...params }) => {
    dispatch({
      type: createTaskConditionActions.addCondition,
      payload: { column: JSON.parse(column), ...params },
    });
    form.resetFields();
  };

  const handleChangeColumnType = (params) => {
    setState((s) => ({ ...s, columnType: JSON.parse(params) }));
    form.setFields([{ name: "value", value: "" }]);
  };

  const handleChangeOperator = (operator) => {
    setState((s) => ({ ...s, operator }));
    form.setFields([{ name: "value", value: "" }]);
  };

  return (
    <AppAnimations.SlideUp duration={500}>
      <Typography.Title level={5}>افزودن شرط</Typography.Title>
      <Form onFinish={handleAddCondition} form={form}>
        <Row align="middle" gutter={16}>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required name="column" label="ستون جدول">
              <AppSelect
                onChange={handleChangeColumnType}
                options={parentState.tableColumns
                  .filter(
                    (item) =>
                      !parentState.conditions.find(
                        (co) => co.column.columnName === item.columnName
                      )
                  )
                  .map((item) => ({
                    label: item.title,
                    value: JSON.stringify(item),
                  }))}
              />
            </AppFormItem>
          </Col>
          <Col md={6} sm={24} xs={24}>
            <AppFormItem required name="operator" label="عملگر">
              <AppSelect onChange={handleChangeOperator} options={operators} />
            </AppFormItem>
          </Col>
          {state.operator !== constant.isNull && (
            <Col md={6} sm={24} xs={24}>
              {state.columnType.type === columnTypes.date ? (
                <CustomDatePicker
                  plain
                  label="تاریخ"
                  form={form}
                  name="value"
                />
              ) : (
                <AppFormItem
                  required
                  className="w-100"
                  name="value"
                  label="مقدار">
                  {state.columnType.type === columnTypes.integer ? (
                    <AppNumInput />
                  ) : (
                    <AppInput />
                  )}
                </AppFormItem>
              )}
            </Col>
          )}
          <AppButton className="mt-3" htmlType="submit">
            ثبت
          </AppButton>
        </Row>
      </Form>
    </AppAnimations.SlideUp>
  );
};

export default ConditionRow;
