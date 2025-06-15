import React from "react";
import { Col, Form } from "antd";

const FormItem = (props) => {
  const { name, label, rules, valuePropName, getValueFromEvent } = props;
  const newProps = { ...props };
  newProps.hidden = null;
  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          {...newProps}
          // normalize={props.normalize && props.normalize}
          // extra={props.extra && props.extra}
          // label={label ? label : undefined}
          // name={name ? name : undefined}
          // rules={rules ? rules : undefined}
          // valuePropName={valuePropName ? valuePropName : undefined}
          // getValueFromEvent={getValueFromEvent ? getValueFromEvent : undefined}
        >
          {props.children}
        </Form.Item>
      </Col>
    </>
  );
};

export default FormItem;
