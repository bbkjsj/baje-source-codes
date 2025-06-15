import { Col, Row } from "antd";
import React from "react";
import errorIcon from "assets/images/404-error.png";
import styled from "styled-components";
import AppButton from "components/general/AppButton";
import { HomeOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { pageNames } from "constant";

function NotFound() {
  const history = useHistory();
  return (
    <Row>
      <Col xs={24} className="text-center">
        <StyledImage src={errorIcon} alt="" />
      </Col>
      <Col xs={24} className="text-center">
        <h2 style={{ padding: "2rem" }}>متاسفانه صفحه موردنظر یافت نشد!</h2>
        <div className="flex justify-center">
          <AppButton
            variant=""
            className="ml-2"
            onClick={() => history.goBack()}
          >
            <ArrowRightOutlined />
            بازگشت
          </AppButton>
          <AppButton
            variant="primary"
            onClick={() => history.push(pageNames.home.web)}
          >
            <HomeOutlined />
            خانه
          </AppButton>
        </div>
      </Col>
    </Row>
  );
}

const StyledImage = styled.img`
  width: 50%;
`;

export default NotFound;
