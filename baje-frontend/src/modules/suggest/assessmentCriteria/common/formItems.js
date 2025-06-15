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
import { assessmentMethod, itemStatus } from "../const";
import { committeeMemberPosition } from "../../committee/const";
import { accidentLocation } from "../../../personnel/accidentReport/const";

const Committee = ({ onChange, items, disabled = false }) => {
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
      <Form.Item label="کارگروه" name="workgroup_id" rules={rules}>
        <Select options={options} onChange={onChange} disabled={disabled} />
      </Form.Item>
    </Col>
  );
};

const Name = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نام ملاک" name={"name"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const Method = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: assessmentMethod.SCORE, value: assessmentMethod.SCORE },
    { label: assessmentMethod.QUALITY, value: assessmentMethod.QUALITY },
    {
      label: assessmentMethod.QUALITY_OBJECTIVE,
      value: assessmentMethod.QUALITY_OBJECTIVE,
    },
    { label: assessmentMethod.QUESTION, value: assessmentMethod.QUESTION },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="شیوه امتیازدهی" name="rate_type" rules={rules}>
        <Select options={options} onChange={onChange}></Select>
      </Form.Item>
    </Col>
  );
};

const WeightFactor = () => {
  const toThreeOptions = [];
  for (let i = 1; i <= 3; i++) {
    toThreeOptions.push({ label: i, value: i });
  }

  const toTwelveOptions = [];
  for (let i = 1; i <= 12; i++) {
    toTwelveOptions.push({ label: i, value: i });
  }

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return [
          assessmentMethod.QUALITY,
          assessmentMethod.QUALITY_OBJECTIVE,
          assessmentMethod.SCORE,
          assessmentMethod.QUESTION,
        ].includes(form.getFieldValue("rate_type")) ? (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item
              label="ضریب وزنی"
              name={"weight_factor"}
              normalize={numberNormalize}
              extra={
                form.getFieldValue("rate_type") === assessmentMethod.QUESTION
                  ? "حداکثر ۱۲"
                  : "حداکثر ۳"
              }
            >
              <Select
                options={
                  form.getFieldValue("rate_type") === assessmentMethod.QUESTION
                    ? toTwelveOptions
                    : toThreeOptions
                }
              />
            </Form.Item>
          </Col>
        ) : null;
      }}
    </Form.Item>
  );
};

const ScoreRange = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [];
  for (let i = 4; i <= 12; i++) {
    options.push({ label: i + "-0", value: i });
  }

  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return form.getFieldValue("rate_type") === null ? (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item label="بازه امتیاز" name="max_point" rules={rules}>
              <Select options={options} onChange={onChange} />
            </Form.Item>
          </Col>
        ) : null;
      }}
    </Form.Item>
  );
};

const Status = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="وضعیت" name={"is_enabled"} rules={rules}>
        <Radio.Group>
          <Radio value={itemStatus.ACTIVE}>فعال</Radio>
          <Radio value={itemStatus.DISABLE}>غیرفعال</Radio>
        </Radio.Group>
      </Form.Item>
    </Col>
  );
};

const Description = () => {
  const rules = [];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name={"description"} rules={rules}>
        <Input.TextArea />
      </Form.Item>
    </Col>
  );
};

export {
  Committee,
  Name,
  Method,
  WeightFactor,
  ScoreRange,
  Status,
  Description,
};
