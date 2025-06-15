import { Col, Form } from "antd";
import React from "react";
import AppInput from "components/general/AppInput";
import AppButton from "components/general/AppButton";
import { countOfNumInp, numberNormalize } from "_helpers";

const Code = ({ onResend }) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <>
      <Form.Item
        name="code"
        label="کد تایید"
        rules={rules}
        labelCol={{ span: 24 }}
        colon={false}
        normalize={(v, prevV) => countOfNumInp(v, prevV, 6)}
      >
        <AppInput
          mask="111111"
          name="code"
          className="text-center ltr code-input"
          dir="ltr"
          placeholder="_ _ _ _ _ _"
          autoFocus={true}
          inputmode="numeric"
        />
      </Form.Item>
    </>
  );
};

const Username = (props) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item
      name="username"
      label="نام کاربری"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
      normalize={numberNormalize}
    >
      <AppInput
        inputmode="numeric"
        pattern="[0-9]*"
        onChange={props.onChange}
      />
    </Form.Item>
  );
};

const Password = React.forwardRef((props, ref) => {
  const rules = [
    {
      required: true,
    },
  ];

  return (
    <Form.Item
      name="password"
      label="کلمه عبور"
      rules={rules}
      labelCol={{ span: 24 }}
      colon={false}
    >
      <AppInput type="password" ref={ref} />
    </Form.Item>
  );
});

export { Code, Username, Password };
