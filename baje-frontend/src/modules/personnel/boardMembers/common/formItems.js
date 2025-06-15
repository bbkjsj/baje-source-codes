import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import {
  JobCodeInput,
  NationalIdInput,
} from "modules/personnel/realPerson/service/formItems";
import { memberRoles, signatureRights } from "../utils/const";

const Person = ({ useForm, setPerson, defaultValue = false, edit = false }) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="person_national_code"
      label="شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      defaultValue={defaultValue}
    />
  );
};

const Role = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "مدیر عامل", value: memberRoles.managing_director },
    {
      label: "مدیرعامل و عضو هیئت مدیره",
      value: memberRoles.md_board_of_directors,
    },
    {
      label: "مدیرعامل و رئیس هیئت مدیره",
      value: memberRoles.md_chairman,
    },
    {
      label: "مدیرعامل و نایب رئیس هیئت مدیره",
      value: memberRoles.md_vice_chairman,
    },
    { label: "رئیس هیئت مدیره", value: memberRoles.chairman },
    { label: "نایب رئیس هیئت مدیره", value: memberRoles.vice_chairman },
    { label: "عضو هیئت مدیره", value: memberRoles.board_of_directors },
    { label: "سرپرست", value: memberRoles.supervisor },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="سمت" name="role" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
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
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("to_date") < value) {
          return Promise.reject("تاریخ شروع نباید پس از تاریخ پایان باشد");
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="از تاریخ"
      name="from_date"
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
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (checkShamsi(value, false) && getFieldValue("from_date") > value) {
          return Promise.reject("تاریخ پایان نباید قبل از تاریخ شروع باشد");
        }
        return Promise.resolve();
      },
    }),
  ];

  return (
    <CustomDatePicker
      form={useForm}
      label="تا تاریخ"
      name="to_date"
      rules={rules}
    />
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

const Signature = ({ detail }) => {
  //const rules = [{ required: true }];

  const options = [
    { label: "اسناد اداری", value: signatureRights.official_documents },
    { label: "اسناد تجاری", value: signatureRights.commercial_documents },
  ];

  return (
    <Form.Item
      label="صاحب امضای"
      name="signature_rights"
      //rules={rules}
    >
      <Checkbox.Group options={options} disabled={detail} />
    </Form.Item>
  );
};

export { Person, StartDate, Role, EndDate, Description, Signature };
