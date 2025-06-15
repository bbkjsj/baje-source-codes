import React from "react";
import { InputNumber } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 *
 * @param {object} props - props
 * @param {number} props.min - minimum value
 * @param {number} props.max- maximum value
 * @returns
 */
const AppNumInput = (props) => (
  <StyledInputNumber
    {...props}
    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
  />
);

const StyledInputNumber = styled(InputNumber)`
  .ant-input-number-handler-wrap {
    display: none;
  }
`;

AppNumInput.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
  ...InputNumber.propTypes,
};

export default AppNumInput;
