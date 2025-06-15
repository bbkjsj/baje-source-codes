import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { checkShamsi, convertDateToEN, covetFormatDateToEn } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import {
  JobCodeInput,
  NationalIdInput,
} from "modules/personnel/realPerson/service/formItems";
import PeriodTime from "../../../../../components/PeriodTime";

const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button = true,
}) => {
  console.info(button);
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      // groupInput
      // groupInputName="test"
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled={button}
    />
  );
};

const Type = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "انفرادی", value: "انفرادی" },
    { label: "گروهی", value: "گروهی" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نوع ماموریت" name="type" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const Place = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="محل ماموریت" name={"place"} rules={rules}>
        <Input />
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
      <Form.Item label="موضوع ماموریت" name={"subject"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

// Added Validation for start and end date
const StartDate = ({ useForm, onChange }) => {
  const checkStartDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      var startTime = convertDateToEN(getFieldValue("start_date"));

      var currentTime = moment().format("YYYY/M/D");
      console.info(startTime + "   " + currentTime);

      if (
        checkShamsi(value, false) &&
        new Date(currentTime) > new Date(startTime)
      ) {
        return Promise.reject("تاریخ نباید برای قبل باشد.");
      }
      return Promise.resolve();
    },
  });
  const rules = [
    {
      required: true,
      message: "فیلد زمان پایان اجباریست",
    },
    checkStartDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="از تاریخ"
      name="start_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

const EndDate = ({ useForm, onChange }) => {
  const checkEndDate = ({ getFieldValue }) => ({
    validator(rule, value) {
      var startTime = convertDateToEN(getFieldValue("start_date"));
      var endTime = convertDateToEN(getFieldValue("end_date"));

      console.info(startTime + "   " + endTime);

      if (
        checkShamsi(value, false) &&
        new Date(endTime) < new Date(startTime)
      ) {
        return Promise.reject("نباید قبل از تاریخ شروع باشد.");
      }
      return Promise.resolve();
    },
  });
  const rules = [
    {
      required: true,
      message: "تاریخ اتمام اجباری است",
    },
    checkEndDate,
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تا تاریخ"
      name="end_date"
      rules={rules}
    />
  );
};

const RestType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "مهمانسرا", value: "مهمانسرا" },
    { label: "پروژه", value: "پروژه" },
    { label: "هتل", value: "هتل" },
    { label: "سایر", value: "سایر" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="محل اقامت" name="rest_type" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const CommutingType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "خودروی شخصی", value: "خودروی شخصی" },
    { label: "خودروی شرکت با راننده", value: "خودروی شرکت با راننده" },
    { label: "خودروی شرکت بدون راننده", value: "خودروی شرکت بدون راننده" },
    { label: "آژانس", value: "آژانس" },
    { label: "سواری", value: "سواری" },
    { label: "اتوبوس", value: "اتوبوس" },
    { label: "قطار", value: "قطار" },
    { label: "هواپیما", value: "هواپیما" },
    { label: "سایر", value: "سایر" },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="وسیله رفت و برگشت" name="commuting_type" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const Description = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export {
  Person,
  Type,
  Place,
  Subject,
  StartDate,
  EndDate,
  RestType,
  CommutingType,
  Description,
};
