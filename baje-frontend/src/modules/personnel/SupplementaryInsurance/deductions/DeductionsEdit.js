import React, { useEffect, useState, useContext } from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { getTodayDate, convertDateToEN, convertTime, getLink } from "_helpers";
import { withRouter } from "react-router-dom";
import { useEditDeductions, useGetSingleDeductions } from "./util/hooks";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
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

const DeductionsEdit = ({ match }) => {
  const [form] = Form.useForm();
  const personnelId = match.params.userId;
  const insuranceID = match.params.insuranceId;
  const [insurance, setInsurance] = useState(null);
  const { submit, loading } = useEditDeductions(form);
  const deductionsId = match.params.id;
  const { loading: getLoading, data } = useGetSingleDeductions(
    deductionsId,
    form
  );

  const handleOnFinish = (values) => {
    // convert date
    values.document_date = values.document_date
      ? convertDateToEN(values.document_date)
      : undefined;
    values.payment_date = values.payment_date
      ? convertDateToEN(values.payment_date)
      : undefined;

    console.log("values", values);
    // if (values.amount) {
    //   values.amount = parseInt(values.amount.replace(/\$\s?|(,*)/g, ""));
    // }

    if (values.salary_period) {
      //
      values.year = values.salary_period.slice(0, 4);
      values.month = values.salary_period.slice(5, 7);
    }
    submit(deductionsId, values);
  };
  useEffect(() => {
    api
      ._GET_BY_ID(insuranceID)
      .then((res) => setInsurance(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (getLoading) {
    return <LoadingLogo />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ویرایش کسر بیمه"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
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
          { text: "ویرایش" },
        ]}
      />
      <h2>ویرایش کسورات</h2>
      <Form
        {...formItemLayout}
        form={form}
        name="DeductionsEdit"
        style={formStyle}
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.PaymentMethod />
          {/* <FormItems.DeductionsSalariesYear />
          <FormItems.DeductionsSalariesMonth /> */}
          <FormItems.DeductionsSalaryPeriod
            useForm={form}
            insurance={insurance}
          />
          <FormItems.DocumentNumber />
          <FormItems.DocumentDate useForm={form} />
          <FormItems.PaymentDate useForm={form} />
          <FormItems.PaymentDescription />
          <FormItems.Payed />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(DeductionsEdit);
