import React from "react";
import AppInput from "../components/general/AppInput";

export default {
  title: "components/general/AppInput",
  component: AppInput,
};

const Template = (args) => <AppInput {...args} />;

export const SimpleInput = Template.bind({});
SimpleInput.args = {
  placeholder: "نام خود را وارد کنید",
  label: "نام",
};

export const RequiredInput = Template.bind({});
RequiredInput.args = {
  placeholder: "نام خود را وارد کنید",
  label: "نام",
  required: true,
};
