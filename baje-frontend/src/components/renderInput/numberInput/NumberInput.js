import React from "react";
import { Input } from "antd";
import FormItem from "../formItem/FormItem";
const NumberInput = (props) => {
  return (
    <>
      <FormItem {...props}>
        <Input
          type="number"
          onChange={props.onChange ? props.onChange : undefined}
          disabled={props.disable && props.disable}
        />
      </FormItem>
    </>
  );
};

export default NumberInput;
