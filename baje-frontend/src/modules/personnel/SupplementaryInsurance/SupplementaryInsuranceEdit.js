import React, { useEffect, useState, useContext } from "react";
import { Form, Row } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN, setOriginFileObj, appendToFormData } from "_helpers";
import {
  useSupplementaryInsuranceGetById,
  useSupplementaryInsuranceEdit,
} from "./util/hooks";
import { withRouter } from "react-router-dom";
import LoadingLogo from "components/general/LoadingLogo";
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

const SupplementaryInsuranceEdit = ({ match }) => {
  const currentOffice = useSelector((state) => state.currentOffice);
  const user = useWhoAmI();
  const listLegal = user?.companies;
  const insuranceID = match.params.id;
  const [form] = Form.useForm();
  const { loading: loadingGet } = useSupplementaryInsuranceGetById(
    insuranceID,
    form
  );

  const { submit, loading: submitLoading } = useSupplementaryInsuranceEdit();
  const handleOnFinish = (values) => {
    // convert date
    let data = { ...values };
    data.contract_issue_date = convertDateToEN(data.contract_issue_date);
    data.contract_date_from_date = convertDateToEN(
      data.contract_date_from_date
    );
    data.to_date = convertDateToEN(data.to_date);
    data.change_deadline_date = convertDateToEN(data.change_deadline_date);
    data.id = parseInt(insuranceID);
    // submit(data);
    data = setOriginFileObj(data, ["file"]);

    data.insurer_company = addCompanyName(data.company_id, listLegal);

    data.insurer_main = addCompanyName(data.insurer_main_company_id, listLegal);

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

    let newData = appendToFormData(data);
    let dataForSubmit = {};
    for (var [key, value] of newData.entries()) {
      dataForSubmit[key] = value;
    }
    console.info("put data", JSON.stringify(dataForSubmit));
    submit(newData, insuranceID);
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

  if (loadingGet) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ویرایش بیمه تکمیلی افراد"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "لیست بیمه تکمیلی",
            link: pageNames.personnel.insurance.supplymentary.list,
          },
          { text: "ویرایش" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={form}
        name="supplementaryInsuranceEdit"
        style={formStyle}
        onValuesChange={handleValuesOnChange}
        scrollToFirstError
        onFinish={handleOnFinish}
        // initialValues={{
        //   company_id: currentOffice,
        // }}
      >
        <Row gutter={formGutter}>
          <FormItems.InsurancePolicyType />
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
        </Row>
        <SubmitBtn loading={submitLoading} />
      </Form>
    </>
  );
};

export default withRouter(SupplementaryInsuranceEdit);
