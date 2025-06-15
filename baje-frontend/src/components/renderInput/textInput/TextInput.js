import React from "react";
import { Input } from "antd";
import FormItem from "../formItem/FormItem";
const TextInput = (props) => {
  return (
    <>
      <FormItem {...props}>
        <Input
          disabled={props.disabled ? true : false}
          onBlur={props.onBlur ? props.onBlur : null}
          {...props.inputAttr}
        />
      </FormItem>
    </>
  );
};

export default TextInput;
