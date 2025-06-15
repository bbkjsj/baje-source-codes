import React from "react";
import { Menu } from "antd";

import PropTypes from "prop-types";

/**
 * AppMenuItem : a component to display cusomized antd menu.item
 * @param {object} props all component's props
 * @param {boolean} props.hidden to display component or not
 * @returns
 */

const AppMenuItem = (props) => {
  return !props.hidden && <Menu.Item {...props}>{props.children}</Menu.Item>;
};

AppMenuItem.propTypes = {
  hidden: PropTypes.bool,
  danger: PropTypes.bool,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  ...Menu.Item.propTypes,
};

export default AppMenuItem;
