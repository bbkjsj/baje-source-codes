import React, { useState, useEffect } from "react";
import { Form, Col, Row, Input, Button, message } from "antd";
import axios from "api/appAxios";
import { countOfNumInp } from "_helpers";
import AppButton from "components/general/AppButton";

const FetchDataWithCode = (props) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(props.type);
  const { form } = props;

  useEffect(() => {
    setAction(props.type);
  }, [props.type]);

  useEffect(() => {
    if (props.rest) {
      setAction("send");
    }
  }, [props.rest]);

  const checkCode = () => {
    let code = form.getFieldValue(props.codeInputName);
    if (code) {
      setLoading(true);
      axios
        .get(`/api/admin${props.url}/${code}`)
        .then((res) => {
          setLoading(false);

          form.setFieldsValue({
            [props.textInputName]: `${res.data.first_name} ${res.data.last_name}`,
          });

          props.setData(res.data);
          setAction("edit");
        })
        .catch((error) => {
          setLoading(false);
          message.error(error?.response?.data);
          form.setFieldsValue({
            [props.codeInputName]: ``,
          });
        });
    }
  };

  const edit = () => {
    setAction("send");
  };

  let inputCode = (
    <Col span={18}>
      <Form.Item
        name={props.codeInputName}
        //rules={props.codeInputRules}
        rules={[
          { len: 10, message: "کد ملی اشتباه است" },

          () => ({
            validator(rule, value) {
              if (value && action === "send") {
                return Promise.reject("کد ملی  بررسی نشده است !");
              } else {
                return Promise.resolve();
              }
            },
          }),
        ]}
        normalize={(value, prevValue) => countOfNumInp(value, prevValue, 10)}
      >
        <Input />
      </Form.Item>
    </Col>
  );

  let inputName = (
    <Col span={18}>
      <Form.Item name={props.textInputName}>
        <Input disabled />
      </Form.Item>
    </Col>
  );

  let btnSend = (
    <Col span={6}>
      <AppButton size={"large"} loading={loading} block onClick={checkCode}>
        بررسی
      </AppButton>
    </Col>
  );

  let btnEdit = (
    <Col span={6}>
      <AppButton size={"large"} block onClick={edit}>
        تغییر
      </AppButton>
    </Col>
  );

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          // name={props.name}
          style={{ marginBottom: "0" }}
          label={props.label}
        >
          <Row>
            {action === "send" ? inputCode : inputName}
            {action === "send" ? btnSend : btnEdit}
          </Row>
        </Form.Item>
      </Col>
    </>
  );
};

export default FetchDataWithCode;
