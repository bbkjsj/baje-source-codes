import { Form, notification, Row, Space, Spin } from "antd";
import AppButton from "components/general/AppButton";
import useIsMobile from "hooks/useIsMobile";
import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import * as fields from "./common/formItems";
import { signupContext } from "./signupContext";
import mobile from "assets/images/mobile.svg";
import useTimer from "hooks/useTimer";
import { _GET_PHONE, _VERIFY } from "./api";

import { pageNames } from "constant";
import { useDispatch } from "react-redux";
import { NewContext } from "contex/New-Context";

const SignupValidation = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { incrementStep, decrementStep, state } = useContext(signupContext);
  const [smsSent, setSmsSent] = useState(true);
  const [phoneNum, setPhoneNum] = useState(null);
  const [timerActive, setTimerActive] = useState(true);
  const { counter, seconds, minutes, reset } = useTimer(60, timerActive);
  const newContext = useContext(NewContext);
  const history = useHistory();
  const routeParams = useParams();
  const [loading, setLoading] = useState(false);

  const handleOnFinish = (values) => {
    verifyCode(values);
    // if (smsSent) {
    //
    // } else {
    //   setPhoneNum(values.phone);
    //   setSmsSent(true);
    //   setTimerActive(true);
    // }
  };

  function resendCode() {
    reset();
    _GET_PHONE({
      national_code: state.formVals.national_code,
    }).then((res) => {});
  }

  function verifyCode(values) {
    setLoading(true);
    const body = {
      mobile: state.phoneNumber,
      code: values.code.split("  ").join(""),
    };
    _VERIFY(body)
      .then((res) => {
        setLoading(false);
        newContext.signIn(res.data);

        if (routeParams.type === "register") {
          incrementStep();
        } else {
          notification.success({ message: "باموفقیت وارد شدید" });
          history.replace(pageNames.suggest.suggestion.list);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);

        if (
          err.response &&
          err.response.data &&
          err.response.data === "incorrect mobile/code"
        ) {
          notification.error({
            message: "کد وارد شده صحیح نیست",
          });
        } else {
          notification.error({
            message: "مشکلی پیش آمده، لطفا دوباره تلاش کنید",
          });
        }
      });
  }

  function hideNums(phone) {
    const arr = phone.toString().split("");
    arr[4] = "*";
    arr[5] = "*";
    arr[6] = "*";
    return arr.join("");
  }

  return (
    <FormContainer>
      <img src={mobile} alt="mobile" className="mx-auto fade-in d-block" />

      <p className="mt-3 mt-lg-5 text-16 text-mid-black text-center">
        {smsSent ? (
          <span>
            کد تاییدیه پیامک شده به شماره{" "}
            <span dir="ltr" className="ltr">
              {hideNums(state.phoneNumber)}
            </span>{" "}
            را وارد کنید
          </span>
        ) : (
          "لطفا جهت دریافت کد تایید 5 رقمی شماره موبایل خود را وارد کنید"
        )}
      </p>
      <Form
        form={form}
        name="signup"
        onFinish={handleOnFinish}
        className="mt-2"
        onValuesChange={(values) => {
          const pureCode = values.code.replace(/[\s_]/g, "");
          if (pureCode.length === 6) {
            verifyCode(values);
          }
        }}
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
              onClick={resendCode}
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
          loading={loading}
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

export default SignupValidation;
