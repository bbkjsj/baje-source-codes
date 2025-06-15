import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button, message } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN } from "_helpers";
import { withRouter } from "react-router-dom";
import OtherCompany from "./components/OtherCompany";
import { useAddPerson } from "./util/hooks";
import { useGetUserAndSubordinate } from "./util/hooks";
import { AccidentInsuranceContext } from "../util/AccidentInsuranceContext";
import { formItemLayout, formRowGutter } from "../../../../constant";

const PersonAdd = ({ match, updateList, data }) => {
  const [form] = Form.useForm();
  const [mainPersonOption, setMainPersonOption] = useState([]);
  const [personType, setPersonType] = useState(false);
  const [otherCompanyVsible, setOtherCompanyVisible] = useState(false);
  const insuranceID = match.params.id;
  const { submit, loading: submitLoading } = useAddPerson(form, updateList);
  const [person, setPerson] = useState();

  const insuranceContext = useContext(AccidentInsuranceContext);

  const { get: getUserAndSubordinate, userInfo } = useGetUserAndSubordinate();

  const onCancle = () => {
    form.resetFields();
    setOtherCompanyVisible(false);
  };
  const onOk = () => {
    setOtherCompanyVisible(false);
  };

  const handleOnFinish = (values) => {
    values.type = "omr";
    values.user_status = userInfo.status;

    // convert date
    values.insurance_id = insuranceContext.insurance.id;
    values.start_date = convertDateToEN(values.start_date);
    values.end_date = convertDateToEN(values.end_date);

    if (!values.main_insurer_personnel_id) {
      values.main_insurer_personnel_id = values.personnel_id;
    }

    // console.info(values);
    let isExist = data.filter(
      (item) => item.main_national_number === values.national_id
    );

    if (isExist.length > 0) {
      message.warning("این شخص قبلا ثبت شده است");
    } else {
      submit(values);
    }
  };

  const handleSetMainPersonOption = (persons) => {
    setMainPersonOption(
      persons.map((el) => ({
        label: el.first_name + " " + el.last_name,
        value: el.id,
      }))
    );
  };

  const handleSetOtherCompanyVisible = (value) => {
    setOtherCompanyVisible(value);
  };

  useEffect(() => {
    if (form.getFieldValue("national_id")) {
      getUserAndSubordinate(
        form.getFieldValue("national_id"),
        form,
        insuranceContext.insurance
      );
    }
  }, [person]);

  return (
    <>
      {/* <GoBackBtn />
      <h2>افزدون فرد به لیست بیمه</h2> */}

      <OtherCompany
        visible={otherCompanyVsible}
        onCancle={onCancle}
        onOk={onOk}
      />
      <Form
        {...formItemLayout}
        form={form}
        name="accidentInsurancePersonAdd"
        onFinish={handleOnFinish}
      >
        <Row gutter={formRowGutter}>
          <FormItems.UserID useForm={form} />
          <FormItems.MainUserID useForm={form} />
          <FormItems.UserStatus useForm={form} />
          <FormItems.Person
            useForm={form}
            setPerson={setPerson}
            defaultValue={null}
          />
          <FormItems.WitchMainPerson useForm={form} option={mainPersonOption} />
          <FormItems.StartDateInsurance useForm={form} />
          <FormItems.EndDateInsurance useForm={form} />
          <FormItems.Description />
        </Row>
        <SubmitBtn loading={submitLoading} />
      </Form>
    </>
  );
};

export default withRouter(PersonAdd);
