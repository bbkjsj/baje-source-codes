import React, { useState, useEffect } from "react";
import { Form, Col, Row, Input, Button, message, Select } from "antd";
import axios from "api/appAxios";
import SelectDropDown from "../selectDropDown/SelectDropDown";
import { national_id_normalize, numberNormalize } from "../../../_helpers";
import AppButton from "components/general/AppButton";

const GetPerson = (props) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("send");
  const [resultType, setResultType] = useState("single");
  const [resultList, setResultList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const { form } = props;

  const checkCode = () => {
    let code = form.getFieldValue(props.codeInputName);
    if (code) {
      setLoading(true);
      axios
        .get(`/api/admin${props.url}/${code}`)
        .then((res) => {
          const list = res.data.list;
          setLoading(false);

          if (list.length > 0) {
            if (list.length === 1) {
              setResultType("single");
              props.setContractor(list[0]);
              form.setFieldsValue({
                [props.textInputName]: `${list[0]["name"]}`,
              });
            } else if (list.length > 1) {
              let options = [...list];
              options = options.map((el) => {
                return { label: `${el.name}- ${el.number}`, value: el.id };
              });
              setResultType("list");
              setResultList(list);
              setOptionList(options);
            }

            setAction("edit");
          } else {
            setLoading(false);
            message.error("کد ملی یا شناسه ملی اشتباه است.");
            form.setFieldsValue({
              [props.codeInputName]: ``,
            });
          }
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
    form.setFieldsValue({
      [props.textInputName]: ``,
    });
    props.setContractor();
    setAction("send");
  };

  const onChangeSelectBox = (value) => {
    let index = resultList.findIndex((el) => el.id === value);
    if (index !== -1) {
      const contractor = resultList[index];
      props.setContractor(contractor);
    }
  };

  let inputCode = (
    <Col span={18}>
      <Form.Item
        validateFirst
        name={props.codeInputName}
        rules={props.codeInputRules}
        normalize={national_id_normalize}
      >
        <Input disabled={loading} />
      </Form.Item>
    </Col>
  );

  let inputName = (
    <Col span={18}>
      <Form.Item name={props.textInputName}>
        {resultType === "list" ? (
          <Select
            defaultOpen={true}
            options={optionList}
            onChange={onChangeSelectBox}
          />
        ) : (
          <Input disabled />
        )}
      </Form.Item>
    </Col>
  );

  let btnSend = (
    <Col span={6}>
      <AppButton size="large" loading={loading} block onClick={checkCode}>
        بررسی
      </AppButton>
    </Col>
  );

  let btnEdit = (
    <Col span={6}>
      <AppButton size="large" block onClick={edit}>
        تغییر
      </AppButton>
    </Col>
  );

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={12} xl={6}>
        <Form.Item
          name={props.name}
          style={{ marginBottom: "0" }}
          label={props.label}
          normalize={national_id_normalize}
          extra="کد ملی فرد یا شناسه ملی شرکت را وارد نمایید"
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

export default GetPerson;
