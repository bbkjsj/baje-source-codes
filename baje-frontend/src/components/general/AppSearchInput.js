import { Button, Col, Form, Input, Row } from "antd";
import { formColSpan } from "constant";
import React, { useEffect, useState } from "react";
import AppButton from "./AppButton";
import AppFormItem from "./AppFormItem";

/**
 *
 * @param {object} params - component all props
 * @param {object} params.form - antd form
 * @param {string} params.label - input label for display in ui
 * @param {string} params.codeInput - user entry fieldname 
 * @param {string} params.nameInput -response after search to display in ui
 * @param {string} params.idInput - respone after search asiigneed to fom but hidden
 * @param {array} params.Rules - input rules
 * @param {boolean} params.disabledBtn - disabledBtn
 * @param {function} params.search - search method
 * @param {string} params.defaultValue - default value for codeInput 
 
* @returns
 */
export default function AppSearchInput({
  form,
  disabled,
  label,
  codeInput,
  nameInput,
  idInput,
  Rules,
  disabledBtn = false,
  hideBtn = false,
  search = () => {
    return { name: null, id: null };
  },
  defaultValue,
  onChange,
}) {
  const [activeMode, setActiveMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const searchHandler = async () => {
    setLoading(true);
    try {
      const { name, id } = await search(form.getFieldValue(codeInput));
      form.setFieldsValue({
        [nameInput]: name,
        [idInput]: id,
      });
      setActiveMode(false);
    } catch (error) {
      form.setFieldsValue({
        [codeInput]: null,
        [nameInput]: null,
        [idInput]: null,
      });
    }
    setLoading(false);
  };

  const btnClickHandler = () => {
    if (activeMode) {
      searchHandler();
    } else {
      setActiveMode(true);
      form.setFieldsValue({ [codeInput]: "", [nameInput]: "", [idInput]: "" });
    }
  };
  const changeInputHandler = (e) => {
    console.log(e);
    if (onChange) {
      onChange();
    } else {
      if (e.target.value.length == 10) {
        searchHandler();
      }
    }
  };

  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue({ [codeInput]: defaultValue });
      searchHandler();
    }
  }, [defaultValue]);

  return (
    <Col {...formColSpan}>
      <Form.Item>
        <Row align="bottom" justify="end">
          <Form.Item name={idInput} hidden={true}>
            <Input disabled={true} />
          </Form.Item>
          <Col span={hideBtn ? 24 : 18}>
            {activeMode ? (
              <AppFormItem rules={Rules} label={label} name={codeInput}>
                <Input
                  disabled={disabled ? true : false}
                  onChange={changeInputHandler}
                />
              </AppFormItem>
            ) : (
              <AppFormItem rules={Rules} label={label} name={nameInput}>
                <Input disabled={true} />
              </AppFormItem>
            )}
          </Col>

          {!hideBtn && (
            <Col span={6}>
              <Form.Item>
                <AppButton
                  block
                  size="large"
                  disabled={disabledBtn}
                  onClick={btnClickHandler}
                  loading={loading}
                >
                  {activeMode ? "جستجو" : "تغییر"}
                </AppButton>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form.Item>
    </Col>
  );
}
