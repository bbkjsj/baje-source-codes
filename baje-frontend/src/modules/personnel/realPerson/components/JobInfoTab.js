import React, { useState } from "react";
import * as Inputs from "./jobInfoTab/FormItems";
import { Row } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import { handleCheckInsuranceNumber } from "../utils/formUtils";
import { If } from "components/Syntax";
import { formRowGutter } from "../../../../constant";

const JobInfoTab = ({ onSubmit, loading, useForm, jobTitle, defaultData }) => {
  console.log("defaultData", defaultData);
  const [jobStatus, setJobStatus] = useState(
    defaultData ? defaultData.job_status : null
  );
  const [employmentType, setEmploymentType] = useState(
    defaultData ? defaultData.employeement_type : null
  );

  const handleOnBlurInsuranceNumber = (event) => {
    handleCheckInsuranceNumber(useForm, event.target.value);
  };

  const handleOnChangeJobStatus = (event) => {
    let value = event.target.value;
    setJobStatus(value);
  };

  const handelOnChangeEmploymentType = (value) => {
    console.log("on change", value);
    setEmploymentType(value);
  };

  return (
    <Row gutter={formRowGutter}>
      <Inputs.JobTitleID useForm={useForm} initialValue={jobTitle} />
      <Inputs.InsuranceNumber onBlur={handleOnBlurInsuranceNumber} />
      <Inputs.PersonnelId />
      <Inputs.JobType />
      <Inputs.InsuranceShareEmployee />
      <Inputs.InsuranceShareEmployer />
      <Inputs.InsuranceShareUnemployment />
      <Inputs.InsuranceShareHarmful />
      <Inputs.EmploymentDate useForm={useForm} />
      <Inputs.EmploymentType onChange={handelOnChangeEmploymentType} />
      <If condition={employmentType === "temporary_contract"}>
        <Inputs.StartContractDate useForm={useForm} />
        <Inputs.FinishContractDate useForm={useForm} />
      </If>
      <Inputs.HistoryTotalDay />
      <Inputs.JobStatus onChange={handleOnChangeJobStatus} />
      <If condition={jobStatus === "inactive"}>
        <Inputs.ExpireTime useForm={useForm} />
        <Inputs.ExpireReason />
      </If>

      <SubmitBtn customFunction={onSubmit} loading={loading} />
    </Row>
  );
};

export default JobInfoTab;
