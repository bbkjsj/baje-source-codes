import React, { useState, useEffect } from "react";
import { Row, Col, Space } from "antd";
import styled from "styled-components";
import loginBg from "assets/images/login-bg.jpg";
import hugeLogo from "assets/images/huge-logo.svg";
import neginLogo from "assets/images/negin-logo.svg";
import bp from "utils/breakpoints";
import { Link } from "react-router-dom";
import dotsSm from "assets/images/dots-sm.svg";
import back from "assets/images/icons/back-circle.svg";
import LoginForm from "./LoginForm";
import LoginValidation from "./LoginValidation";
import { useLoginSubmit } from "./util/hooks";
import TextModal from "components/general/TextModal";
import lightbulb from "assets/images/icons/lightbulb.svg";
import AppButton from "components/general/AppButton";
import { ArrowRightOutlined } from "@ant-design/icons";
import { aboutText, pageNames } from "constant";
import MobileLogin from "./MobileLogin";
// import useMobileDetect from "use-mobile-detect-hook";

const NewLogin = () => {
  // const { isMobile } = useMobileDetect();
  const isMobile = () => false; // TODO: Replace with react-device-detect logic
  const [
    loading,
    onSubmit,
    step,
    setStep,
    handleLoginSubmit,
  ] = useLoginSubmit();

  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (!isMobile() && step == 0) {
      setStep(1);
    }
  }, [step, setStep]); // Added step and setStep to dependency array

  return (
    <>
      <TextModal
        title="درباره ما"
        status={showAbout}
        close={() => setShowAbout(false)}
        text={aboutText}
      />
      {isMobile() && step == 0 ? ( // This will currently always be false
        <MobileLogin setStep={setStep} />
      ) : (
        <Container className="logins">
          <Row className="logins-wrapper w-100">
            <Col span={24}>
              <div className="logins-title-container">
                <p className="text-center hide-desktop font-peyda">
                  <span className="text-mid-black text-18">
                    بانک جامع اطلاعات هلدینگ
                  </span>
                  <br />
                  <span className="text-20 font-peyda-medium">
                    جـــهــاد نــــصــــر کــــرمــــان
                  </span>
                </p>
                <p className="text-center text-20 hide-desktop font-peyda mt-3">
                  ورود
                </p>
                <img
                  className="huge-logo hide-mobile"
                  src={hugeLogo}
                  alt="جهاد نصر کرمان"
                />
                <p className="text-center text-white text-20 logins-title hide-mobile">
                  <span className="font-peyda-medium welcome-text">
                    به
                    <span className="text-primary-light"> باجه </span>
                    خوش آمدید
                  </span>
                  <br />
                  <span className="text-14 font-peyda mt-0">
                    شما هم بیاید پشت باجه
                  </span>
                </p>

                <div className="forms-container mt-1 mb-md-3 pb-0 pb-md-4">
                  {step > 1 && (
                    <AppButton
                      src={back}
                      shape="circle"
                      icon={<ArrowRightOutlined />}
                      title="بازگشت"
                      className="pointer"
                      onClick={() => setStep(1)}
                    />
                  )}

                  {step === 1 ? (
                    <LoginForm
                      onSubmit={onSubmit}
                      loading={loading}
                      onCancel={() => setStep(1)}
                    />
                  ) : (
                    <LoginValidation
                      onSubmit={onSubmit}
                      loading={loading}
                      handleLoginSubmit={handleLoginSubmit}
                      onCancel={() => setStep(1)}
                    />
                  )}
                </div>

                <Link
                  className="suggest-link flex justify-center hide-mobile"
                  to={pageNames.suggest.auth.intro}
                >
                  <img src={lightbulb} alt="ورود به نظام پیشنهادات باجه" />
                  <span className="text-white text-bold text-14 mr-2">
                    ورود به نظام پیشنهادات باجه
                  </span>
                </Link>

                {/* <div className="flex justify-center mt-auto position-relative">
                  <img src={neginLogo} alt="نگین گهر" />
                  <span className="text-14 mr-2 credit-text">
                    طراحی و اجرا توسط شرکت نگین گهر زمین
                  </span>
                </div>
                <Link
                  className="text-primary-light text-14 text-underline mt-1 text-center"
                  onClick={() => setShowAbout(true)}
                >
                  درباره ما
                </Link> */}
              </div>
            </Col>
          </Row>
        </Container>
      )}
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
  padding: 30px;
  @media (min-width: ${bp.xxl}) {
    padding: 45px;
  }
  @media (min-width: ${bp.md}) {
    background-image: url(${loginBg});
  }
  @media (max-width: ${bp.md}) {
    background: white;
    overflow-y: hidden;
  }
  .logins {
    &-wrapper {
      border-radius: 20px;
      height: 100%;

      @media (max-width: ${bp.md}) {
        border-radius: 0px;
      }
    }

    &-title-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 20px;
      display: flex;
      padding: 16px;
      flex-direction: column;
      align-items: center;
      @media (min-width: ${bp.md}) {
        background: rgba(15, 29, 42, 0.65);
      }
      @media (max-width: ${bp.xxl}) {
        //border-radius: 0px;
      }

      .huge-logo {
        max-width: 250px;
        width: 100%;
        margin-top: -36px;

        @media (max-width: ${bp.xxl}) {
          width: 180px;
        }
        @media (min-width: ${bp.md}) and (max-width: ${bp.xxl}) {
          //display: none;
          position: absolute;
          top: -16px;
          margin-top: 0;
          right: 32px;
        }
      }
      .logins-title {
        margin-top: 30px !important;
        margin-bottom: 3px !important;
        a {
          color: #7dafdd;
          border-bottom: 1px solid #7dafdd;
        }
        .welcome-text {
          font-size: 24px;
          @media (min-width: ${bp.xxl}) {
            font-size: 34px;
          }
        }
      }

      @media (min-width: ${bp.xxl}) {
        height: 100%;
        .logins-title {
          margin-top: 50px !important;
        }
      }
    }
  }

  .dots-sm {
    right: -160px;
    top: -14px;
    position: absolute;
  }

  .dots-lg {
    position: absolute;
    top: -25px;
    left: 20%;
  }

  .forms-container {
    padding: 16px;
    @media (min-width: ${bp.xxl}) {
      padding: 24px;
    }
    @media (max-width: ${bp.md}) {
      height: 100%;
    }
    background: white;
    border-radius: 20px;
    max-width: 368px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .suggest-link {
    width: 100%;
    max-width: 368px;
    background: #2f75b5;
    border: 2px solid #2f75b5;
    box-shadow: 10px 0px 20px rgba(0, 0, 0, 0.1);
    color: white;
    margin-top: 13px;
    margin-bottom: 13px;
    min-height: 48px;
    border-radius: 12px;
    align-items: center;
    padding: 5px 16px;
    transition: all 0.3s ease;

    @media (max-width: ${bp.md}) {
      max-width: 316px;
      margin-bottom: 20px;
    }

    &:active {
      box-shadow: none;
    }

    &:hover {
      background: #3a84c8;
    }
  }

  .credit-text {
    color: white;
    @media (max-width: ${bp.md}) {
      color: black;
    }
  }
`;

export default NewLogin;
