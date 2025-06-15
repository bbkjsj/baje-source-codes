import React from "react";
import { Form, Col, Button, Input } from "antd";
import PasteIcon from "../../assets/icons/paste-icon.jpg";
import { formColSpan } from "constant";

/**
 *
 * @param {Object} props - component's props
 * @param {Object} props.form - current form
 * @param {String} props.field_name -  input field name
 * @param {String} props.label -  input field label
 * @param {Array} props.rules -  input rules
 * @param {Function} props.validator -  input validator should be run after paste too
 * @param {Boolean} props.disabled -  for disable input
 * @returns
 */
export default function AppPasteInput(props) {
  const {
    form,
    field_name,
    label,
    rules,
    validator,
    disabled,
    ...rest
  } = props;

  const onPaste = () => {
    navigator.clipboard
      .readText()
      .then((res) => {
        if (typeof res === "string") {
          form.setFieldsValue({ [field_name]: res });
          validator(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Col {...formColSpan}>
      <div className="flex  align-end " style={{ position: "relative" }}>
        <Form.Item
          style={{ width: "80%" }}
          label={label}
          name={field_name}
          rules={rules}
          {...rest}
        >
          <Input disabled={disabled} />
        </Form.Item>
        <Button
          size="large"
          style={{
            width: "20%",
            position: "absolute",
            top: "40px",
            left: 0,
          }}
          onClick={onPaste}
        >
          <img width="20px" height="20px" src={PasteIcon} />
        </Button>
      </div>
    </Col>
  );
}
