import { Tag } from "antd";
import PropTypes from "prop-types";
import React from "react";

/**
 *  Tag Component
 * @param {object} params - params of component
 * @returns
 */
const AppTag = (props) => <Tag {...props} />;

AppTag.propTypes = Tag.propTypes;

export default AppTag;
