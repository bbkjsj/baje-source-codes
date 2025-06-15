import React from "react";
import { Form, Row, Divider, Button } from "antd";
import * as FormItems from "./components/FormItems";
import SubmitBtn from "components/general/SubmitBtn";
import { withRouter } from "react-router-dom";
import { usePostPayment, useGetPersonContract } from "./util/hooks";
import { convertDateToEN, setOriginFileObj, appendToFormData } from "_helpers";

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

const PaymentAdd = ({ match, updateList }) => {
  const contractID = match.params.contractID;
  const [form] = Form.useForm();

  const { submit, loading } = usePostPayment(form, updateList);
  const {
    data: contractPersons,
    loading: contractPersonLoading,
  } = useGetPersonContract(contractID);

  const handleOnFinish = (values) => {
    let data = { ...values };

    console.log("data", data);

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

    submit(appendToFormData(data));
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="PaymentAdd"
        style={formStyle}
        scrollToFirstError
        onFinish={handleOnFinish}
      >
        <Row gutter={formGutter}>
          <FormItems.PayFor />
          <FormItems.ProjectPerson
            data={contractPersons ? contractPersons : []}
          />
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

export default withRouter(PaymentAdd);
