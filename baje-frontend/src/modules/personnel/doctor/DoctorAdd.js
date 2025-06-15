import React, { useContext, useEffect, useState } from "react";
import { Form, message, Row, Spin } from "antd";
import GoBackBtn from "components/GoBackBtn";
import axios from "api/appAxios";
import * as fields from "./utils/formItems";
import SubmitBtn from "components/general/SubmitBtn";
import { useHistory } from "react-router-dom";
import {
  handleCheckNationalNumber,
  handleSetPassword,
} from "./utils/formUtils";
import ContentTop from "components/general/ContentTop";
import { formItemLayout, formRowGutter, pageNames } from "constant";

const formInitialValues = {};

function DoctorAdd() {
  const [doctorForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleOnChangeNationalNumber = () => {
    handleSetPassword(doctorForm);
  };

  const handleOnBlurNationalNumber = (event) => {
    handleCheckNationalNumber(event, doctorForm);
  };

  const handleOnFinish = (params) => {
    setLoading(true);
    console.log(params);

    axios({
      method: "post",
      url: "/api/admin/doctor",
      data: params,
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setLoading(false);

        setTimeout(() => {
          history.push(pageNames.personnel.doctor.list);
        }, 1000);
      })
      .catch((error) => {
        if (error.response) {
          setLoading(false);
          message.error(error?.response?.data);
        }
      });
  };

  return (
    <>
      <GoBackBtn />

      <ContentTop
        title="اضافه کردن پزشک"
        breadcrumbItems={[
          { text: "منابع انسانی", link: pageNames.home.web },
          { text: "پزشکان", link: pageNames.personnel.doctor.list },
          { text: "اضافه کردن پزشک" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={doctorForm}
        name="doctor"
        onFinish={handleOnFinish}
        initialValues={formInitialValues}
      >
        <Spin spinning={loading}>
          <Row gutter={formRowGutter}>
            <fields.NationalNumber
              onChange={handleOnChangeNationalNumber}
              onBlur={handleOnBlurNationalNumber}
            />
            <fields.FirstName />
            <fields.LastName />
            <fields.Mobile />
            <fields.Password />
            <fields.ConfirmPassword />
            <SubmitBtn loading={loading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default DoctorAdd;
