import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";
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
import { useSupplementaryInsuranceAdd } from "./util/hooks";
import { addCompanyName } from "./util";
import ContentTop from "components/general/ContentTop";
import { pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

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

const SupplementaryInsuranceAdd = () => {
  const [form] = Form.useForm();
  const { submit, loading } = useSupplementaryInsuranceAdd();
  const user = useWhoAmI();
  const listLegal = user?.companies;
  const currentOffice = useSelector((state) => state.currentOffice);

  const handleOnFinish = (values) => {
    // convert date
    let data = { ...values };

    data.contract_issue_date = convertDateToEN(data.contract_issue_date);
    data.contract_date_from_date = convertDateToEN(
      data.contract_date_from_date
    );

    data.to_date = convertDateToEN(data.to_date);
    data.change_deadline_date = convertDateToEN(data.change_deadline_date);

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

    console.log(data, "!data");

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

  console.log(form.getFieldsValue(), "!form");

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="افزودن بیمه تکمیلی"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "لیست بیمه تکمیلی",
            link: pageNames.personnel.insurance.supplymentary.list,
          },
          { text: "جدید" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={form}
        name="supplementaryInsuranceAdd"
        style={formStyle}
        onValuesChange={handleValuesOnChange}
        scrollToFirstError
        onFinish={handleOnFinish}
        initialValues={{
          company_id: currentOffice != -1 ? currentOffice : null,
        }}
      >
        <Row gutter={formGutter}>
          <FormItems.Insurer />
          <FormItems.CompanyID />
          <FormItems.ContractNumber />
          <FormItems.ContractDate useForm={form} />
          <FormItems.ContractStartDate useForm={form} />
          <FormItems.ContractEndDate useForm={form} />
          <FormItems.MaximumChangeDate useForm={form} />
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
        <Row>
          <WarningOutlined
            style={{ fontSize: "20px", color: "#faad14", paddingLeft: "10px" }}
          />
          شماره حساب اول هر شخص، جهت پرداخت وجه خسارات استفاده میشود!
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default SupplementaryInsuranceAdd;
