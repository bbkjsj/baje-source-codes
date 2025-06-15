import React, { useState } from "react";
import { Row, Divider } from "antd";
import {
  NationalNumber,
  BirthDate,
  Name,
  LastName,
  FatherName,
  IDNumber,
  Sex,
  BirthPlace,
  IDIssuePlace,
  Nation,
  PublicDescription,
  PrivateDescription,
  ContractID,
  MaritalStatus,
  ArmyService,
  Education,
  StudyField,
  Username,
  Password,
  ConfirmPassword,
  Isargar,
  ShahidWasColleague,
  ShahidName,
  JanbazName,
  VeteranPercentage,
  PeriodTimeFighting,
  PeriodTimeNoble,
} from "./mainInfoTab/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import {
  handleSetIDNumber,
  handleCheckNationalNumber,
  handleValidateNationalNumber,
  handleSetIssuePlace,
  handleSetUserName,
  handleSetPassword,
} from "../utils/formUtils";
import { formRowGutter } from "../../../../constant";

const MainInfoTab = ({ useForm, loading, onSubmit, edit, isargar }) => {
  // for condition on inputs that have dependency on isargar input
  const [isargarValue, setIsargarValue] = useState(isargar ? isargar : "none");

  const handleOnChangeBirthDate = () => {
    handleSetIDNumber(useForm);
  };

  const handleOnChangeNationalNumber = (event) => {
    handleSetIDNumber(useForm);
    handleSetUserName(useForm);
    handleSetPassword(useForm);
    if (event.target.value.length > 8) handleOnBlurNationalNumber(event);
  };

  const handleOnBlurNationalNumber = (event) => {
    try {
      handleValidateNationalNumber(event, useForm)
        .then(() => {})
        .catch(() => {
          return;
        });
    } catch (e) {}
    handleCheckNationalNumber(event, useForm);
    handleSetIssuePlace(event.target.value, useForm);
  };

  const handleOnChangeIsargar = (value) => {
    setIsargarValue(value);
  };

  return (
    <Row gutter={formRowGutter}>
      <BirthDate useForm={useForm} onChange={handleOnChangeBirthDate} />

      <NationalNumber
        onChange={handleOnChangeNationalNumber}
        // onBlur={handleOnBlurNationalNumber}
        edit={edit}
      />
      <Name />
      <LastName />
      <FatherName />
      <IDNumber />
      <Sex />
      <BirthPlace />
      <IDIssuePlace />
      <Nation />
      <PublicDescription />
      <PrivateDescription />
      <ContractID useForm={useForm} />
      <MaritalStatus />
      <ArmyService />
      <Education />
      <StudyField />
      <Username edit={edit} />
      <Password edit={edit} />
      <ConfirmPassword edit={edit} />
      <Divider orientation="right">وضعیت ایثار گری</Divider>
      <Isargar onChange={handleOnChangeIsargar} />
      {isargarValue === "child_of" && <ShahidName />}
      {isargarValue === "wife_of" && <ShahidName />}
      {isargarValue === "پدر شهید" && <ShahidName />}
      {isargarValue === "برادر شهید" && <ShahidName />}
      {isargarValue === "مادر شهید" && <ShahidName />}
      {isargarValue === "خواهر شهید" && <ShahidName />}
      {isargarValue === "پدر جانباز" && <JanbazName />}
      {isargarValue === "برادر جانباز" && <JanbazName />}
      {isargarValue === "مادر جانباز" && <JanbazName />}
      {isargarValue === "خواهر جانباز" && <JanbazName />}
      {isargarValue === "veteran" && <VeteranPercentage />}
      {isargarValue === "fighting" && <PeriodTimeFighting />}
      {isargarValue === "noble" && <PeriodTimeNoble />}
      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default MainInfoTab;
