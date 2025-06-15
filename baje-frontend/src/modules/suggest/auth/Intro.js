import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Space } from "antd";
import styled from "styled-components";
import hugeLogo from "assets/images/huge-logo.svg";
import neginLogo from "assets/images/negin-logo.svg";
import bp from "utils/breakpoints";
import { Link } from "react-router-dom";
import dotsSm from "assets/images/dots-sm.svg";
import AppButton from "components/general/AppButton";
import { getLink } from "../../../_helpers";
import * as configApi from "../configuration/utils/api";
import TextModal from "components/general/TextModal";
import FaqText from "./FaqText";
import { aboutText, config, pageNames } from "constant";

const SuggestionsSignup = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [nezamConfig, setNezamConfig] = useState({});

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
        title="سوالات متداول"
        status={showFaq}
        close={() => setShowFaq(false)}
        text={<FaqText />}
        width={1080}
      />

      <TextModal
        title="درباره ما"
        status={showAbout}
        close={() => setShowAbout(false)}
        text={aboutText}
      />

      <Container className="suggestions" style={getContainerStyleFromConfig()}>
        <Row className="suggestions-wrapper w-100">
          <Col span={24}>
            <div className="suggestions-title-container">
              <Link
                to={pageNames.auth.login}
                title="ورود به باجه"
                className="fade-in"
              >
                <img
                  className="huge-logo"
                  src={hugeLogo}
                  alt="جهاد نصر کرمان"
                />
              </Link>
              <p className="text-center text-white text-20 suggestions-title fade-in">
                <span className="text-16 font-peyda">
                  به نرم افزار نظام پیشنهادات هلدینگ جهاد نصر کرمان خوش آمدید
                </span>
                <br />
                <span className="text-18 font-peyda">
                  لطفا جهت <span className="highlight">ثبت پیشنهاد</span>{" "}
                  ورود/ثبت نام را انتخاب نمایید
                </span>
              </p>

              <div
                className="flex justify-center intro-btns mb-3 fade-in"
                size="small"
              >
                <Link
                  to={getLink(pageNames.suggest.auth.signUp, { type: "login" })}
                >
                  <AppButton variant="primary" className="big-btn">
                    ورود
                  </AppButton>
                </Link>
                <Link
                  to={getLink(pageNames.suggest.auth.signUp, {
                    type: "register",
                  })}
                >
                  <AppButton className="big-btn mr-1">ثبت نام</AppButton>
                </Link>
              </div>
              <Link
                className="text-primary-light text-16 text-underline text-center mt-2 d-block"
                to={pageNames.auth.login}
              >
                ورود به باجه
              </Link>

              <div className="flex justify-center mt-auto position-relative fade-in">
                <img className="dots-sm hide-mobile" src={dotsSm} alt="" />
                <img src={neginLogo} alt="نگین گهر" />
                <span className="text-12 text-white mr-2">
                  طراحی و اجرا توسط شرکت نگین گهر زمین
                </span>
              </div>

              <div className="flex mt-1 fade-in">
                <Link
                  className="text-primary-light text-14 text-underline text-center"
                  onClick={() => setShowAbout(true)}
                >
                  درباره ما
                </Link>
                <Link
                  className="text-primary-light text-14 text-underline text-center mr-2 pr-2 justify-center faq-link"
                  onClick={() => setShowFaq(true)}
                >
                  سوالات متداول
                </Link>
              </div>
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

  @media (max-width: ${bp.xxl}) {
    padding: 40px;
  }
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
      backdrop-filter: blur(3px);
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

        @media (max-width: ${bp.xxl}) {
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

      @media (min-width: ${bp.xxl}) {
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
    display: none;
  }

  .intro-btns {
    margin-top: 8px;
  }

  .faq-link {
    border-right: 1px solid white;
  }
`;

export default SuggestionsSignup;
