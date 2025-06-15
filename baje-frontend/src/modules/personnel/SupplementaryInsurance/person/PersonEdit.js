import React, { useEffect, useState, useContext } from "react";
import { Form, Row } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN, covetFormatDateToFA } from "_helpers";
import { withRouter } from "react-router-dom";
import { useEditPerson, useGetUserAndSubordinate } from "./util/hooks";

const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    lg: { span: 22 },
  },
};

const formStyle = {};

const formGutter = { xs: 8, sm: 16, md: 24, lg: 32 };

const PersonEdit = ({
  match,
  updateList,
  personInfo,
  personId,
  insurance,
  setModal,
}) => {
  const [form] = Form.useForm();
  const [mainPersonOption, setMainPersonOption] = useState([]);
  // const [nationalId, setNationalId] = useState(null);
  const [person, setPerson] = useState(null);
  const insuranceID = match.params.id;
  const { submit, loading: submitLoading } = useEditPerson(form, updateList);

  const {
    getSubordinates: getUserAndSubordinate,
    sub,
    formAssignment,
  } = useGetUserAndSubordinate();

  const handleOnFinish = async (values) => {
    // convert date
    values.insurance_id = insuranceID;
    values.start_date = convertDateToEN(values.start_date);
    values.end_date = convertDateToEN(values.end_date);

    if (!values.main_insurer_personnel_id) {
      values.main_insurer_personnel_id = values.personnel_id;
    }
    await submit(personInfo.id, values);
    setModal(false);
  };

  useEffect(() => {
    form.resetFields();
  }, [personId]);

  useEffect(() => {
    const nationalID = personInfo.main_national_number;
    form.setFieldsValue({
      national_id: nationalID,
      ...personInfo,
      main_insurer_personnel_id: personInfo.main_id,
      start_date: covetFormatDateToFA(personInfo.start_date, false),
      end_date: covetFormatDateToFA(personInfo.end_date, false),
      bank_account1: personInfo.bank_account,
      sheba1: personInfo.sheba,
      bank_name1: personInfo.bank_name,
    });
  }, [personInfo]);

  useEffect(() => {
    if (
      form.getFieldValue("national_id") &&
      personInfo.main_national_number !== form.getFieldValue("national_id")
    ) {
      getUserAndSubordinate(form.getFieldValue("national_id"), insurance).then(
        (res) => {
          if (res) {
            formAssignment(res, form, insurance);
          }
        }
      );
    }
  }, [person]);

  return (
    <>
      {/* <GoBackBtn />
      <h2>افزدون فرد به لیست بیمه</h2> */}
      {/* <Spin spinning={loading}> */}
      <Form
        {...formItemLayout}
        form={form}
        name="PersonEdit"
        style={formStyle}
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.UserID useForm={form} />
          <FormItems.MainUserID useForm={form} />
          <FormItems.UserStatus useForm={form} />

          {/* <FormItems.NationalID
            edit
            useForm={form}
            setMainPersonOption={handleSetMainPersonOption}
            insuranceInfo={insurance}
            initialValue={nationalId}
          /> */}
          <FormItems.Person
            useForm={form}
            setPerson
            edit
            disabled={true}
            defaultValue={personInfo.main_national_number}
            setPerson={setPerson}
            size={{
              xs: 24,
              sm: 24,
              md: 24,
              lg: 24,
              xl: 24,
            }}
          />
          {/* <FormItems.UserFullName useForm={form} edit /> */}

          <FormItems.WitchMainPerson
            useForm={form}
            option={mainPersonOption}
            edit
          />

          <FormItems.StartDateInsurance
            useForm={form}
            insurance={insurance}
            edit
          />
          <FormItems.EndDateInsurance
            useForm={form}
            insurance={insurance}
            edit
          />
          <FormItems.MobileNumber useForm={form} edit />
          <FormItems.BankAccount useForm={form} edit />
          <FormItems.Description edit />
        </Row>
        <SubmitBtn loading={submitLoading} />
      </Form>
      {/* </Spin> */}
    </>
  );
};

export default withRouter(PersonEdit);
