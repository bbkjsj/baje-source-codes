import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Steps } from "antd";
import styled from "styled-components";
import hugeLogo from "assets/images/huge-logo.svg";
import neginLogo from "assets/images/negin-logo.svg";
import bp from "utils/breakpoints";
import { Link, useParams } from "react-router-dom";
import SignupForm from "./SignupForm";
import { signupContext } from "./signupContext";
import dotsSm from "assets/images/dots-sm.svg";
import SignupValidation from "./SignupValidation";
import SignupSuccess from "./SignupSuccess";
import ForgetForm from "./ForgetForm";
import InitialForm from "./InitialForm";
import { getLink } from "_helpers";
import TextModal from "components/general/TextModal";
import useIsMobile from "hooks/useIsMobile";
import * as configApi from "../configuration/utils/api";
import { aboutText, config, pageNames } from "constant";

const SuggestionsSignup = () => {
  const { state, decrementStep } = useContext(signupContext);
  const routeParams = useParams();
  const { Step } = Steps;
  const [showAbout, setShowAbout] = useState(false);
  const [nezamConfig, setNezamConfig] = useState({});
  const isMobile = useIsMobile();

  useEffect(() => {
    (async () => {
      const res = await configApi._GET();
      setNezamConfig(res.data);
    })();
  }, []);

  const getContainerStyleFromConfig = () => {
    return {
      backgroundImage: `url(${
        config.url.API_URL + nezamConfig?.background_image
      })`,
    };
  };

  return (
    <>
      <TextModal
        title="درباره ما"
        status={showAbout}
        close={() => setShowAbout(false)}
        text={aboutText}
      />
      <Container
        className="suggestions fade-in"
        style={getContainerStyleFromConfig()}
      >
        <Row className="suggestions-wrapper w-100">
          <Col span={24} lg={12} className="hide-mobile">
            <div className="suggestions-title-container">
              <Link to={pageNames.auth.login} title="ورود به باجه">
                <img
                  className="huge-logo"
                  src={hugeLogo}
                  alt="جهاد نصر کرمان"
                />
              </Link>
              <p className="text-center text-white text-20 suggestions-title font-peyda">
                <span className="text-16">
                  به نرم افزار نظام پیشنهادات هلدینگ جهاد نصر کرمان خوش آمدید
                </span>
                <br />
                {routeParams.type !== "login" && (
                  <span className="text-18">
                    لطفا جهت <span>ارائه پیشنهاد</span>
                    ثبت نام کنید
                  </span>
                )}
                <Link
                  className="text-primary-light text-14 text-underline text-center d-block mt-2"
                  to={pageNames.auth.login}
                >
                  ورود به باجه
                </Link>
              </p>

              {/* <div className="flex justify-center mt-auto">
                <img src={neginLogo} alt="نگین گهر" />
                <span className="text-12 text-white mr-2">
                  طراحی و اجرا توسط شرکت نگین گهر زمین
                </span>
              </div>
              <img className="dots-sm hide-mobile" src={dotsSm} alt="" />
              <Link
                className="text-primary-light text-14 text-underline mt-1 text-center"
                onClick={() => setShowAbout(true)}
              >
                درباره ما
              </Link> */}
            </div>
          </Col>
          <Col span={24} lg={12}>
            <div className="suggestions-form-container">
              <div className="flex w-100 position-relative">
                {/* {state.step > 0 && state.step < 3 && (
                <img
                  src={back}
                  alt="back"
                  className="pointer back-btn"
                  onClick={decrementStep}
                />
              )} */}
                <p className="text-high-black text-24 text-center mx-auto font-peyda-medium">
                  {routeParams.type === "forget" && "فراموشی رمز عبور"}
                  {routeParams.type === "register" && "ثبت نام"}
                  {routeParams.type === "login" && "ورود"}
                </p>
              </div>

              {routeParams.type !== "forget" && (
                <Steps
                  current={state.step}
                  className={`mt-3 mt-md-5 ${
                    routeParams.type === "login" && "limit-width mx-auto"
                  }`}
                  size={isMobile && "small"}
                  progressDot={isMobile}
                  responsive
                >
                  {routeParams.type === "login" && (
                    <Step key={0} title="اطلاعات اولیه" />
                  )}
                  {routeParams.type === "register" && (
                    <Step key={2} title="ثبت اطلاعات" />
                  )}

                  <Step key={1} title="اعتبار سنجی" />

                  {routeParams.type === "register" && (
                    <Step key={3} title="اتمام ثبت نام" />
                  )}
                </Steps>
              )}

              {state.step === 0 && routeParams.type === "login" && (
                <InitialForm />
              )}
              {state.step === 0 && routeParams.type === "register" && (
                <SignupForm />
              )}
              {((state.step === 1 && routeParams.type === "login") ||
                (state.step === 1 && routeParams.type === "register")) && (
                <SignupValidation />
              )}

              {state.step === 2 && routeParams.type === "register" && (
                <SignupSuccess />
              )}
              {routeParams.type === "forget" && <ForgetForm />}

              {state.step < 2 && (
                <div className="flex justify-center mt-2">
                  <span className="text-12 text-light-black">
                    {routeParams.type === "register"
                      ? "حساب کاربری دارید؟"
                      : "عضو نیستید؟"}
                  </span>
                  <Link
                    to={
                      routeParams.type === "register" ||
                      routeParams.type === "forget"
                        ? getLink(pageNames.suggest.auth.signUp, {
                            type: "login",
                          })
                        : getLink(pageNames.suggest.auth.signUp, {
                            type: "register",
                          })
                    }
                    className="mr-2 text-primary text-underline text-14"
                  >
                    {routeParams.type === "register" ||
                    routeParams.type === "forget"
                      ? "ورود"
                      : "ثبت نام"}
                  </Link>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

// css
const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-size: cover;
  padding: 60px;
  @media (max-width: ${bp.md}) {
    padding: 0px;
    background-image: none;
    background-color: white;
  }
  .suggestions {
    &-wrapper {
      border-radius: 20px;
      height: 100%;

      @media (min-width: ${bp.xxl}) {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        max-width: 1400px;
        margin: auto;
        max-height: 900px;
      }

      @media (max-width: ${bp.md}) {
        border-radius: 0px;
      }
    }

    &-title-container {
      position: relative;
      height: 100%;
      width: 100%;
      background: rgba(15, 29, 42, 0.65);
      backdrop-filter: blur(3px);
      border-radius: 0px 20px 20px 0px;
      display: flex;
      padding: 14px;
      flex-direction: column;
      align-items: center;
      @media (max-width: ${bp.md}) {
        border-radius: 0px;
        background: white;
      }

      .huge-logo {
        width: 300px;
        margin-top: -36px;

        @media (max-width: ${bp.md}) {
          width: 180px;
        }
      }
      .suggestions-title {
        margin-top: 40px !important;
        margin-bottom: 40px !important;
      }

      @media (min-width: ${bp.md}) {
        height: 100%;
        .suggestions-title {
          margin-top: 150px !important;
        }
      }
    }

    &-form-container {
      width: 100%;
      background: white;
      border-radius: 20px 0px 0px 20px;
      //border: 3px solid rgba(23, 57, 88, 0.95);
      border-right: none;
      height: 100%;
      display: flex;
      flex-direction: column;
      @media (min-width: ${bp.md}) {
        box-shadow: -3px 3px 0px rgba(23, 57, 88, 0.5);
      }
      padding: 48px;
      @media (max-width: ${bp.md}) {
        border-radius: 0px;
        padding: 16px;
        margin-bottom: 30px;
      }
    }
  }

  .dots-sm {
    position: absolute;
    right: -50px;
    bottom: -50px;
  }

  .dots-lg {
    position: absolute;
    top: -25px;
    left: 20%;
  }

  .limit-width {
    max-width: 330px;
  }

  .back-btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .signup-steps {
  }
`;

export default SuggestionsSignup;
