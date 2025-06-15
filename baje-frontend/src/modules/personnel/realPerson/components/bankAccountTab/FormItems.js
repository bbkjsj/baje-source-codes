import React from "react";
import { Col, Form, Input, Select } from "antd";
import { numberNormalize } from "_helpers";
import bankList from "json/BankList";
import { formColSpan } from "../../../../../constant";

const BankAccountOne = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره حساب"
        name={"bank_account1/bankAccountTab"}
        normalize={numberNormalize}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const ShebaOne = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره شبا" name={"sheba1/bankAccountTab"}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const BankNameOne = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام بانک" name="bank_name1/bankAccountTab">
        <Select showSearch options={bankList}></Select>
      </Form.Item>
    </Col>
  );
};

const BankAccountTwo = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره حساب"
        name={"bank_account2/bankAccountTab"}
        normalize={numberNormalize}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const ShebaTwo = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره شبا" name={"sheba2/bankAccountTab"}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const BankNameTwo = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام بانک" name="bank_name2/bankAccountTab">
        <Select showSearch options={bankList}></Select>
      </Form.Item>
    </Col>
  );
};

const BankAccountThree = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره حساب"
        name={"bank_account3/bankAccountTab"}
        normalize={numberNormalize}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const ShebaThree = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره شبا" name={"sheba3/bankAccountTab"}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const BankNameThree = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام بانک" name="bank_name3/bankAccountTab">
        <Select showSearch options={bankList}></Select>
      </Form.Item>
    </Col>
  );
};

const BankAccountFour = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item
        label="شماره حساب"
        name={"bank_account4/bankAccountTab"}
        normalize={numberNormalize}
      >
        <Input />
      </Form.Item>
    </Col>
  );
};

const ShebaFour = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره شبا" name={"sheba4/bankAccountTab"}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const BankNameFour = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام بانک" name="bank_name4/bankAccountTab">
        <Select showSearch options={bankList}></Select>
      </Form.Item>
    </Col>
  );
};

const BankAccountFive = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره حساب" name={"bank_account5/bankAccountTab"}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const ShebaFive = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="شماره شبا" name={"sheba5/bankAccountTab"}>
        <Input />
      </Form.Item>
    </Col>
  );
};

const BankNameFive = () => {
  return (
    <Col {...formColSpan}>
      <Form.Item label="نام بانک" name="bank_name5/bankAccountTab">
        <Select showSearch options={bankList}></Select>
      </Form.Item>
    </Col>
  );
};

export {
  BankAccountOne,
  ShebaOne,
  BankNameOne,
  BankAccountTwo,
  BankNameTwo,
  ShebaTwo,
  BankAccountThree,
  BankNameThree,
  ShebaThree,
  BankAccountFour,
  BankNameFour,
  ShebaFour,
  BankAccountFive,
  BankNameFive,
  ShebaFive,
};
