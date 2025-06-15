import { Col, Form, Input, Select, Checkbox, message, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { checkShamsi, countOfNumInp, numberNormalize } from "_helpers";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { utils } from "react-modern-calendar-datepicker";
import {
  JobCodeInput,
  NationalIdInput,
} from "modules/personnel/realPerson/service/formItems";
import PeriodTime from "../../../../../components/PeriodTime";
import { resultTypes } from "../../examination/formItems";
import AppFormItem from "components/general/AppFormItem";
import AppInputNumber from "components/general/AppNumInput";

const Person = ({
  useForm,
  setPerson,
  edit = false,
  disabled,
  defaultValue = false,
  button = true,
}) => {
  return (
    <NationalIdInput
      type={edit ? "edit" : "send"}
      codeField="person_personnel_id"
      nameField="person_name"
      name="personnel_id"
      defaultValue={defaultValue}
      label="انتخاب شخص"
      url="/api/admin/personnel/lookup"
      form={useForm}
      setData={setPerson}
      isRequired={true}
      disabled={button}
    />
  );
};

const Amount = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="مبلغ درخواستی" name="amount" rules={rules}>
        <AppInputNumber disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const Count = ({ onChange, disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [...Array(36).keys()].map((val) => ({
    label: val + 1,
    value: val + 1,
  }));

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="تعداد اقساط" name="installment" rules={rules}>
        <Select
          options={options}
          onChange={onChange}
          disabled={disabled}
        ></Select>
      </AppFormItem>
    </Col>
  );
};

const Description = ({ disabled }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <AppFormItem label="توضیحات" name="description">
        <Input.TextArea disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

export { Person, Amount, Count, Description };
