import React, { useEffect, useState } from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { withRouter } from "react-router-dom";
import { getTodayDate, convertDateToEN, convertTime } from "_helpers";
import {
  useGetSingleAccidentReport,
  useEditAccidentReport,
} from "./utils/hooks";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const AccidentReportAdd = ({ match }) => {
  const accidentId = match.params.id;
  const [accidentReportForm] = Form.useForm();
  const { accidentReport } = useGetSingleAccidentReport(
    accidentId,
    accidentReportForm
  );
  const { submitForm, loading } = useEditAccidentReport();

  const handleOnFinish = (values) => {
    // convert date
    let convertedValues = { ...values };
    convertedValues.date =
      convertDateToEN(convertedValues.date) +
      " " +
      convertTime(convertedValues.time);
    delete convertedValues.location;
    convertedValues.id = parseInt(accidentId);
    submitForm(convertedValues);
  };

  if (!accidentReport) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ادیت گزارش"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "حوادث",
            link: pageNames.personnel.realPerson.accidentReport.list,
          },
          { text: "جزئیات گزارش" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={accidentReportForm}
        name="accidentReportEdit"
        scrollToFirstError
        onFinish={handleOnFinish}
      >
        <Row gutter={formRowGutter}>
          <FormItems.AccidentType />
          <FormItems.Date useForm={accidentReportForm} />
          <FormItems.Time />
          <FormItems.locationType />
          <FormItems.locationText />
          <FormItems.ContractID useForm={accidentReportForm} />

          <FormItems.Description />
          <FormItems.TherapeuticMeasures />
          <FormItems.Reason />
          <FormItems.ReasonOther />
          <FormItems.AccidentReason />
          <Divider orientation="right">مشخصات ماشین آلات حادثه دیده</Divider>

          <FormItems.Vehicles useForm={accidentReportForm} />
          <Divider orientation="right">مشخصات حادثه دیدگان</Divider>

          <FormItems.Personnel useForm={accidentReportForm} />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(AccidentReportAdd);
