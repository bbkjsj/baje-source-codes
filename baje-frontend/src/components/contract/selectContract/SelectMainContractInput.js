import React from "react";
import { Row, Col, Button, Form, Input } from "antd";
import { numberNormalize } from "../../../_helpers";
import AppButton from "components/general/AppButton";

const SelectMainContractInput = (props) => {
  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          name={props.name}
          style={{ marginBottom: "0" }}
          label={props.label}
        >
          <Row>
            <Col span={18}>
              <Form.Item
                name={props.textInputName}
                rules={props.rules}
                normalize={numberNormalize}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <AppButton size={"large"} block onClick={props.onClick}>
                انتخاب
              </AppButton>
            </Col>
          </Row>
        </Form.Item>
      </Col>
    </>
  );
};

export default SelectMainContractInput;
