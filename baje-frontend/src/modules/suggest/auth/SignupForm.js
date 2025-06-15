import { Form, Modal, notification, Row, Space } from "antd";
import AppButton from "components/general/AppButton";
import useIsMobile from "hooks/useIsMobile";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import { _REGISTER } from "./api";
import * as fields from "./common/formItems";
import { signupContext } from "./signupContext";
import { convertDateToENProper, getLink } from "_helpers";
import { pageNames } from "constant";

const SignupForm = () => {
  const [form] = Form.useForm();
  const { state, setFormVals } = useContext(signupContext);
  const isMobile = useIsMobile();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = (values) => {
    if (values.birth_date) {
      values.birth_date = convertDateToENProper(values.birth_date);
    }
    console.log(values);
    setLoading(true);

    _REGISTER(values)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setFormVals(values);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        if (err.response.data === "duplicate user") {
          Modal.warning({
            content: "شما قبلا ثبت نام کرده اید لطفا وارد شوید",
            onOk: () => {
              history.push(
                getLink(pageNames.suggest.auth.signUp, { type: "login" })
              );
            },
            okText: "ورود",
            closable: true,
          });
        } else {
          notification.error({
            message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
          });
        }
      });
  };

  return (
    <FormContainer className="fade-in">
      <Form
        form={form}
        name="signup"
        onFinish={handleOnFinish}
        initialValues={state.formVals}
        className="mb-2"
      >
        <Row gutter={isMobile ? 16 : [30, 15]}>
          <fields.Name />
          <fields.LastName />
          <fields.NID />
          <fields.IdentityNum />
          <fields.BirthDate useForm={form} />
          <fields.FatherName />
          <fields.Gender />
          <fields.Phone />
        </Row>
      </Form>
      <div className="flex justify-center mt-auto">
        <AppButton
          className="form-btn"
          variant="primary"
          size="large"
          onClick={() => form.submit()}
          loading={loading}
        >
          ادامه
        </AppButton>
        <AppButton
          className="form-btn mr-1"
          size="large"
          onClick={() => history.goBack()}
        >
          انصراف
        </AppButton>
      </div>
    </FormContainer>
  );
};

//css
const FormContainer = styled.div`
  padding-top: 75px;
  @media (max-width: ${bp.lg}) {
    padding-top: 20px;
  }

  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .form-btn {
    width: 126px;
    height: 48px;
    font-size: 14px;
  }
`;

export default SignupForm;
