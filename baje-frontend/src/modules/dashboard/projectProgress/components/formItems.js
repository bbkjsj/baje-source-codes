import React from "react";
import { Form, Input, Select } from "antd";
import Col from "antd/es/grid/col";

export const RealProgress = () => {
  return (
    <Col xs={24}>
      <Form.Item
        name="real_progress"
        label="درصد پیشرفت واقعی"
        rules={[
          {
            required: true,
            message: "وارد کردن این فیلد اجباریست!",
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

export const ProgramProgress = () => {
  return (
    <Col xs={24}>
      <Form.Item
        name="program_progress"
        label="درصد پیشرفت برنامه ای"
        rules={[
          {
            required: true,
            message: "وارد کردن این فیلد اجباریست!",
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
