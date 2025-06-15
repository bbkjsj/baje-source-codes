import React from "react";
import logo from "../../../assets/img/mainLogo.png";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 30px;
    margin-left: 10px;
  }
  p {
    font-size: 15px;
  }
`;

const FooterContent = () => {
  return (
    <Wrapper>
      <img src={logo} alt="logo" />
      <p> طراحی و اجرا توسط شرکت نگین گهر زمین - تابستان 99</p>
    </Wrapper>
  );
};

export default FooterContent;
