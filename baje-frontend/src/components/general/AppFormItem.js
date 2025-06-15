import React from "react";
import { Form } from "antd";
import { ruleMessages } from "../../constant";
import PropTypes from "prop-types";

/**
 *
 * @param {object} params - params of component
 * @param {string} params.name - name of params
 * @param {string} params.label - label
 * @param {Array<{required:boolean,message:string,min:number,max:number}>} params.rules - rules
 * @param {boolean} params.required - required boolean
 * @param {string} params.tooltip - tootip
 * @returns
 */
const AppFormItem = ({ children, required, rules = [], label, ...props }) => {
  const customRules = [...rules];
  if (required)
    customRules.push({ required: true, message: ruleMessages.required(label) });
  return (
    <Form.Item
      labelCol={{ span: 24 }}
      label={label}
      required={required}
      rules={customRules}
      colon={false}
      {...props}
    >
      {children}
    </Form.Item>
  );
};

AppFormItem.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  ...Form.Item.propTypes,
};

export default AppFormItem;
