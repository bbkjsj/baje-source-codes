import React from "react";
import logo from "../../assets/img/lodingLogo.png";
import styled, { keyframes } from "styled-components";
import { config } from "../../constant";
import { useSelector } from "react-redux";
import bajeLogo from "assets/images/logo-blue.svg";
import eclipseLoading from "assets/images/eclipseLoading.svg";

const LoadingLogo = () => {
  const officeLogo = useSelector((state) => state.officeLogo);
  const companyLogo = officeLogo ? config.url.API_URL + officeLogo : logo;

  return (
    <LoadingContainer logo1={logo} logo2={companyLogo}>
      {/* <div className="spinner" /> */}
      <img src={eclipseLoading} className="eclipse-loading" alt="spin" />
      <img src={bajeLogo} className="image-loader" alt="loading" width="50" />
      <p className="mt-4">در حال دریافت اطلاعات</p>
    </LoadingContainer>
  );
};

// const backgroundChange = (logo1, logo2) => keyframes`
//   0%, 50% {
//     background-image: url(${logo1});
//   }

//   51%, 100%{
//     background-image: url(${logo2});
//   }
// `;

// const spinner = keyframes`
//   0% {
//     transform: rotateY(-90deg) rotateZ(0);
//   }

//   100%{
//     transform: rotateY(90deg) rotateZ(0);
//   }
// `;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 30px 0;
  position: relative;

  .eclipse-loading {
    position: absolute;
    width: 110px;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .spinner {
    display: inline-block;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform: rotateZ(0);
    width: 120px;
    height: 70px;
    margin-bottom: 10px;
    /* background-image: url(bajeLogo); */
  }

  .image-loader {
    z-index: 2;
    /* visibility: hidden;
    height: 0;
    width: 0; */
  }
`;

/* animation: 1s linear infinite ${spinner},
      2s linear infinite
        ${(props) => backgroundChange(props.logo1, props.logo2)}; */

export default LoadingLogo;
