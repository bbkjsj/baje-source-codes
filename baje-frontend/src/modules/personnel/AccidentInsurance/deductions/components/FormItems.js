import React, { useEffect, useContext } from "react";
import { Col, Form, Radio, Input, Select } from "antd";
import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import { checkShamsi, countOfNumInp, convertToNumber } from "_helpers";
import Months from "json/Months";
import AppNumInput from "components/general/AppNumInput";
import * as values from "../const";
import { formColSpan } from "../../../../../constant";

const PaymentMethod = ({ detail }) => {
  const rules = [{ required: true }];

  const option = [
    {
      label: values.paymentMethodValues.DEDUCTION_OF_CLAIMS,
      value: values.paymentMethodValues.DEDUCTION_OF_CLAIMS,
    },
    {
      label: values.paymentMethodValues.DEDUCTION_OF_SALARIES,
      value: values.paymentMethodValues.DEDUCTION_OF_SALARIES,
    },
    {
      label: values.paymentMethodValues.SUNDRY,
      value: values.paymentMethodValues.SUNDRY,
    },
  ];
  return (
    <Col {...formColSpan}>
      <Form.Item label="نحوه پرداخت" name="payment_method" rules={rules}>
        <Radio.Group options={option} disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const DeductionsSalariesYear = () => {
  const rules = [{ required: true }];

  return (
    <CheckSalaries>
      <Col {...formColSpan}>
        <Form.Item
          label="سال کسر از حقوق"
          name="year"
          rules={rules}
          normalize={(value, prevValue) => countOfNumInp(value, prevValue, 4)}
        >
          <Input />
        </Form.Item>
      </Col>
    </CheckSalaries>
  );
};

const DeductionsSalariesMonth = ({ detail }) => {
  return (
    <CheckSalaries>
      <Col {...formColSpan}>
        <Form.Item name={"month"} label="ماه" rules={[{ required: true }]}>
          <Select options={Months} disabled={detail} />
        </Form.Item>
      </Col>
    </CheckSalaries>
  );
};

// DEDUCTION_OF_CLAIMS
const DocumentNumber = () => {
  const rules = [{ required: true }];
  return (
    <CheckClaims>
      <Col {...formColSpan}>
        <Form.Item
          label="شماره سند"
          name="document_number"
          rules={rules}
          normalize={convertToNumber}
        >
          <Input />
        </Form.Item>
      </Col>
    </CheckClaims>
  );
};

const DocumentDate = ({ useForm, detail }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ سند اجباری است",
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
    <CheckClaims>
      <CustomDatePicker
        form={useForm}
        label="تاریخ سند"
        name="document_date"
        rules={rules}
        disabled={detail}
      />
    </CheckClaims>
  );
};

// SUNDRY
const PaymentDate = ({ useForm, detail }) => {
  const rules = [
    {
      required: true,
      message: "تاریخ پرداخت اجباری است",
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
      label="تاریخ پرداخت"
      name="payment_date"
      rules={rules}
      disabled={detail}
    />
  );
};

const PaymentDescription = ({ detail }) => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const Payed = ({ detail }) => {
  return (
    // <CheckSundry>
    <Col {...formColSpan}>
      <Form.Item
        label="مبلغ پرداخت شده"
        name="amount"
        // normalize={priceNormalizer}
      >
        <AppNumInput disabled={detail} />
      </Form.Item>
    </Col>
    // </CheckSundry>
  );
};

const CheckSalaries = ({ children }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          form.getFieldValue("payment_method") ===
            values.paymentMethodValues.DEDUCTION_OF_SALARIES && children
        );
      }}
    </Form.Item>
  );
};

const CheckClaims = ({ children }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          form.getFieldValue("payment_method") ===
            values.paymentMethodValues.DEDUCTION_OF_CLAIMS && children
        );
      }}
    </Form.Item>
  );
};

const CheckSundry = ({ children }) => {
  return (
    <Form.Item noStyle shouldUpdate>
      {(form) => {
        return (
          form.getFieldValue("payment_method") ===
            values.paymentMethodValues.SUNDRY && children
        );
      }}
    </Form.Item>
  );
};

export {
  PaymentMethod,
  DeductionsSalariesYear,
  DeductionsSalariesMonth,
  DocumentNumber,
  DocumentDate,
  PaymentDescription,
  PaymentDate,
  Payed,
};
