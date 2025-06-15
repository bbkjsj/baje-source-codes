import React from "react";
import { Phone, PostalCode, Email, Address } from "./contactInfoTab/FormItems";
import { Row, Button } from "antd";
import SubmitBtn from "components/general/SubmitBtn";

const ContactInfoTab = ({ onSubmit, loading }) => {
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Phone />
      <PostalCode />
      <Email />
      <Address />
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default ContactInfoTab;
