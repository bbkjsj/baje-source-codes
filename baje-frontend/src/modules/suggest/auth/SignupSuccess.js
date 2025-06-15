import AppButton from "components/general/AppButton";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import bp from "utils/breakpoints";
import success from "assets/images/success.svg";
import { pageNames } from "constant";

const SignupSuccess = () => {
  const history = useHistory();

  return (
    <FormContainer className="fade-in">
      <img src={success} alt="mobile" className="mx-auto d-block" width="153" />

      <h3 className="text-24 text-success font-peyda text-center mt-5">
        ثبت نام شما با موفقیت انجام شد
      </h3>

      <p className="text-16 text-high-black text-center subtitle mx-auto">
        از این پس می توانید پیشنهادات خود را در نظام پیشنهادات باجه ثبت کرده و
        روند پیشرفت آنها را مشاهده نمایید
      </p>

      <div className="flex justify-center mt-3 mt-lg-auto mb-2 mb-lg-0">
        <Link
          onClick={() => (window.location = pageNames.suggest.suggestion.add)}
        >
          <AppButton className="form-btn" variant="primary" size="large">
            ثبت پیشنهاد
          </AppButton>
        </Link>
        {/* <AppButton
          className="form-btn mr-1"
          size="large"
          onClick={() => history.goBack()}
        >
          انصراف
        </AppButton> */}
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

  .subtitle {
    max-width: 464px;
    margin-top: 18px;
    margin-left: auto;
    margin-right: auto;
  }
`;

export default SignupSuccess;
