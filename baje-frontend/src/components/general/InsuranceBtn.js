import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import insuranceLogo from "assets/images/social-insurance-logo.svg";

const InsuranceBtn = (props) => {
  return (
    <StyledBtn
      {...props}
      icon={
        <img
          src={insuranceLogo}
          alt="insurance"
          className="ml-2"
          width={20}
          height={20}
        />
      }
      className={"insurance-btn mt-3 mt-lg-0"}
    >
      {props.children || "بیمه تامین اجتماعی"}
    </StyledBtn>
  );
};

InsuranceBtn.propTypes = Button.propTypes;

const StyledBtn = styled(Button)`
  &.insurance-btn {
    img {
      transition: 0.4s all;
    }

    &:hover {
      img {
        filter: brightness(0) invert(1);
      }
    }

    &[disabled] {
      img {
        opacity: 0.3;
        filter: saturate(0);
      }
    }
  }
`;

export default InsuranceBtn;
