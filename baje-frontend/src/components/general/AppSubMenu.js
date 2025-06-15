import React from "react";
import { Menu } from "antd";
import PropTypes from "prop-types";

/**
 * AppSubMenu : a component to display cusomized antd Menu.SubMenu
 * @param {object} props all component's props
 * @param {boolean} props.hidden to display component or not
 * @returns
 */
const AppSubMenu = (props) => {
  return (
    !props.hidden && <Menu.SubMenu {...props}>{props.children}</Menu.SubMenu>
  );
};
AppSubMenu.propTypes = {
  hidden: PropTypes.bool,
  ...Menu.SubMenu.propTypes,
};

export default AppSubMenu;
