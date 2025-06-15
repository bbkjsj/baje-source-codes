import React from "react";
import { Form, Row } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import { useAccidentInsuranceGetById } from "./util/hooks";
import { withRouter } from "react-router-dom";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const AccidentInsuranceEdit = ({ match }) => {
  const insuranceID = match.params.id;
  const [form] = Form.useForm();
  const { loading } = useAccidentInsuranceGetById(insuranceID, form);

  if (loading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="جزییات بیمه عمر و حادثه افراد"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "لیست بیمه عمر و حادثه",
            link: pageNames.personnel.insurance.accident.list,
          },
          { text: "جزییات" },
        ]}
      />
      <Form {...formItemLayout} form={form} name="accidentInsuranceDetail">
        <Row gutter={formRowGutter}>
          <FormItems.InsurancePolicyType detail />
          <FormItems.Insurer detail />
          <FormItems.CompanyID detail />
          <FormItems.ContractNumber detail />
          <FormItems.ContractDate useForm={form} detail />
          <FormItems.ContractStartDate useForm={form} detail />
          <FormItems.ContractEndDate useForm={form} detail />
          <FormItems.Description detail />

          <FormItems.MainInsuranceShare detail />

          <FormItems.WifeInsuranceShare detail />
          <FormItems.DaughterInsuranceShare detail />
          <FormItems.SonInsuranceShare detail />
          <FormItems.FatherInsuranceShare detail />
          <FormItems.MotherInsuranceShare detail />
        </Row>
      </Form>
    </>
  );
};

export default withRouter(AccidentInsuranceEdit);
