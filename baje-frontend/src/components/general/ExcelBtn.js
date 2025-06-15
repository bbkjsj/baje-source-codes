import React from "react";
import styled from "styled-components";
import { Button } from "antd";
import excel from "../../assets/images/icons/excel.svg";

/**
 *
 * @param {object} params - all  props of component
 * @returns
 */

const ExcelBtn = (props) => {
  return (
    <ExcelButton
      {...props}
      icon={<img src={excel} alt="excel" className="ml-1" />}
      className="excel-btn mt-3 mt-md-0"
    >
      {props.children ? props.children : "خروجی اکسل"}
    </ExcelButton>
  );
};

ExcelBtn.propTypes = Button.propTypes;

const ExcelButton = styled(Button)`
  &.excel-btn {
    border-color: #2e7d32;
    color: #2e7d32;
    background-color: rgba(46, 125, 50, 0.1);
  }
`;

export default ExcelBtn;
