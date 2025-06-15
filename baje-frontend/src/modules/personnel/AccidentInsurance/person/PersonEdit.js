import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button, Spin } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN, covetFormatDateToFA } from "_helpers";
import { withRouter } from "react-router-dom";
import { useEditPerson } from "./util/hooks";
import { AccidentInsuranceContext } from "../util/AccidentInsuranceContext";

const PersonEdit = ({ match, updateList, personInfo, personId }) => {
  const [form] = Form.useForm();
  const [mainPersonOption, setMainPersonOption] = useState([]);
  const [personType, setPersonType] = useState(false);
  const insuranceID = match.params.id;
  const { submit, loading: submitLoading } = useEditPerson(form, updateList);
  const [nationalId, setNationalId] = useState(null);

  const insuranceContext = useContext(AccidentInsuranceContext);

  const handleOnFinish = (values) => {
    // convert date
    values.insurance_id = insuranceContext.insurance.id;
    values.start_date = convertDateToEN(values.start_date);
    values.end_date = convertDateToEN(values.end_date);

    if (!values.main_insurer_personnel_id) {
      values.main_insurer_personnel_id = values.personnel_id;
    }
    submit(personInfo[0].id, values);
  };

  const handleSetMainPersonOption = (persons) => {
    setMainPersonOption(
      persons.map((el) => ({
        label: el.first_name + " " + el.last_name,
        value: el.id,
      }))
    );
  };

  useEffect(() => {
    form.resetFields();
  }, [personId]);

  useEffect(() => {
    const nationalID = personInfo[0].sub_natinal_number
      ? personInfo[0].sub_natinal_number
      : personInfo[0].main_national_number;

    form.setFieldsValue({
      national_id: nationalID,
      ...personInfo[0],
      main_insurer_personnel_id: personInfo[0].main_id,
      start_date: covetFormatDateToFA(personInfo[0].start_date, false),
      end_date: covetFormatDateToFA(personInfo[0].end_date, false),
    });

    setNationalId(nationalID);
  }, [personInfo]);

  return (
    <>
      {/* <GoBackBtn />
      <h2>افزدون فرد به لیست بیمه</h2> */}
      {/* <Spin spinning={loading}> */}
      <Form
        form={form}
        name="PersonEdit"
        onFinish={handleOnFinish}
        layout="vertical"
      >
        <FormItems.UserID useForm={form} />
        <FormItems.MainUserID useForm={form} />
        <FormItems.UserStatus useForm={form} />
        {/* {} */}
        <FormItems.NationalID
          edit
          useForm={form}
          setMainPersonOption={handleSetMainPersonOption}
          insuranceInfo={insuranceContext.insurance}
          initialValue={nationalId}
        />
        <FormItems.UserFullName useForm={form} edit />
        {/* {personType && <FormItems.PersonType useForm={form} />} */}
        <FormItems.WitchMainPerson
          useForm={form}
          option={mainPersonOption}
          edit
        />
        <FormItems.StartDateInsurance useForm={form} edit />
        <FormItems.EndDateInsurance useForm={form} edit />
        <FormItems.Description edit />
        <SubmitBtn loading={submitLoading} />
      </Form>
      {/* </Spin> */}
    </>
  );
};

export default withRouter(PersonEdit);
