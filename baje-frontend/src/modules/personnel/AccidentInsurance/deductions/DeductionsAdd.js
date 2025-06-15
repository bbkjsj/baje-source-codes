import React, { useEffect, useState, useContext } from "react";
import { Form, Row } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { convertDateToEN, getLink } from "_helpers";
import { withRouter } from "react-router-dom";
import { usePostDeductions } from "./util/hooks";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const DeductionsAdd = ({ match }) => {
  const [form] = Form.useForm();
  const { submit, loading } = usePostDeductions(form);
  const personnelId = match.params.userId;
  const insuranceID = match.params.insuranceId;

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
    if (values.amount) {
      values.amount = parseInt(values.amount.replace(/\$\s?|(,*)/g, ""));
    }

    console.log("values", values);
    submit(values);
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="افزودن کسر بیمه"
        className="mt-3"
        breadcrumbItems={[
          // { text: "منابع انسانی" },
          {
            text: "لیست بیمه عمر و حادثه",
            link: pageNames.personnel.insurance.accident.list,
          },
          {
            text: "لیست افراد قرارداد",
            link: getLink(
              pageNames.personnel.insurance.accident.personnel.list,
              insuranceID
            ),
          },
          {
            text: "کسورات بیمه",
            link: getLink(
              pageNames.personnel.insurance.accident.personnel.deducation.list,
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
        onFinish={handleOnFinish}
      >
        <Row gutter={formRowGutter}>
          <FormItems.PaymentMethod />
          <FormItems.DeductionsSalariesYear />
          <FormItems.DeductionsSalariesMonth />
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
