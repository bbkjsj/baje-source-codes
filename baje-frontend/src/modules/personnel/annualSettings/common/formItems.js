import { Col, Input } from "antd";
import React, { useEffect, useState } from "react";
import AppFormItem from "components/general/AppFormItem";
import AppNumInput from "components/general/AppNumInput";
import { formColSpan } from "../../../../constant";

const Year = ({ disabled }) => {
  const rules = [
    {
      required: true,
      max: 4,
    },
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem label="سال" name="year" rules={rules}>
        <Input type="number" disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const MinSalary = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem label="حداقل دستمزد روزانه" name="min_salary" rules={rules}>
        <AppNumInput disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const MaxSalary = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem label="حداکثر دستمزد روزانه" name="max_salary" rules={rules}>
        <AppNumInput disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const Bonus = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem label="مزایای انگیزشی و رفاهی" name="bonus" rules={rules}>
        <AppNumInput disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const Housing = ({ disabled }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...formColSpan}>
      <AppFormItem label="حق مسکن" name="housing" rules={rules}>
        <AppNumInput disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

const Description = ({ disabled }) => {
  return (
    <Col {...formColSpan}>
      <AppFormItem label="توضیحات" name="description">
        <Input.TextArea disabled={disabled} />
      </AppFormItem>
    </Col>
  );
};

export { Year, MinSalary, MaxSalary, Bonus, Housing, Description };
