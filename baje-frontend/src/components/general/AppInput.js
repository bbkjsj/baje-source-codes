import { Input } from "antd";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

/**
 * @param {object} props - prorps of component
 * @param {object} props.placeholder - placeholder
 * @param {object} props.label - label
 * @param {object} props.required - required
 * @param {object} props.className - className
 * @returns
 */
const AppInput = React.forwardRef((props, ref) => {
  return (
    <InputContainer className={`app-input ${props.className || ""}`}>
      {/* {props.label && (
        <p className="text-high-black app-input-label mb-1">
          {props.label}
          {props.required && <span className="text-danger"> *</span>}
        </p>
      )} */}
      <Input {...props} ref={ref} className="app-input-input" />
    </InputContainer>
  );
});

// css
const InputContainer = styled.div`
  width: 100%;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

// types
AppInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  ...Input.propTypes,
};

export default AppInput;
