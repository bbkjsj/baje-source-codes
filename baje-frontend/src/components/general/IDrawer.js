import React from "react";
import { Drawer, DrawerProps } from "antd";
import PropTypes from "prop-types";

/**
 * IDrawer component
 * @param {object} params - params of component
 * @returns
 */
const IDrawer = ({ ...prp }) => <Drawer {...prp} />;

IDrawer.propTypes = {
  ...Drawer.propTypes,
  name: PropTypes.string,
};

export default IDrawer;
