import { Form } from "antd";
import AppButton from "components/general/AppButton";
import useIsMobile from "hooks/useIsMobile";
import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import * as fields from "./common/formItems";

const LoginForm = ({ onSubmit, loading, onCancel }) => {
  const [form] = Form.useForm();

  const history = useHistory();
  const isMobile = useIsMobile();
  const passwordRef = useRef(null);

  const handleOnFinish = (values) => {
    // console.log(values, "!submit values");
    onSubmit(values);
  };

  return (
    <FormContainer className="fade-in">
      <Form form={form} name="login" onFinish={handleOnFinish} className="mt-2">
        <fields.Username
          onChange={(e) => {
            if (e.target.value.length === 10) passwordRef.current.focus();
          }}
        />
        <fields.Password ref={passwordRef} />

        <div className="flex justify-between mt-auto mt-md-4 mb-3 mb-md-0 login-btns">
          <AppButton
            loading={loading}
            className="flex-grow-1 form-btn"
            variant="primary"
            size="large"
            htmlType="submit"
            //onClick={() => form.submit()}
          >
            ادامه
          </AppButton>
          <AppButton
            className="flex-grow-1 form-btn mr-2"
            size="large"
            onClick={() => (isMobile ? history.goBack() : onCancel)}
            disabled={!isMobile}
          >
            انصراف
          </AppButton>
        </div>
      </Form>

      {/* <Link
        to="/new-login/forget"
        className="text-primary text-12 text-underline"
      >
        فراموشی رمز عبور
      </Link> */}
    </FormContainer>
  );
};

//css
const FormContainer = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 10px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  @media (min-width: ${bp.lg}) {
    padding: 0px 22px;
  }

  .form-btn {
    width: 126px;
    height: 48px;
    font-size: 14px;
    @media (max-width: ${bp.xxl}) {
      height: 40px;
    }
  }

  .login-btns {
    @media (max-width: ${bp.xxl}) {
      margin-top: 0px !important;
    }
  }
`;

export default LoginForm;
