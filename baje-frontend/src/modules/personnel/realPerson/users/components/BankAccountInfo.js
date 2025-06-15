import React, { useState, useEffect } from "react";
import { Form, Row, Divider } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import * as FormItems from "./formItems";
import { formItemLayout, formRowGutter } from "constant";
import { getUser } from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import { UPDATE_USER } from "../utils/api";
import { showMessage } from "utils/message";
import AppButton from "components/general/AppButton";

//
export default function BankAccountInfo({ ID, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  //
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
  //
  const submitForm = async (values) => {
    try {
      setBtnLoading(true);
      const res = await UPDATE_USER(ID, values);
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
    <Form form={form} onFinish={submitForm} {...formItemLayout}>
      <Row gutter={formRowGutter}>
        <Divider orientation="right">حساب اول</Divider>
        <FormItems.BankAccount name="bank_account1" />
        <FormItems.BankName name="bank_name1" />
        <FormItems.Sheba name="sheba1" />
        <Divider orientation="right">حساب دوم</Divider>
        <FormItems.BankAccount name="bank_account2" />
        <FormItems.BankName name="bank_name2" />
        <FormItems.Sheba name="sheba2" />
        <Divider orientation="right">حساب سوم</Divider>
        <FormItems.BankAccount name="bank_account3" />
        <FormItems.BankName name="bank_name3" />
        <FormItems.Sheba name="sheba3" />
        <Divider orientation="right">حساب چهارم</Divider>
        <FormItems.BankAccount name="bank_account4" />
        <FormItems.BankName name="bank_name4" />
        <FormItems.Sheba name="sheba4" />
        <Divider orientation="right">حساب پنجم</Divider>
        <FormItems.BankAccount name="bank_account5" />
        <FormItems.BankName name="bank_name5" />
        <FormItems.Sheba name="sheba5" />
      </Row>
      <div className="flex mt-4 justify-end">
        <AppButton
          className="big-btn ml-1"
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
  );
}
