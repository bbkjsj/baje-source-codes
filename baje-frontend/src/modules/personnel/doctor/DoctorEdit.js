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

function DoctorEdit(props) {
  const [doctorForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const itemId = props.match.params.id;
  const [pageLoading, setPageLoading] = useState(false);

  const handleOnChangeNationalNumber = () => {
    handleSetPassword(doctorForm);
  };

  const handleOnBlurNationalNumber = (event) => {
    handleCheckNationalNumber(event, doctorForm);
  };

  useEffect(() => {
    setPageLoading(true);
    axios
      .get(`/api/admin/doctor/${itemId}`)
      .then((res) => {
        console.log(res);
        doctorForm.setFieldsValue(res.data);
        setPageLoading(false);
      })
      .catch((err) => {
        message.error("دریافت اطلاعات دچار مشکل شده است");
        setPageLoading(false);
      });
  }, []);

  const handleOnFinish = (params) => {
    setLoading(true);
    console.log(params);

    if (!params.password) delete params.password;

    delete params.repeat_password;
    params.id = itemId;

    axios({
      method: "put",
      url: `/api/admin/doctor`,
      data: params,
    })
      .then((res) => {
        message.success("با موفقیت انجام شد");
        setLoading(false);

        setTimeout(() => {
          history.go();
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
        title="ویرایش پزشک"
        breadcrumbItems={[
          { text: "منابع انسانی", link: pageNames.home.web },
          { text: "پزشکان", link: pageNames.personnel.doctor.list },
          { text: "ویرایش پزشک" },
        ]}
      />

      <Form
        {...formItemLayout}
        form={doctorForm}
        name="doctor"
        onFinish={handleOnFinish}
      >
        <Spin spinning={pageLoading}>
          <Row gutter={formRowGutter}>
            <fields.NationalNumber
              onChange={handleOnChangeNationalNumber}
              onBlur={handleOnBlurNationalNumber}
            />
            <fields.FirstName />
            <fields.LastName />
            <fields.Mobile />
            <fields.Password required={false} />
            <fields.ConfirmPassword required={false} />
            <SubmitBtn loading={loading} />
          </Row>
        </Spin>
      </Form>
    </>
  );
}

export default DoctorEdit;
