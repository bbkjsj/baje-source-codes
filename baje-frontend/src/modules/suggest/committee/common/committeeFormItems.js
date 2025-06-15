import { Col, Form, Input } from "antd";
import React from "react";

const Name = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col span={24}>
      <Form.Item label="نام کارگروه" name={"name"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

export { Name };
