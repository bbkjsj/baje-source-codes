import React from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { withRouter } from "react-router-dom";
import { usePutPayment, useGetOnePayment } from "./util/hooks";
import { convertDateToEN, setOriginFileObj, appendToFormData } from "_helpers";
import LogoLoading from "components/general/LoadingLogo";
import GoBackBtn from "components/GoBackBtn";
import ContentTop from "components/general/ContentTop";
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

const PaymentEdit = ({ match }) => {
  const [form] = Form.useForm();
  const paymentID = match.params.id;
  const { loading: getItemLoading, data: payment } = useGetOnePayment(
    paymentID,
    form
  );
  const { submit, loading } = usePutPayment(form);

  const handleOnFinish = (values) => {
    let data = { ...values };

    data.insurance_id = payment.insurance_tamin_id_fk;
    data.status = payment.status;

    if (data.periodic_debt_end_date)
      data.periodic_debt_end_date = convertDateToEN(
        data.periodic_debt_end_date
      );
    if (data.periodic_debt_start_date)
      data.periodic_debt_start_date = convertDateToEN(
        data.periodic_debt_start_date
      );

    if (data.date) data.date = convertDateToEN(data.date);

    if (data.file) {
      data = setOriginFileObj(data, ["file"]);
    }

    submit(payment.id, appendToFormData(data));
  };

  if (getItemLoading) {
    return <LogoLoading />;
  }

  return (
    <>
      <GoBackBtn />
      <ContentTop
        title="ویرایش پرداختی"
        className="mt-3"
        breadcrumbItems={[
          {
            text: "بیمه تامین اجتماعی",
            link: pageNames.personnel.insurance.tamin.list,
          },

          {
            text: "لیست پرداختی های بیمه",
            link: pageNames.personnel.insurance.tamin.payment.list,
          },
          { text: "ویرایش پرداختی" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={form}
        name="PaymentEdit"
        style={formStyle}
        scrollToFirstError
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.PayFor />
          <FormItems.SubmissionList />
          <FormItems.InstallmentNumber />
          <FormItems.DebtStartDate useForm={form} />
          <FormItems.DebtFinishDate useForm={form} />
          <FormItems.EstimatedDebt />
          <FormItems.Insurance />
          <FormItems.UnemploymentInsurance />
          <FormItems.Penalty />
          <FormItems.Execution />
          <FormItems.TotalShare />
          <FormItems.Date useForm={form} />
          <FormItems.Document />
        </Row>
        <SubmitBtn loading={loading} />
      </Form>
    </>
  );
};

export default withRouter(PaymentEdit);
