import React, { useContext, useState } from "react";
import { Row, Col, Space } from "antd";
import styled from "styled-components";
import loginBg from "assets/images/login-bg.jpg";
import hugeLogo from "assets/images/huge-logo.svg";
import neginLogo from "assets/images/negin-logo.svg";
import bp from "utils/breakpoints";
import { Link } from "react-router-dom";
import dotsSm from "assets/images/dots-sm.svg";
import AppButton from "components/general/AppButton";
import { getLink } from "_helpers";
import TextModal from "components/general/TextModal";
import lightbulb from "assets/images/icons/lightbulb.svg";
import { aboutText, pageNames } from "constant";

const MobileLogin = ({ setStep }) => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <TextModal
        title="درباره ما"
        status={showAbout}
        close={() => setShowAbout(false)}
        text={aboutText}
      />

      <Container className="suggestions">
        <Row className="suggestions-wrapper w-100">
          <Col span={24}>
            <div className="suggestions-title-container">
              <img className="huge-logo" src={hugeLogo} alt="جهاد نصر کرمان" />
              <p className="text-center text-white text-24 logins-title mt-5">
                <span className="font-peyda-medium welcome-text mb-0 d-block">
                  به
                  <span className="text-primary-light"> باجه </span>
                  خوش آمدید
                </span>
                <span className="text-14 font-peyda mt-0 d-block">
                  شما هم بیاید پشت باجه
                </span>
              </p>

              <div className="intro-btns">
                <AppButton
                  className="big-btn d-block w-100-force text-bold"
                  onClick={() => setStep(1)}
                >
                  ورود به باجه
                </AppButton>

                <Link
                  className="suggest-link flex justify-center"
                  to={pageNames.suggest.auth.intro}
                >
                  <img src={lightbulb} alt="ورود به نظام پیشنهادات باجه" />
                  <span className="text-white text-bold text-14 mr-2">
                    ورود به نظام پیشنهادات باجه
                  </span>
                </Link>
              </div>

              {/* <div className="flex justify-center mt-auto position-relative">
                <img className="dots-sm hide-mobile" src={dotsSm} alt="" />
                <img src={neginLogo} alt="نگین گهر" />
                <span className="text-12 text-white mr-2">
                  طراحی و اجرا توسط شرکت نگین گهر زمین
                </span>
              </div> */}
              {/* <Link
                className="text-primary-light text-14 text-underline mt-1 text-center"
                onClick={() => setShowAbout(true)}
              >
                درباره ما
              </Link> */}
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
  background-image: url(${loginBg});
  background-size: cover;
  padding: 60px;
  @media (max-width: ${bp.lg}) {
    padding: 40px 0px;
  }
  .suggestions {
    &-wrapper {
      border-radius: 20px;
      height: 100%;

      @media (min-width: ${bp.xxl}) {
        position: relative;
        top: 50%;
        transform: translateY(-55%);
        max-width: 1400px;
        margin: auto;
        max-height: 880px;
      }

      @media (max-width: ${bp.lg}) {
        top: 30px;
        bottom: 30px;
        border-radius: 0px;
      }
    }

    &-title-container {
      position: relative;
      height: 100%;
      width: 100%;
      background: rgba(15, 29, 42, 0.65);
      border-radius: 20px;
      display: flex;
      padding: 16px;
      flex-direction: column;
      align-items: center;
      @media (max-width: ${bp.lg}) {
        border-radius: 0px;
      }

      .huge-logo {
        width: 300px;
        margin-top: -36px;

        @media (max-width: ${bp.lg}) {
          width: 180px;
        }
      }
      .suggestions-title {
        margin-top: 40px !important;
        margin-bottom: 40px !important;
        .highlight {
          /* color: #7dafdd;
          border-bottom: 1px solid #7dafdd; */
          font-size: 20px;
        }
      }

      @media (min-width: ${bp.lg}) {
        height: 100%;
        .suggestions-title {
          margin-top: 115px !important;
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

  .intro-btns {
    margin-top: 50px;
  }

  .welcome-text {
    font-size: 34px;
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
    border-radius: 4px;
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
`;

export default MobileLogin;
