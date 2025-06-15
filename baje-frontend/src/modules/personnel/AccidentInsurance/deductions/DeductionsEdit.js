import React, { useEffect, useState, useContext } from "react";
import { Form, Row } from "antd";
import * as FormItems from "./components/FormItems";
import GoBackBtn from "components/GoBackBtn";
import SubmitBtn from "components/general/SubmitBtn";
import { getTodayDate, convertDateToEN, convertTime, getLink } from "_helpers";
import { withRouter } from "react-router-dom";
import { useEditDeductions, useGetSingleDeductions } from "./util/hooks";
import LoadingLogo from "components/general/LoadingLogo";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const DeductionsEdit = ({ match }) => {
  const [form] = Form.useForm();
  const personnelId = match.params.userId;
  const insuranceID = match.params.insuranceId;
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

    // values.personnel_id = personnelId;
    // values.insurance_id = insuranceID;
    if (values.amount) {
      values.amount = parseInt(values.amount.replace(/\$\s?|(,*)/g, ""));
    }
    // values.id = deductionsId;
    console.log("values", values);
    submit(deductionsId, values);
  };

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
          { text: "ویرایش" },
        ]}
      />
      <h2>ویرایش کسورات</h2>
      <Form
        {...formItemLayout}
        form={form}
        name="DeductionsEdit"
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

export default withRouter(DeductionsEdit);
