import { Col, Form, Input, Radio } from "antd";
import { formColSpan } from "constant";

import React from "react";

export const Title = () => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="title" label="عنوان" rules={Rules}>
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};

export const Pelak = () => {
  const Rules = [{ required: true }];
  const options = [
    { label: "با پلاک", value: 1 },
    { label: "بی پلاک", value: 0 },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item name="pelak" label="وضعیت پلاک" rules={Rules}>
        <Radio.Group options={options} />
      </Form.Item>
    </Col>
  );
};

export const Code = () => {
  const Rules = [{ required: true }];
  return (
    <Col {...formColSpan}>
      <Form.Item name="code" label="کد" rules={Rules}>
        <Input type="text" />
      </Form.Item>
    </Col>
  );
};
