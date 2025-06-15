import { Form } from "antd";
import AppButton from "components/general/AppButton";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import * as fields from "./common/formItems";
import useTimer from "hooks/useTimer";

const LoginValidation = ({
  onSubmit,
  loading,
  handleLoginSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const [smsSent, setSmsSent] = useState(true);
  const [timerActive, setTimerActive] = useState(true);

  const { counter, seconds, minutes, reset } = useTimer(60, timerActive);
  const history = useHistory();

  const handleOnFinish = (values) => {
    values.code = values.code.toString().replace(/\s/g, "");
    onSubmit(values);
    if (smsSent) {
    } else {
      setSmsSent(true);
      setTimerActive(true);
    }
  };

  const handleFormChange = (inputs) => {
    if (inputs.hasOwnProperty("code")) {
      let code = inputs.code.toString().replace(/\s/g, "");
      if (code.replace("_", "").length === 6) {
        let values = form.getFieldsValue();
        values.code = values.code.toString().replace(/\s/g, "");
        onSubmit(values);
      }
    }
  };

  return (
    <FormContainer className="fade-in">
      <p className="text-14 text-mid-black text-center code-title mx-auto">
        کد تاییدیه پیامک شده به شماره موبایل خود را وارد کنید
      </p>
      <Form
        form={form}
        name="signup"
        onFinish={handleOnFinish}
        className="mt-2"
        onValuesChange={handleFormChange}
      >
        <fields.Code
          onResend={() => {
            form.resetFields();
            setSmsSent(false);
            setTimerActive(false);
          }}
        />
      </Form>

      {smsSent && (
        <div className="mt-3">
          {counter > 0 ? (
            <p className="text-14 text-light-black text-center mt-auto mb-2">{`ارسال مجدد کد تا ${
              minutes + ":" + seconds
            } دیگر`}</p>
          ) : (
            <p
              className="text-14 text-primary text-center mt-auto pointer mb-2"
              onClick={() => {
                handleLoginSubmit();
                reset();
              }}
            >
              ارسال مجدد کد تایید
            </p>
          )}
        </div>
      )}

      <div className={`flex justify-center`}>
        <AppButton
          loading={loading}
          className="form-btn flex-grow-1"
          variant="primary"
          size="large"
          onClick={() => form.submit()}
        >
          ورود
        </AppButton>
        <AppButton
          className="form-btn flex-grow-1 mr-2"
          size="large"
          onClick={onCancel}
        >
          انصراف
        </AppButton>
      </div>
    </FormContainer>
  );
};

//css
const FormContainer = styled.div`
  @media (min-width: ${bp.lg}) {
    display: flex;
    flex-direction: column;
  }

  padding: 0px 22px;
  padding-bottom: 10px;

  .form-btn {
    width: 126px;
    height: 48px;
    font-size: 14px;
  }

  .code-title {
    max-width: 180px;
  }
`;

export default LoginValidation;
