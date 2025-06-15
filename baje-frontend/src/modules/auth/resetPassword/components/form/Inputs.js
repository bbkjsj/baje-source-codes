import React from "react";
import { Form, Input } from "antd";
import Styles from "../../auth.module.css";
import { mobile_numberNormalize, countOfNumInp } from "_helpers";

const rules = {
  phone: [
    { required: true, message: "فیلد شماره تماس اجباری است" },
    { len: 11, message: "فرمت شماره تماس اشتباه است" },
  ],
  code: [{ required: true, message: "کد تایید را وراد نمایید" }],
};

const Inputs = (props) => {
  return (
    <>
      <Form.Item
        normalize={mobile_numberNormalize}
        validateFirst={true}
        name="phone"
        rules={rules.phone}
      >
        <Input
          placeholder="شماره تماس"
          className={Styles.loginInput}
          disabled={props.inputStatus === 2}
        />
      </Form.Item>

      {props.inputStatus === 2 && (
        <Form.Item
          name="code"
          rules={rules.code}
          normalize={(value, prevValue) => countOfNumInp(value, prevValue, 5)}
        >
          <Input placeholder="کد تایید" className={`${Styles.loginInput}`} />
        </Form.Item>
      )}
    </>
  );
};

export default Inputs;
