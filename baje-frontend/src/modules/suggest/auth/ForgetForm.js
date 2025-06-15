import { Form, Row, Space } from "antd";
import AppButton from "components/general/AppButton";
import useIsMobile from "hooks/useIsMobile";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import * as fields from "./common/formItems";
import { signupContext } from "./signupContext";
import mobile from "assets/images/mobile.svg";
import useTimer from "hooks/useTimer";

const ForgetForm = () => {
  const [form] = Form.useForm();
  const { incrementStep, decrementStep } = useContext(signupContext);
  const [smsSent, setSmsSent] = useState(false);
  const [phoneNum, setPhoneNum] = useState(null);
  const [timerActive, setTimerActive] = useState(false);

  const { counter, seconds, minutes, reset } = useTimer(60, timerActive);
  const history = useHistory();

  const handleOnFinish = (values) => {
    console.log(values);
    if (smsSent) {
      incrementStep();
    } else {
      setPhoneNum(values.phone);
      setSmsSent(true);
      setTimerActive(true);
    }
  };

  return (
    <FormContainer className="fade-in">
      <img src={mobile} alt="mobile" className="mx-auto" />

      <p className="mt-3 mt-lg-5 text-16 text-mid-black text-center">
        {smsSent
          ? `کد تاییدیه پیامک شده به شماره ${phoneNum} را وارد کنید`
          : "لطفا جهت دریافت کد تایید 5 رقمی شماره موبایل خود را وارد کنید"}
      </p>
      <Form
        form={form}
        name="signup"
        onFinish={handleOnFinish}
        className="mt-2"
      >
        {smsSent ? (
          <fields.Code
            onResend={() => {
              form.resetFields();
              setSmsSent(false);
              setTimerActive(false);
            }}
          />
        ) : (
          <fields.Phone />
        )}
      </Form>

      {smsSent && (
        <>
          {counter > 0 ? (
            <p className="text-14 text-light-black text-center mt-auto mb-2">{`ارسال مجدد کد تا ${
              minutes + ":" + seconds
            } دیگر`}</p>
          ) : (
            <p
              className="text-14 text-primary text-center mt-auto pointer mb-2"
              onClick={() => reset()}
            >
              ارسال مجدد کد تایید
            </p>
          )}
        </>
      )}

      <div className={`flex justify-center ${!smsSent && "mt-auto"}`}>
        <AppButton
          className="form-btn"
          variant="primary"
          size="large"
          onClick={() => form.submit()}
        >
          {smsSent ? "ادامه" : "دریافت کد"}
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

export default ForgetForm;
