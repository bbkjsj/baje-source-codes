import React from "react";
import { Row } from "antd";
import {
  BirthCertificate,
  NationalCardFront,
  NationalCardRear,
  Sign,
  Person,
  ArmyServiceCard,
  EducationalDocument,
} from "./uploadDocTab/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { formRowGutter } from "../../../../constant";

const UploadDocTab = ({ onSubmit, loading, useForm }) => {
  return (
    <Row gutter={formRowGutter}>
      <BirthCertificate />
      <NationalCardFront />
      <NationalCardRear />
      <Person />
      <ArmyServiceCard />
      <Sign />
      <EducationalDocument />
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default UploadDocTab;
