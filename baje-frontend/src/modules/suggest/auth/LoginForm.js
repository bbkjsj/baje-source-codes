import { Form } from "antd";
import AppButton from "components/general/AppButton";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import * as fields from "./common/formItems";
import { signupContext } from "./signupContext";
import { getLink } from "../../../_helpers";
import { pageNames } from "constant";

const LoginForm = () => {
  const [form] = Form.useForm();
  const { incrementStep, decrementStep } = useContext(signupContext);

  const history = useHistory();

  const handleOnFinish = (values) => {
    console.log(values);
    incrementStep();
  };

  return (
    <FormContainer className="fade-in">
      <Form form={form} name="login" onFinish={handleOnFinish} className="mt-2">
        <fields.Username />
        <fields.Password />
      </Form>

      <Link
        to={getLink(pageNames.suggest.auth.signUp, "forget")}
        className="text-primary text-12 text-underline mt-1"
      >
        فراموشی رمز عبور
      </Link>

      <div className="flex justify-center mt-auto">
        <AppButton
          className="form-btn"
          variant="primary"
          size="large"
          onClick={() => form.submit()}
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
  max-width: 300px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 75px;
  @media (max-width: ${bp.lg}) {
    padding-top: 20px;
  }

  @media (min-width: ${bp.lg}) {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .form-btn {
    width: 126px;
    height: 48px;
    font-size: 14px;
  }
`;

export default LoginForm;
