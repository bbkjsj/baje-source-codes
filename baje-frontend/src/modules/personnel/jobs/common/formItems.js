import { Col, Form, Input } from "antd";
import React from "react";
import { formColSpan } from "../../../../constant";

const JobTitle = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="عنوان شغل جدید" name="title" rules={rules}>
        <Input className="d-block" />
      </Form.Item>
    </Col>
  );
};

export { JobTitle };
