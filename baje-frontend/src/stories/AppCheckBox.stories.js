import React from "react";
import AppCheckBox from "../components/general/AppCheckBox";

export default {
  title: "components/general/AppCheckBox",
  component: AppCheckBox,
};

const Template = (args) => <AppCheckBox {...args}>name</AppCheckBox>;

export const SimpleAppCheckBox = Template.bind({});

export const DisabledAppCheckBox = Template.bind({});
DisabledAppCheckBox.args = {
  disabled: true,
};
