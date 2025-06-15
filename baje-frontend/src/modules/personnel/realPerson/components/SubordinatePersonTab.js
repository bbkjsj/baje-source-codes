import React, { useState } from "react";
import { Row } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import {
  Father,
  Mother,
  Son,
  Daughter,
  Wife,
} from "./subordinatePersonTab/FormItems";
import { formRowGutter } from "../../../../constant";

const SubordinatePersonTab = ({
  onSubmit,
  loading,
  useForm,
  formChangeHandlers,
}) => {
  return (
    <Row gutter={formRowGutter}>
      <Father useForm={useForm} />
      <Mother useForm={useForm} />
      <Son useForm={useForm} />
      <Daughter useForm={useForm} />
      <Wife useForm={useForm} />
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default SubordinatePersonTab;
