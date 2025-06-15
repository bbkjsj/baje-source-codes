import React from "react";
import styled from "styled-components";
import { Button, Col } from "antd";
import AppButton from "components/general/AppButton";

const WarperBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const SubmitBtn = (props) => {
  if (props.customFunction) {
    return (
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <WarperBtn>
          <AppButton
            loading={props.loading}
            onClick={props.customFunction}
            variant="primary"
            className="big-btn"
            {...props}
          >
            {props.text ?? "ثبت"}
          </AppButton>
        </WarperBtn>
      </Col>
    );
  }

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <WarperBtn>
        <AppButton
          variant="primary"
          className="big-btn"
          htmlType="submit"
          loading={props.loading}
          {...props}
        >
          {props.text ?? "ثبت"}
        </AppButton>
      </WarperBtn>
    </Col>
  );
};

SubmitBtn.propTypes = AppButton.propTypes;

export default SubmitBtn;
