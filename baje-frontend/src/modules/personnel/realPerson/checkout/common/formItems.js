import React, { useEffect, useState } from "react";
import { Col, Form, Input, Select } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { formColSpan } from "../../../../../constant";

const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
      disabled={button}
    />
  );
};

const Reason = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "پایان قرارداد", value: "پایان قرارداد" },
    { label: "درخواست پرسنل", value: "درخواست پرسنل" },
    { label: "کمیته انضباطی", value: "کمیته انضباطی" },
    {
      label: "انتقال به سایر شرکت‌های گروه",
      value: "انتقال به سایر شرکت‌های گروه",
    },
    { label: "سایر", value: "سایر" },
  ];

  return (
    <Col {...formColSpan}>
      <Form.Item label="علت تسویه" name="reason" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const Date = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ تسویه اجباری است",
    },
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تاریخ تسویه"
      name="date"
      //maximumDate={utils("fa").getToday()}
      rules={rules}
      onChange={onChange}
    />
  );
};

const Description = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export { Person, Date, Reason, Description };
