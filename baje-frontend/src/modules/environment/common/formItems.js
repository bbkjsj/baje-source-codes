import { Col, Form, Input } from "antd";
import { formColSpan } from "constant";
import React from "react";

const EnvironmentUsageTitle = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="عنوان کاربری محیط جدید" name="title" rules={rules}>
        <Input className="d-block" />
      </Form.Item>
    </Col>
  );
};

export { EnvironmentUsageTitle };
