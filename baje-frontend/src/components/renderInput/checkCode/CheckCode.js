import React, { useEffect } from "react";
import { Form, Col, Row, Input, Button } from "antd";
import { numberNormalize } from "../../../_helpers";
import AppButton from "components/general/AppButton";
import { formColSpan } from "../../../constant";

const CheckCode = (props) => {
  const handleOnChange = (e) => {
    if (e.target.value.length === 6) {
      props.checkCode();
    }
  };

  return (
    <>
      <Col {...formColSpan}>
        <Form.Item
          name={props.name}
          style={{ marginBottom: "0" }}
          label={props.label}
        >
          {props.status == "edit" ? (
            <Row>
              <Col span={18}>
                <Form.Item
                  name={props.resultNameFiled}
                  initialValue={props.job_Title && props.job_Title}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <AppButton size="large" block onClick={props.edit}>
                  تغییر
                </AppButton>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col span={18}>
                <Form.Item
                  name={props.filedName}
                  rules={props.filedRules}
                  initialValue={props.job_Code && props.job_Code}
                >
                  {props.children}

                  {/* //after check  id covert to text filed  */}
                </Form.Item>
              </Col>
              <Col span={6}>
                <AppButton
                  size="large"
                  loading={props.loading}
                  block
                  onClick={props.checkCode}
                >
                  بررسی
                </AppButton>
              </Col>
            </Row>
          )}
        </Form.Item>
      </Col>
    </>
  );
};

export default CheckCode;
