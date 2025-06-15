import React, { useState, useEffect } from "react";
import { Form, Row } from "antd";
import SubmitBtn from "components/general/SubmitBtn";
import * as FormItems from "./formItems";
import { formItemLayout, formRowGutter } from "constant";
import { getUser } from "../utils/index";
import LoadingLogo from "components/general/LoadingLogo";
import { UPDATE_USER } from "../utils/api";
import { showMessage } from "utils/message";
import AppButton from "components/general/AppButton";

//
export default function ContactForm({ ID, onCancel }) {
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

  const submitForm = async (values) => {
    try {
      setBtnLoading(true);
      const res = await UPDATE_USER(ID, values);
      setBtnLoading(false);
      showMessage("ثبت با موفقیت انجام شد", "success");
      if (onCancel) {
        onCancel();
      }
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
        <FormItems.MobileOne />
        <FormItems.MobileTwo />
        <FormItems.Phone />
        <FormItems.Email />
        <FormItems.PostalCode />
        <FormItems.Address />
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
