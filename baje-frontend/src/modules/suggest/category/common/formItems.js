import { Col, Form, Input } from "antd";
import React, { useEffect, useState } from "react";

const Name = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={8}>
      <Form.Item label="نام زمینه" name={"name"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const Description = () => {
  const rules = [];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={16}>
      <Form.Item label="توضیحات" name={"description"}>
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export { Name, Description };
