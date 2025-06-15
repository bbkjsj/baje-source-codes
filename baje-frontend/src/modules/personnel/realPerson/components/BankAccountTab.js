import React from "react";
import { Row, Divider } from "antd";
import {
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
} from "./bankAccountTab/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { formRowGutter } from "../../../../constant";

const BankAccountTab = ({ onSubmit, loading, useForm }) => {
  return (
    <Row gutter={formRowGutter}>
      <Divider orientation="right">حساب اول</Divider>
      <BankAccountOne />
      <ShebaOne />
      <BankNameOne />
      <Divider orientation="right">حساب دوم</Divider>
      <BankAccountTwo />
      <ShebaTwo />
      <BankNameTwo />
      <Divider orientation="right">حساب سوم</Divider>
      <BankAccountThree />
      <ShebaThree />
      <BankNameThree />
      <Divider orientation="right">حساب چهارم</Divider>
      <BankAccountFour />
      <ShebaFour />
      <BankNameFour />
      <Divider orientation="right">حساب پنجم</Divider>
      <BankAccountFive />
      <ShebaFive />
      <BankNameFive />
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default BankAccountTab;
