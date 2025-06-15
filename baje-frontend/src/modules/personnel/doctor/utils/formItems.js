import { Col, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { countOfNumInp } from "_helpers";
import { formColSpan } from "../../../../constant";

const NationalNumber = ({ onChange, onBlur }) => {
  const rules = [
    {
      required: true,
      len: 10,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="کد ملی"
        name={"national_number"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
        rules={rules}
      >
        <Input onChange={onChange} onBlur={onBlur} />
      </Form.Item>
    </Col>
  );
};

const FirstName = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="نام" name={"first_name"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const LastName = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="نام خانوادگی" name={"last_name"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const Password = ({ required = true }) => {
  const rules = [
    {
      required: required,
    },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="رمز عبور" name={"password"} rules={rules}>
        <Input.Password autoComplete="new-password" />
      </Form.Item>
    </Col>
  );
};

const ConfirmPassword = ({ required = true }) => {
  const rules = [
    {
      required: required,
    },

    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject("رمز عبور مطابقت ندارد");
      },
    }),
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="تکرار رمز عبور" name={"repeat_password"} rules={rules}>
        <Input.Password autoComplete="new-password" />
      </Form.Item>
    </Col>
  );
};

const Mobile = ({}) => {
  const rules = [
    {
      pattern: /(0)?9\d{9}/,

      message: "شماره موبایل وارد شده معتبر نیست",
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره موبایل"
        name={"mobile"}
        validateFirst
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 11)}
        rules={rules}
      >
        <Input autoComplete="nope" />
      </Form.Item>
    </Col>
  );
};

export {
  NationalNumber,
  FirstName,
  LastName,
  Password,
  ConfirmPassword,
  Mobile,
};
