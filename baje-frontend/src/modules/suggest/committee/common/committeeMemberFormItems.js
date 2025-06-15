import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import { NationalIdInput } from "modules/personnel/realPerson/service/formItems";
import { committeeMemberPosition } from "../const";
import AppFormItem from "../../../../components/general/AppFormItem";
import { EXCELLENT_COMMITTEE_ID, SECRETARIAT_COMMITTEE_ID } from "../../const";

const Person = ({
  useForm,
  setPerson,
  defaultValue = false,
  edit = false,
  disabled = false,
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
      disabled={disabled}
    />
  );
};

const Committee = ({ onChange, items, disabled = false }) => {
  const rules = [
    {
      required: true,
    },
  ];

  let options = [
    { label: "دبیرخانه نظام پیشنهادات", value: SECRETARIAT_COMMITTEE_ID },
    { label: "کارگروه عالی نظام پیشنهادات", value: EXCELLENT_COMMITTEE_ID },
  ];

  if (items)
    options = [
      ...options,
      ...items.map((item) => {
        return { label: item.name, value: item.id };
      }),
    ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="کارگروه" name="wid" rules={rules}>
        <Select options={options} onChange={onChange} disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const Position = ({ onChange, secretaryExists, disabled = false }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "دبیر", value: committeeMemberPosition.SECRETARY },
    { label: "عضو", value: committeeMemberPosition.MEMBER },
  ];

  let extraInfo = secretaryExists
    ? "دبیر قبلا تعیین شده است"
    : "اولین عضو باید دبیر باشد";

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="سمت" name="position" rules={rules} extra={extraInfo}>
        <Select options={options} onChange={onChange} disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const StartDate = ({ useForm, onChange, isNew, disabled = true }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ شروع عضویت اجباری است",
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
    <Form.Item shouldUpdate={true} noStyle={true}>
      {(form) => (
        <CustomDatePicker
          form={useForm}
          label="تاریخ شروع عضویت"
          name="member_from"
          minimumDate={utils("fa").getToday()}
          rules={rules}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </Form.Item>
  );
};

const FinishDate = ({ useForm, onChange, isNew, disabled = false }) => {
  const rules = [
    () => ({
      validator(rule, value) {
        if (!value || checkShamsi(value, false)) {
          return Promise.resolve();
        } else {
          return Promise.reject("فرمت تاریخ صحیح نیست");
        }
      },
    }),
  ];

  return (
    <Form.Item shouldUpdate={true} noStyle={true}>
      {(form) => (
        <CustomDatePicker
          form={useForm}
          label="تاریخ پایان عضویت"
          name="member_to"
          minimumDate={utils("fa").getToday()}
          rules={rules}
          onChange={onChange}
          disabled={
            form.getFieldValue("position") === committeeMemberPosition.SECRETARY
          }
        />
      )}
    </Form.Item>
  );
};

export { Person, Committee, Position, StartDate, FinishDate };
