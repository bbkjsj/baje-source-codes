import React, { useState } from "react";
import { Row } from "antd";
import {
  MobileOne,
  MobileTwo,
  Phone,
  Email,
  Address,
  PostalCode,
} from "./contactInfoTab/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { formRowGutter } from "../../../../constant";

const ContactInfoTab = ({ onSubmit, loading, useForm }) => {
  return (
    <Row gutter={formRowGutter}>
      <MobileOne />
      <MobileTwo />
      <Phone />
      <Email />
      <PostalCode />
      <Address />
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default ContactInfoTab;
