import React, { useEffect, useContext } from "react";
import { Col, Form, Radio, Input } from "antd";

import CustomDatePicker from "components/renderInput/customDatePicker/CustomDatePicker";
import {
  checkShamsi,
  convertToNumber,
  convertDateToEN,
  covetFormatDateToFA,
} from "_helpers";
import AppNumInput from "components/general/AppNumInput";
import * as values from "../const";

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
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="نحوه پرداخت" name="payment_method" rules={rules}>
        <Radio.Group options={option} disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const DeductionsSalaryPeriod = ({ detail, useForm, insurance }) => {
  const isInvalidPeroid = (data) => {
    const startYear = new Date(
      covetFormatDateToFA(insurance.contract_date_from_date)
    ).getFullYear();
    //
    const startMonth =
      new Date(
        covetFormatDateToFA(insurance.contract_date_from_date)
      ).getMonth() + 1;
    //
    const endYear = new Date(
      covetFormatDateToFA(insurance.to_date)
    ).getFullYear();

    //
    const endMonth =
      new Date(covetFormatDateToFA(insurance.to_date)).getMonth() + 1;

    const year = parseInt(data.slice(0, 4));
    const month = parseInt(data.slice(5, 7));

    return (
      year < startYear ||
      year > endYear ||
      (year == startYear && month < startMonth) ||
      (year == endYear && month > endMonth)
    );
  };
  const Rules = [
    { required: true, message: "وارد کردن دوره حقوق الزامیست " },

    ({ getFieldValue }) => ({
      validator(rule, vlaue) {
        const data = getFieldValue("salary_period");
        if (data && data.length != 7) {
          return Promise.reject(".فرمت دوره صحیح نیس ");
        } else if (
          data &&
          (parseInt(data.slice(5, 7)) > 12 || parseInt(data.slice(5, 7)) < 0)
        ) {
          return Promise.reject("ماه واردشده صحیح نیس ");
        } else if (data && isInvalidPeroid(data)) {
          return Promise.reject("دوره وارد شده خارج از بازه قرارداد می باشد ");
        } else {
          return Promise.resolve();
        }
      },
    }),
  ];

  let timeout = null;
  const onChange = (e) => {
    clearTimeout(timeout);
    const val = useForm.getFieldValue("salary_period");
    let newVal = val;
    timeout = setTimeout(() => {
      if (val && val.length === 4) {
        newVal = val.slice(0, 4) + "-";
      } else if (val && val.length > 4 && !val.includes("-")) {
        newVal = val.slice(0, 4) + "-" + val.slice(4, 6);
      }
      useForm.setFieldsValue({ salary_period: newVal });
    }, 400);
  };
  return (
    <CheckSalaries>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item name={"salary_period"} label="دوره حقوق" rules={Rules}>
          <Input
            onChange={onChange}
            disabled={detail}
            placeholder="سال و ماه حقوق را بدون فاصله وارد نمایید.مثل 140001"
          />
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
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
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
const PaymentDate = ({ useForm, detail, hidden }) => {
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
    <CheckSundry>
      <CustomDatePicker
        form={useForm}
        label="تاریخ پرداخت"
        name="payment_date"
        rules={rules}
        disabled={detail}
      />
    </CheckSundry>
  );
};

const PaymentDescription = ({ detail }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item label="توضیحات" name="description">
        <Input.TextArea disabled={detail} />
      </Form.Item>
    </Col>
  );
};

const Payed = ({ detail }) => {
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        label="مبلغ پرداخت شده (ریال)"
        name="amount"
        // normalize={priceNormalizer}
      >
        <AppNumInput disabled={detail} />
      </Form.Item>
    </Col>
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
  // DeductionsSalariesYear,
  // DeductionsSalariesMonth,
  DocumentNumber,
  DocumentDate,
  PaymentDescription,
  PaymentDate,
  Payed,
  DeductionsSalaryPeriod,
};
