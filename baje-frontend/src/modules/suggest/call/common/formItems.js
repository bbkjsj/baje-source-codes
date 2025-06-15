import {
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  message,
  Row,
  Button,
} from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { itemStatus } from "../const";

const Committee = ({ onChange, items }) => {
  const rules = [
    {
      required: true,
    },
  ];

  let options = [];

  if (items)
    options = items.map((item) => {
      return { label: item.name, value: item.id };
    });

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="کارگروه مربوطه" name="workgroup_id" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const Subject = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="عنوان فراخوان" name={"subject"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const StartDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ شروع اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
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
      label="تاریخ شروع"
      name="start_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

const EndDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ پایان اجباری است",
    },
    () => ({
      validator(rule, value) {
        if (checkShamsi(value, false)) {
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
      label="تاریخ پایان"
      name="end_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

export { Committee, Subject, StartDate, EndDate };
