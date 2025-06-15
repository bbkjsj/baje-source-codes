import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import AppInput from "components/general/AppInput";
import AppSelect from "components/general/AppSelect";
import AppButton from "components/general/AppButton";

const Name = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Form.Item
        name="first_name"
        label="نام"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput />
      </Form.Item>
    </Col>
  );
};

const LastName = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Form.Item
        name="last_name"
        label="نام خانوادگی"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput />
      </Form.Item>
    </Col>
  );
};

const NID = ({ className, disabled }) => {
  const rules = [
    {
      required: true,
      len: 10,
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} className={className}>
      <Form.Item
        name="national_code"
        label="کد ملی"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput type="number" disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const IdentityNum = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Form.Item
        name="id_number"
        label="شماره شناسنامه"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput type="number" />
      </Form.Item>
    </Col>
  );
};

const FatherName = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /^[ آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ\s]+$/,

      message: "باید فقط شامل حروف فارسی باشد",
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Form.Item
        name="father_name"
        label="نام پدر"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput />
      </Form.Item>
    </Col>
  );
};

const Gender = () => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "مرد", value: "m" },
    { label: "زن", value: "f" },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Form.Item
        label="جنسیت"
        name="gender"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppSelect options={options} />
      </Form.Item>
    </Col>
  );
};

const Phone = () => {
  const rules = [
    {
      required: true,
    },
    {
      pattern: /(\+98|0)?9\d{9}/,

      message: "شماره موبایل وارد شده معتبر نیست",
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <Form.Item
        name="mobile"
        label="شماره موبایل"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput inputmode="numeric" pattern="[0-9]*" />
      </Form.Item>
    </Col>
  );
};

const Code = ({ onResend }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mx-auto">
      <Form.Item
        name="code"
        label="کد تایید"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
      >
        <AppInput
          mask="111111"
          name="code"
          className="text-center ltr code-input"
          dir="ltr"
          placeholder="______"
          autoFocus={true}
          inputmode="numeric"
          pattern="[0-9]*"
        />
      </Form.Item>
      {/* <AppButton
        type="link"
        onClick={() => onResend()}
        className="m-0 p-0 text-underline text-14"
      >
        اصلاح شماره
      </AppButton> */}
    </Col>
  );
};

const Username = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item
      name="username"
      label="نام کاربری"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
      normalize={numberNormalize}
    >
      <AppInput
        placeholder="پیش فرض کد ملی"
        inputmode="numeric"
        pattern="[0-9]*"
      />
    </Form.Item>
  );
};

const Password = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item
      name="password"
      label="کلمه عبور"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput placeholder="پیش فرض کد ملی" type="password" />
    </Form.Item>
  );
};

const BirthDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ تولد اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ تولد"
      name="birth_date"
      maximumDate={utils("fa").getToday()}
      rules={rules}
      xlCol={12}
      onChange={onChange}
    />
  );
};

export {
  Name,
  LastName,
  NID,
  IdentityNum,
  FatherName,
  Gender,
  Phone,
  Code,
  Username,
  Password,
  BirthDate,
};
