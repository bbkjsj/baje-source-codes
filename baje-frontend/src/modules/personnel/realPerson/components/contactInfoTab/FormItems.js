import React from "react";
import { Col, Form, Input } from "antd";
import Styles from "./FormItems.module.css";

import { countOfNumInp, mobileNumberValidation } from "_helpers";
import { formColSpan } from "../../../../../constant";
const MobileOne = ({}) => {
  const rules = [
    {
      len: 11,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره موبایل 1"
        name={"mobile1/contactInfoTab"}
        validateFirst
        normalize={(value) => mobileNumberValidation(value)}
        rules={rules}
      >
        <Input placeholder="09XXXXXXXXX بصورت" className={Styles.direct} />
      </Form.Item>
    </Col>
  );
};

const MobileTwo = () => {
  const rules = [
    {
      len: 11,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره موبایل 2"
        name={"mobile2/contactInfoTab"}
        validateFirst
        normalize={(value) => mobileNumberValidation(value)}
        rules={rules}
      >
        <Input placeholder="09XXXXXXXXX بصورت" className={Styles.direct} />
      </Form.Item>
    </Col>
  );
};

const Phone = () => {
  const rules = [
    {
      len: 11,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره تلفن"
        name={"phone/contactInfoTab"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 11)}
        rules={rules}
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
    <Col {...formColSpan}>
      <Form.Item label="آدرس ایمیل" name="email/contactInfoTab" rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const PostalCode = () => {
  return (
    <Col {...formColSpan}>
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

const Address = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="آدرس " name="address/contactInfoTab">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export { MobileOne, MobileTwo, Phone, Email, Address, PostalCode };
