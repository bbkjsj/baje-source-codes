import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import {
  getTodayDate,
  convertDateToEN,
  convertTime,
  setOriginFileObj,
  appendToFormData,
} from "_helpers";
import { useAccidentInsuranceAdd } from "./util/hooks";
import { addCompanyName } from "./util";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const AccidentInsuranceAdd = () => {
  const [form] = Form.useForm();
  const { submit, loading } = useAccidentInsuranceAdd();
  const currentOffice = useSelector((state) => state.currentOffice);
  const user = useWhoAmI();
  const listLegal = user?.companies;

  const handleOnFinish = (values) => {
    // convert date
    let data = { ...values };

    data.contract_issue_date = convertDateToEN(data.contract_issue_date);
    data.contract_date_from_date = convertDateToEN(
      data.contract_date_from_date
    );

    data.to_date = convertDateToEN(data.to_date);

    data.insurer_company = addCompanyName(data.company_id, listLegal);

    data.insurer_main = addCompanyName(data.insurer_main_company_id, listLegal);

    data = setOriginFileObj(data, ["file"]);

    data.main_insured = data.main_insured
      ? data.main_insured.replace(/\$\s?|(,*)/g, "")
      : null;
    data.spouse_insured = data.spouse_insured
      ? data.spouse_insured.replace(/\$\s?|(,*)/g, "")
      : null;
    data.doughter_insured = data.doughter_insured
      ? data.doughter_insured.replace(/\$\s?|(,*)/g, "")
      : null;
    data.son_insured = data.son_insured
      ? data.son_insured.replace(/\$\s?|(,*)/g, "")
      : null;
    data.father_insured = data.father_insured
      ? data.father_insured.replace(/\$\s?|(,*)/g, "")
      : null;
    data.mother_insured = data.mother_insured
      ? data.mother_insured.replace(/\$\s?|(,*)/g, "")
      : null;

    submit(appendToFormData(data));
  };

  const handleValuesOnChange = (value) => {
    let { main_insured } = value;
    if (main_insured || main_insured === "") {
      form.setFieldsValue({
        spouse_insured: main_insured,
        doughter_insured: main_insured,
        son_insured: main_insured,
        father_insured: main_insured,
        mother_insured: main_insured,
      });
    }
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="افزودن بیمه عمر و حادثه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "لیست بیمه عمر و حادثه",
            link: pageNames.personnel.insurance.accident.list,
          },
          { text: "جدید" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={form}
        name="accidentInsuranceAdd"
        onValuesChange={handleValuesOnChange}
        scrollToFirstError
        onFinish={handleOnFinish}
        initialValues={{
          company_id: currentOffice,
        }}
      >
        <Row gutter={formRowGutter}>
          <FormItems.Insurer />
          <FormItems.CompanyID />
          <FormItems.ContractNumber />
          <FormItems.ContractDate useForm={form} />
          <FormItems.ContractStartDate useForm={form} />
          <FormItems.ContractEndDate useForm={form} />
          <FormItems.Description />
          <FormItems.InsuranceObligations />
          <FormItems.MainInsuranceShare />

          <FormItems.WifeInsuranceShare />
          <FormItems.DaughterInsuranceShare />
          <FormItems.SonInsuranceShare />
          <FormItems.FatherInsuranceShare />
          <FormItems.MotherInsuranceShare />
          <FormItems.InsurancePolicyType />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default AccidentInsuranceAdd;
