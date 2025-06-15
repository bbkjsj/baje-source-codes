import React from "react";
import styled from "styled-components";
import { Row, Col } from "antd";

const RowWithMargin = styled(Row)`
  margin-bottom: 19px;
  background-color: rgba(241, 242, 246, 0.3);
  padding: 5px;
  border-radius: 5px;
`;

const StyledTitle = styled.p`
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
`;

const Field = (props) => {
  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={8} key={props.name}>
        <RowWithMargin gutter={10}>
          <Col>
            <StyledTitle>{props.name} :</StyledTitle>
          </Col>
          <Col>{props.value}</Col>
        </RowWithMargin>
      </Col>
    </>
  );
};

export default Field;
