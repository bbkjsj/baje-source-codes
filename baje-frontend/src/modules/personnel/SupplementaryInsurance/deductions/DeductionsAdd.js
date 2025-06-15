import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { getTodayDate, convertDateToEN, convertTime, getLink } from "_helpers";
import { withRouter } from "react-router-dom";
import { usePostDeductions } from "./util/hooks";
import ContentTop from "components/general/ContentTop";
import { paymentMethodValues, values } from "./const";
import * as api from "../util/api";
import { pageNames } from "constant";

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

const DeductionsAdd = ({ match }) => {
  const [form] = Form.useForm();
  const { submit, loading } = usePostDeductions(form);
  const personnelId = match.params.userId;
  const insuranceID = match.params.insuranceId;
  const [insurance, setInsurance] = useState(null);

  const handleOnFinish = (values) => {
    // convert date
    values.document_date = values.document_date
      ? convertDateToEN(values.document_date)
      : undefined;
    values.payment_date = values.payment_date
      ? convertDateToEN(values.payment_date)
      : undefined;

    values.personnel_id = personnelId;
    values.insurance_id = insuranceID;
    // if (values.amount) {
    //   console.info(values.amount);
    //   values.amount = parseInt(values.amount.replace(",", ""));
    // }

    if (values.salary_period) {
      //
      values.year = values.salary_period.slice(0, 4);
      values.month = values.salary_period.slice(5, 7);
    }

    // console.log(payload, "!payload");
    //

    submit(values);
  };

  useEffect(() => {
    api
      ._GET_BY_ID(insuranceID)
      .then((res) => setInsurance(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="افزودن کسر بیمه"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "لیست بیمه تکمیلی و حادثه",
            link: pageNames.personnel.insurance.supplymentary.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.supplymentary.personnel.list,
              insuranceID
            ),
          },
          {
            text: "کسورات بیمه",
            link: getLink(
              pageNames.personnel.insurance.supplymentary.personnel.deucation
                .list,
              {
                insuranceId: insuranceID,
                userId: personnelId,
              }
            ),
          },
          { text: "جدید" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={form}
        name="DeductionsAdd"
        style={formStyle}
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.PaymentMethod />
          <FormItems.DeductionsSalaryPeriod
            useForm={form}
            insurance={insurance}
          />
          <FormItems.DocumentNumber />
          <FormItems.DocumentDate useForm={form} />
          <FormItems.PaymentDate useForm={form} />
          <FormItems.Payed />
          <FormItems.PaymentDescription />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(DeductionsAdd);
