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
import { problemReportType, problemResultType } from "../const";

export const Title = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="عنوان مشکل" name="title" rules={rules}>
        <Input />
      </Form.Item>
    </Col>
  );
};

export const ProblemType = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = Object.entries(problemReportType).map(([key, value]) => {
    return { label: value, value: value };
  });

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نوع مشکل" name="type" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const CustomProblemType = () => {
  return (
    <Form.Item shouldUpdate noStyle>
      {(form) =>
        form.getFieldValue("type") === problemReportType.OTHER && (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item label="عنوان نوع مشکل" name={"type_custom_title"}>
              <Input placeholder="نوع مشکل را وارد کنید..." />
            </Form.Item>
          </Col>
        )
      }
    </Form.Item>
  );
};

export const ProblemDate = ({ useForm, onChange }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ بروز مشکل اجباری است",
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
      label="تاریخ بروز مشکل"
      name="problem_date"
      rules={rules}
      onChange={onChange}
    />
  );
};

export const ProblemResult = ({ onChange }) => {
  const rules = [
    {
      required: true,
    },
  ];

  const options = Object.entries(problemResultType).map(([key, value]) => {
    return { label: value, value: value };
  });

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نتیجه بروز مشکل" name="result" rules={rules}>
        <Select options={options} onChange={onChange} />
      </Form.Item>
    </Col>
  );
};

export const CustomProblemResult = () => {
  const rules = [];

  return (
    <Form.Item shouldUpdate noStyle>
      {(form) =>
        form.getFieldValue("result") === problemResultType.OTHER && (
          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <Form.Item
              label="عنوان نتیجه بروز مشکل"
              name={"result_custom"}
              rules={rules}
            >
              <Input placeholder="نتیجه بروز مشکل را وارد کنید..." />
            </Form.Item>
          </Col>
        )
      }
    </Form.Item>
  );
};

export const Description = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="شرح مشکل" name={"description"} rules={rules}>
        <Input.TextArea style={{ minHeight: "120px" }} />
      </Form.Item>
    </Col>
  );
};

export const Solution = () => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="راه حل پیشنهادی" name={"solution"} rules={rules}>
        <Input.TextArea style={{ minHeight: "120px" }} />
      </Form.Item>
    </Col>
  );
};
