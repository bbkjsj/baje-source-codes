import React from "react";
import { Form, Row } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN, setOriginFileObj, appendToFormData } from "_helpers";
import {
  useAccidentInsuranceGetById,
  useAccidentInsuranceEdit,
} from "./util/hooks";
import { withRouter } from "react-router-dom";
import LoadingLogo from "components/general/LoadingLogo";
import { addCompanyName } from "./util";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const AccidentInsuranceEdit = ({ match }) => {
  const insuranceID = match.params.id;
  const [form] = Form.useForm();
  const { loading: loadingGet } = useAccidentInsuranceGetById(
    insuranceID,
    form
  );
  const { submit, loading: submitLoading } = useAccidentInsuranceEdit();
  const user = useWhoAmI();
  const listLegal = user?.companies;
  //
  const handleOnFinish = (values) => {
    // convert date
    let data = { ...values };
    data.contract_issue_date = convertDateToEN(data.contract_issue_date);
    data.contract_date_from_date = convertDateToEN(
      data.contract_date_from_date
    );
    data.to_date = convertDateToEN(data.to_date);
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
        title="ویرایش بیمه عمر و حادثه افراد"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "لیست بیمه عمر و حادثه",
            link: pageNames.personnel.insurance.accident.list,
          },
          { text: "ویرایش" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={form}
        name="accidentInsuranceEdit"
        onValuesChange={handleValuesOnChange}
        scrollToFirstError
        onFinish={handleOnFinish}
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
        <SubmitBtn loading={submitLoading} />
      </Form>
    </>
  );
};

export default withRouter(AccidentInsuranceEdit);
