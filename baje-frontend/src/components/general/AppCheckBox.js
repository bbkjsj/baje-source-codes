import React from "react";
import { Checkbox } from "antd";
import PropTypes from "prop-types";

/**
 *
 * @param {object}  params - params of component
 * @param {boolean}  params.disabled - disable checkbox
 * @returns
 */

const AppCheckBox = (props) => {
  return <Checkbox {...props} />;
};

AppCheckBox.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  ...Checkbox.propTypes,
};

// AppCheckBox.propTypes = Checkbox.propTypes;

export default AppCheckBox;
