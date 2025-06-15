import React, { useContext, useEffect, useState } from "react";
import { Form, Row, Col, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { getTodayDate, convertDateToEN, convertTime } from "_helpers";
import { useSendAccidentReport } from "./utils/hooks";
import ContentTop from "components/general/ContentTop";
import useSuperAdminCheck from "hooks/useSuperAdminCheck";
import { formItemLayout, formRowGutter, pageNames } from "constant";
import { useSelector } from "react-redux";
import useWhoAmI from "hooks/useWhoAmI";

const initialValues = {
  // date: getTodayDate(),
  location: "محل پروژه",
};

const AccidentReportAdd = ({ updating = false }) => {
  const [accidentReportForm] = Form.useForm();
  const { loading, submitForm } = useSendAccidentReport();
  const [person, setPerson] = useState();
  const [executer, setExecuter] = useState();
  const user = useWhoAmI();
  const [defaultCode, setDefaultCode] = useState(
    !updating ? user.nationalCode : null
  );
  const superAdminCheck = useSuperAdminCheck();

  // console.info(getTodayDate())
  let m = getTodayDate().split("/");
  if (m[1] < 10) {
    m[1] = "0" + m[1];
  }
  if (m[2] < 10) {
    m[2] = "0" + m[2];
  }
  initialValues.date = m[0] + "/" + m[1] + "/" + m[2];

  const handleOnFinish = (values) => {
    // convert date
    let convertedValues = { ...values };
    convertedValues.date =
      convertDateToEN(convertedValues.date) +
      " " +
      convertTime(convertedValues.time);

    delete convertedValues.location;
    submitForm(convertedValues);
  };

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="گزارش حادثه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "حوادث",
            link: pageNames.personnel.realPerson.accidentReport.list,
          },
          { text: "گزارش حادثه" },
        ]}
      />
      <Form
        {...formItemLayout}
        form={accidentReportForm}
        name="accidentReportAdd"
        scrollToFirstError
        onFinish={handleOnFinish}
        initialValues={initialValues}
      >
        <Row gutter={formRowGutter}>
          <FormItems.Reporter
            useForm={accidentReportForm}
            setPerson={setPerson}
            defaultValue={defaultCode}
            button={superAdminCheck()}
          />
          <FormItems.Executer
            useForm={accidentReportForm}
            setPerson={setExecuter}
          />
          <FormItems.Deadline useForm={accidentReportForm} />
          <FormItems.CorrectiveAction />
          <FormItems.Date useForm={accidentReportForm} />
          <FormItems.Time />
          <FormItems.locationType />
          <FormItems.locationText />
          <FormItems.ContractID useForm={accidentReportForm} />
          <FormItems.AccidentType />
          <FormItems.Reason />
          <FormItems.Consequences />
          <FormItems.Pollution />
          <FormItems.ProbableReason />
          <FormItems.ProbableReasonOther />
          <FormItems.Description />
          <FormItems.ReasonOther />
          <FormItems.TherapeuticMeasures />
          <FormItems.AccidentPicture />
          <FormItems.Intuition useForm={accidentReportForm} />
          <FormItems.Vehicles useForm={accidentReportForm} />
          <FormItems.Personnel useForm={accidentReportForm} />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default AccidentReportAdd;
