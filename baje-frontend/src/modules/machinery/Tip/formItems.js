import React from "react";
import { Select, Col, Form, Input, Upload, Button } from "antd";
import { formColSpan } from "constant";

export const Title = () => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="title" label="عنوان " rules={Rules}>
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
export const Type = ({ options }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="typeId" label="نوع" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};
export const System = ({ options }) => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="systemId" label="سیستم" rules={Rules}>
        <Select options={options} />
      </Form.Item>
    </Col>
  );
};
