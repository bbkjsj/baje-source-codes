import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
/**
 * Component to display number of unread notifications
 * @param {object} props - params of component
 * @param {number} props.count - count
 * @param {string} props.className - string className
 * @returns
 */
const AppBadge = ({ count, className }) => {
  if (!count || count < 0) return null;
  return (
    <StyledBadge className={`app-badge ${className}`}>
      <strong style={{ color: "#ffffff !important" }}>{count}</strong>
    </StyledBadge>
  );
};

AppBadge.propTypes = {
  /**
   * Bag's number
   */
  count: PropTypes.number,
  /**
   * className form margin-right
   */
  className: PropTypes.string,
};

const StyledBadge = styled.div`
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff4d4f;
  border-radius: 999px;
  color: #ffffff !important;

  strong {
    color: #ffffff !important;
    font-weight: 400 !important;
  }
`;

export default AppBadge;
