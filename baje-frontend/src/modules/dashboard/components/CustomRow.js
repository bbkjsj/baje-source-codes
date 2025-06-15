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

const CustomRow = (props) => {
  return (
    <>
      <RowWithMargin gutter={10}>
        {props.list.map((item) => (
          <Col sm={12} key={props.name}>
            <Row>
              <Col>
                <StyledTitle>{item.name} : </StyledTitle>
              </Col>
              <Col> {item.value}</Col>
            </Row>
          </Col>
        ))}
      </RowWithMargin>
    </>
  );
};

export default CustomRow;
