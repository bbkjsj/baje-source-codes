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
export default function OtherInfoForm({ ID, onCancel }) {
  const legalAgeBirthYear = new Date().getFullYear() - 18;
  const [form] = Form.useForm();
  const [isargarValue, setIsargarValue] = useState("none");
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  //

  const handleOnChangeIsargar = (value) => {
    setIsargarValue(value);
  };
  const showArmy =
    form.getFieldValue("nation") === "iranian" &&
    eval(form.getFieldValue("birth_date").slice(0, 4)) <= legalAgeBirthYear;
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
        <FormItems.MaritalStatus />
        {showArmy && <FormItems.ArmyService />}
        <FormItems.Education />
        <FormItems.StudyField />
        <FormItems.PublicDescription />
        <FormItems.PrivateDescription />
        <Divider orientation="right">وضعیت ایثار گری</Divider>
        <FormItems.Isargar onChange={handleOnChangeIsargar} />
        {isargarValue === "child_of" && <FormItems.ShahidName />}
        {isargarValue === "wife_of" && <FormItems.ShahidName />}
        {isargarValue === "پدر شهید" && <FormItems.ShahidName />}
        {isargarValue === "برادر شهید" && <FormItems.ShahidName />}
        {isargarValue === "مادر شهید" && <FormItems.ShahidName />}
        {isargarValue === "خواهر شهید" && <FormItems.ShahidName />}
        {isargarValue === "پدر جانباز" && <FormItems.JanbazName />}
        {isargarValue === "برادر جانباز" && <FormItems.JanbazName />}
        {isargarValue === "مادر جانباز" && <FormItems.JanbazName />}
        {isargarValue === "خواهر جانباز" && <FormItems.JanbazName />}
        {isargarValue === "veteran" && <FormItems.VeteranPercentage />}
        {isargarValue === "fighting" && <FormItems.PeriodTimeFighting />}
        {isargarValue === "noble" && <FormItems.PeriodTimeNoble />}
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
