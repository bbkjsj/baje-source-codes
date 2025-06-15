import {
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  message,
  Row,
  Modal,
  Button,
  Switch,
  InputNumber,
  Space,
  Divider,
  List,
  Upload,
  Spin,
} from "antd";
import {} from "@ant-design/icons";
import styled from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import {
  qualityAssessmentValues,
  qualityObjectiveAssessmentValues,
} from "../const";
import { participationType } from "../../suggestion/const";

const localFormColSpan = { xs: 24, lg: 12, xl: 8 };

export const Title = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col {...localFormColSpan}>
      <Form.Item label="عنوان پیشنهاد" name={"title"} rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

export const ScoreAssessment = ({
  title,
  description = null,
  criteriaId,
  maxValue,
  onChange,
}) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [];
  for (let i = 0; i <= maxValue; i++) {
    options.push({ label: i, value: i });
  }

  return (
    <Col {...localFormColSpan}>
      <Form.Item
        label={title}
        name={"assess_" + criteriaId}
        rules={rules}
        extra={description}
      >
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const QualityAssessment = ({
  title,
  description = null,
  criteriaId,
  onChange,
}) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "خیلی ضعیف", value: qualityAssessmentValues.VERY_WEAK },
    { label: "ضعیف", value: qualityAssessmentValues.WEAK },
    { label: "متوسط", value: qualityAssessmentValues.MEDIUM },
    { label: "خوب", value: qualityAssessmentValues.GOOD },
    { label: "خیلی خوب", value: qualityAssessmentValues.VERY_GOOD },
  ];

  return (
    <Col {...localFormColSpan}>
      <Form.Item
        label={title}
        name={"assess_" + criteriaId}
        rules={rules}
        extra={description}
      >
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const QualityObjectiveAssessment = ({
  title,
  description = null,
  criteriaId,
  onChange,
}) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = [
    { label: "هیچ", value: qualityObjectiveAssessmentValues.NONE },
    { label: "کم", value: qualityObjectiveAssessmentValues.LOW },
    { label: "متوسط", value: qualityObjectiveAssessmentValues.MIDDLE },
    { label: "زیاد", value: qualityObjectiveAssessmentValues.HIGH },
    { label: "خیلی زیاد", value: qualityObjectiveAssessmentValues.VERY_HIGH },
  ];

  return (
    <Col {...localFormColSpan}>
      <Form.Item
        label={title}
        name={"assess_" + criteriaId}
        rules={rules}
        extra={description}
      >
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const QuestionAssessment = ({
  title,
  description = null,
  criteriaId,
  onChange,
}) => {
  return (
    <Col {...localFormColSpan}>
      <Form.Item
        label={title}
        name={"assess_" + criteriaId}
        initialValue={true}
        extra={description}
      >
        <Radio.Group>
          <Radio value={true}>بلی</Radio>
          <Radio value={false}>خیر</Radio>
        </Radio.Group>
      </Form.Item>
    </Col>
  );
};

export const RejectionCriteria = ({
  title,
  description = null,
  criteriaId,
  onChange,
}) => {
  return (
    <Col {...localFormColSpan}>
      <Form.Item
        label={title}
        name={"reject_" + criteriaId}
        valuePropName="checked"
        extra={description}
      >
        <Checkbox onChange={onChange} />
      </Form.Item>
    </Col>
  );
};
