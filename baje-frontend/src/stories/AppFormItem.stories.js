import React from "react";
import AppFormItem from "../components/general/AppFormItem";
import { Input, Form } from "antd";

export default {
  title: "components/general/AppFormItem",
  component: AppFormItem,
};

const Template = (args) => (
  <Form name="test">
    <AppFormItem {...args}>
      <Input />
    </AppFormItem>
  </Form>
);

export const SimpleFormItem = Template.bind({});
SimpleFormItem.args = {
  name: "first ",
  label: "نام ",
  tooltip: " نام ",
  rules: null,
  required: false,
};
