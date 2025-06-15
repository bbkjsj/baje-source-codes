import { Input } from "antd";
import React from "react";

/**
 *
 * @param {object} params - all props of component
 * @returns
 */

const AppTextArea = ({ ...props }) => <Input.TextArea {...props} />;

AppTextArea.propTypes = Input.TextArea.propTypes;

export default AppTextArea;
