import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import {
  JobCodeInput,
  NationalIdInput,
} from "modules/personnel/realPerson/service/formItems";

const resultTypes = {
  CONTINUE: "امکان ادامه همکاری",
  TERMINATE: "عدم امکان همکاری",
  SPECIAL_CASE: "شرایط خاص",
};

const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  button = true,
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

const Result = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: resultTypes.CONTINUE, value: resultTypes.CONTINUE },
    { label: resultTypes.TERMINATE, value: resultTypes.TERMINATE },
    { label: resultTypes.SPECIAL_CASE, value: resultTypes.SPECIAL_CASE },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نتیجه معاینات" name="result" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const VisitDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ معاینه اجباری است",
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
      label="تاریخ معاینه"
      name="visit_date"
      maximumDate={utils("fa").getToday()}
      rules={rules}
      onChange={onChange}
    />
  );
};

const NextVisitDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ معاینه بعدی اجباری است",
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
      label="تاریخ مراجعه بعدی"
      name="next_visit_date"
      rules={rules}
    />
  );
};

const SpecialDescription = () => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات خاص" name="special_description">
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

const Job = ({ useForm, defaultValue = false, onChange = () => null }) => {
  return (
    <JobCodeInput
      label="شغل"
      name="approved_position"
      codeField="approved_position_code"
      nameField="approved_position_name"
      idField="approved_position_id"
      useForm={useForm}
      onChange={onChange}
      defaultValue={defaultValue}
      fieldRules={[{ requited: true }]}
    />
  );
};

export {
  resultTypes,
  Person,
  Result,
  VisitDate,
  NextVisitDate,
  SpecialDescription,
  Job,
};
