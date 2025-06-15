import React from "react";
import { Form, Col, Input } from "antd";
import { formColSpan } from "../../../../constant";
//
export const DisableCarNoPartQuantity = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="disabled_car_no_part_quantity"
        label="تعداد ماشین غیرفعال بعلت نبودِقطعه"
        rules={[{ required: true, message: "وارد کردن این فیلد اجباریست" }]}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const DisableCarNoTierQuantity = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="disabled_car_no_tier_quantity"
        label="تعداد ماشین غیرفعال بعلت نبودِلاستیک"
        rules={[{ required: true, message: "وارد کردن این فیلد اجباریست" }]}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const ActiveCarQuantuty = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="active_car_quantity"
        label="تعداد ماشین فعال "
        rules={[{ required: true, message: "وارد کردن این فیلد اجباریست" }]}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const ReadyToWorkFactor = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        name="ready_to_work_factor"
        label="ضریب آماده به کاری"
        rules={[{ required: true, message: "وارد کردن این فیلد اجباریست" }]}
      >
        <Input type="number" />
      </Form.Item>
    </Col>
  );
};

//
export const Description = () => {
  return (
    <Col {...formColSpan} xl={12}>
      <Form.Item name="description" label="توضیحات">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};
