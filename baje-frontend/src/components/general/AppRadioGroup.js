import PropTypes from "prop-types";
import { Radio } from "antd";
import React from "react";

/**
 *
 * @param {object} prp - props of component
 * @param {Array<{label:string,value:string}>} prp.options - props of component
 * @param {Function} prp.onChange - fire when changed
 * @param {string} prp.value - value
 * @param {string} prp.disabled - disable RadioGroup
 * @returns
 */
const AppRadioGroup = (prp) => <Radio.Group {...prp} />;

AppRadioGroup.propTypes = {
  ...Radio.propTypes,
  disabled: PropTypes.bool,
};

export default AppRadioGroup;
