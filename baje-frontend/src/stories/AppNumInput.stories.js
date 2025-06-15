import React from "react";
import AppNumInput from "../components/general/AppNumInput";

export default {
  title: "components/general/AppNumInput",
  component: AppNumInput,
};

const Template = (args) => <AppNumInput {...args} />;

export const SimpleNumberInput = Template.bind({});
SimpleNumberInput.args = {
  min: 1,
  max: 10,
  defaultValue: 2,
};
