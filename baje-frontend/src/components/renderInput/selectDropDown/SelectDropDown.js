import React from "react";
import { Spin, Form, Col, Select } from "antd";
import { v4 as uuidv4 } from "uuid";

const SelectDropDown = (props) => {
  let listOfOption = props.options;
  return (
    <Col xs={24} sm={24} md={24} lg={12} xl={6}>
      <Form.Item
        key={uuidv4()}
        label={props.label}
        name={props.name}
        rules={props.rules}
        initialValue={props.defaultValue}
      >
        <Select
          disabled={props.disabled}
          notFoundContent={listOfOption ? <Spin size="small" /> : null}
          options={listOfOption}
        />
      </Form.Item>
    </Col>
  );
};

export default SelectDropDown;
