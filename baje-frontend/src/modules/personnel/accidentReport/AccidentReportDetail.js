import React from "react";
import { Form, Row, Divider } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import { withRouter } from "react-router-dom";
import { useGetSingleAccidentReport } from "./utils/hooks";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const AccidentReportDetail = ({ match }) => {
  const accidentId = match.params.id;
  const [accidentReportForm] = Form.useForm();
  const { accidentReport } = useGetSingleAccidentReport(
    accidentId,
    accidentReportForm
  );

  if (!accidentReport) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="جزئیات گزارش"
        className="mt-3"
        breadcrumbItems={[
          { text: "حوادث", link: pageNames.personnel.realPerson.list },
          { text: "گزارش حادثه" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={accidentReportForm}
        name="accidentReportDetail"
        scrollToFirstError
      >
        <Row gutter={formRowGutter}>
          <FormItems.AccidentType detail />
          <FormItems.Date useForm={accidentReportForm} detail />
          <FormItems.Time detail />
          <FormItems.locationType detail />
          <FormItems.locationText detail />
          <FormItems.ContractID useForm={accidentReportForm} detail />

          <FormItems.Description detail />
          <FormItems.TherapeuticMeasures detail />
          <FormItems.Reason detail />
          <FormItems.ReasonOther detail />
          <FormItems.AccidentReason detail />
          <Divider orientation="right">مشخصات ماشین آلات حادثه دیده</Divider>

          <FormItems.Vehicles useForm={accidentReportForm} detail />
          <Divider orientation="right">مشخصات حادثه دیدگان</Divider>

          <FormItems.Personnel useForm={accidentReportForm} detail />
        </Row>
      </Form>
    </>
  );
};

export default withRouter(AccidentReportDetail);
