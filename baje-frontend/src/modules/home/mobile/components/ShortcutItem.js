import { Col } from "antd";
import React from "react";
import styled from "styled-components";

const ShortcutItem = ({ icon, title, onClick, className }) => {
  return (
    <Col span={8}>
      <StyledShortcutItem
        className={`shortcut-item ${className ? className : ""}`}
        onClick={onClick}
      >
        {icon}
        <p className="text-center text-12">{title}</p>
      </StyledShortcutItem>
    </Col>
  );
};

// css
const StyledShortcutItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  p {
    line-height: 16px;
    margin-top: 5px !important;
    font-weight: 700;
  }
  .anticon {
    font-size: 30px;
  }
  &:active {
    background-color: #e9e9e9;
  }
`;

export default ShortcutItem;
