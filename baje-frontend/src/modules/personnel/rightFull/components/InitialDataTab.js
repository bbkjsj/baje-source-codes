import React from "react";
import {
  NationalId,
  FinanceCode,
  Name,
  RegisterNumber,
  RegisterDate,
  SignOwners,
  Description,
  Logo,
  Sign,
  Seal,
  Manager,
} from "./initialDataTab/FormItems";
import { Row } from "antd";
import SubmitBtn from "components/general/SubmitBtn";

const FirstDataTab = ({
  useForm,
  onSubmit,
  loading,
  setManager,
  formType,
  manager,
}) => {
  const onPreview = (file) => {
    console.log("file in on privew", file);
  };

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <NationalId useForm={useForm} />
      <FinanceCode />

      <Name />
      <RegisterNumber />
      <RegisterDate useForm={useForm} />
      <Manager
        useForm={useForm}
        setManager={setManager}
        formType={formType}
        manager={manager}
      />
      <SignOwners />
      <Description />
      <Logo onPreview={onPreview} />
      <Sign />
      <Seal />
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default FirstDataTab;
