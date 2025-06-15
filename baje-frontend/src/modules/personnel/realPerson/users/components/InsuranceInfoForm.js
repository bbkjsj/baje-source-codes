import React, { useState, useEffect } from "react";
import { Form, Row } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import * as FormItems from "./formItems";
import { formItemLayout, formRowGutter } from "constant";
import { handleCheckInsuranceNumber } from "../utils/index";
import { getUser } from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import { UPDATE_USER } from "../utils/api";
import { showMessage } from "utils/message";
import Styled from "styled-components";
import AppButton from "components/general/AppButton";

const StyledTable = Styled.table`
tbody{
  tr{
    td{
      border:1px solid black;
      padding:.5rem;
    }
  }
}`;

const initialValues = {};

export default function InsuranceInfoForm({ ID, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUser(ID)
      .then((data) => {
        form.setFieldsValue(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [ID]);

  const handleOnBlurInsuranceNumber = (event) => {
    handleCheckInsuranceNumber(form, event.target.value);
  };

  //
  const submitForm = async (values) => {
    try {
      setBtnLoading(true);
      const newValues = {
        ...values,
      };
      const res = await UPDATE_USER(ID, newValues);
      setBtnLoading(false);
      showMessage("ثبت با موفقیت انجام شد", "success");
    } catch (error) {
      setBtnLoading(false);
    }
  };
  //

  if (loading) {
    return <LoadingLogo />;
  }
  return (
    <>
      <Form
        form={form}
        onFinish={submitForm}
        {...formItemLayout}
        initialValues={initialValues}
      >
        <Row gutter={formRowGutter}>
          <FormItems.InsuranceNumber onBlur={handleOnBlurInsuranceNumber} />
          <FormItems.InsuranceShareEmployee />
          <FormItems.InsuranceShareEmployer />
          <FormItems.InsuranceShareUnemployment />
          <FormItems.InsuranceShareHarmful />
          <StyledTable>
            {/* <tbody>
              <tr>
                <td>درصد سهم بیمه شده</td>
                <td>7</td>
              </tr>
              <tr>
                <td>درصد سهم کارفرما</td>
                <td>20</td>
              </tr>
              <tr>
                <td>سهم بیمه بیکاری</td>
                <td>3</td>
              </tr>

              <tr>
                <td>درصد مشاغل سخت و زیان آور</td>
                <td>0</td>
              </tr>
            </tbody> */}
          </StyledTable>
        </Row>
        <div className="flex mt-4 justify-end">
          <AppButton
            className="big-btn mr-l"
            size="large"
            variant="text"
            onClick={onCancel}
          >
            انصراف
          </AppButton>
          <AppButton
            className="big-btn"
            variant="primary"
            size="large"
            htmlType="submit"
          >
            تایید
          </AppButton>
        </div>
      </Form>
    </>
  );
}
