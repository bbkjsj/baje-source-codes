import React from "react";
import { Col, Form, Input } from "antd";
import { countOfNumInp } from "_helpers";

const Phone = () => {
  const rules = [
    {
      len: 11,
      message: "فرمت شماره تلفن اشتباه است",
    },
  ];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="شماره تماس"
        name={"phone/contactInfoTab"}
        rules={rules}
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 11)}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const PostalCode = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="کد پستی"
        name="postal_code/contactInfoTab"
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
        rules={[{ len: 10 }]}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const Email = () => {
  const rules = [
    {
      type: "email",
      message: "فرمت ایمیل نادرست است",
    },
  ];
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="آدرس ایمیل" name="email/contactInfoTab" rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const Address = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="آدرس " name="address/contactInfoTab">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export { Address, Phone, PostalCode, Email };
