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
export default function UserAccountForm({ ID, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  //
  useEffect(() => {
    setLoading(true);
    getUser(ID)
      .then((data) => {
        const formValues = { ...data, username: data.national_number };
        form.setFieldsValue(formValues);
        setPassword(data.password);
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
      const payload = { ...values };
      delete payload.username;
      // delete payload.repeat_password;
      if (!payload.password || payload.password === password) {
        delete payload.password;
      }

      if (Object.keys(payload).length === 0) {
        setBtnLoading(false);
        showMessage("هیچ فیلدی ویرایش نشده است", "error");
      } else {
        const res = await UPDATE_USER(ID, payload);
        setBtnLoading(false);
        showMessage("ثبت با موفقیت انجام شد", "success");
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
        <FormItems.Username disabled={true} />
        <FormItems.Password />
        {/* <FormItems.ConfirmPassword /> */}
        <FormItems.HomePage form={form} />
        <FormItems.DefaultCompany />
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
