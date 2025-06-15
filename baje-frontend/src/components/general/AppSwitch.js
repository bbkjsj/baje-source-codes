import { Switch } from "antd";
import React from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {object} params - params of component
 * @param {boolean} params.checked - checked option
 * @param {Function} params.onChange - onn change function
 * @returns
 */
const AppSwitch = ({ ...prp }) => {
  return <Switch {...prp} />;
};

AppSwitch.propTypes = {
  ...Switch.propTypes,
  size: PropTypes.oneOf(["default", "small"]),
};

export default AppSwitch;
