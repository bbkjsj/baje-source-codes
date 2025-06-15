import { Dropdown } from "antd";
import React from "react";
import PropTypes from "prop-types";

/**
 *
 * @param {object}  params - params of component
 * @param {boolean}  params.disabled - disable Dropdown
 * @returns
 */

const AppDropdown = (props) => {
  return (
    <Dropdown {...props} arrow overlayClassName="app-dropdown-menu">
      {props.children}
    </Dropdown>
  );
};

AppDropdown.propTypes = {
  overlay: PropTypes.element,
  disabled: PropTypes.bool,
  ...Dropdown.propTypes,
};

export default AppDropdown;
