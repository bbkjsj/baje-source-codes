import PropTypes from "prop-types";
import { Select, Spin } from "antd";
import styled from "styled-components";
import chevron from "../../assets/images/icons/chevron-down.svg";
import React from "react";

/**
 *
 * @param {object} params - params of component
 * @param {string} params.label - label of component
 * @param {boolean} params.required - required value
 * @param {string} params.className - className
 * @param {"multipe"|"tags"} params.mode - mode of selector
 * @param {string} params.placeholder - placeholder
 * @param {boolean} params.loading - loading
 * @param {boolean} params.disabled - disabled
 * @param {Array<{label:string, value:string, disabled:boolean}>} params.options - options
 * @param {boolean} params.showSearch - show search
 * @param {boolean} params.allowClear - allow clear
 * @param {Function} params.filterOption - filter option
 
 * @returns
 */
const AppSelect = ({
  children,
  label,
  required,
  className,
  loading,
  ...props
}) => {
  return (
    <div className="app-select-container">
      {label && (
        <p className="text-high-black app-input-label">
          {label}
          {required && <span className="text-danger"> *</span>}
        </p>
      )}

      <StyledSelect
        {...props}
        suffixIcon={
          loading ? (
            <Spin size="small" />
          ) : (
            <img src={chevron} alt="select" className="app-select-icon" />
          )
        }
        className={`app-select ${className}`}
      >
        {children}
      </StyledSelect>
    </div>
  );
};

AppSelect.propTypes = {
  ...Select.propTypes,
  loading: PropTypes.bool,
};

// css
const StyledSelect = styled(Select)`
  max-width: 100%;
  min-width: 130px;
  .app-select-icon {
    transform: translateY(-2.5px);
  }
  .ant-select-selector {
    border-radius: 4px !important;
  }
`;

export default AppSelect;
