import React from "react";
import AppRadioGroup from "../components/general/AppRadioGroup";

export default {
  title: "components/general/AppRadioGroup",
  component: AppRadioGroup,
};

const Template = (args) => <AppRadioGroup {...args} />;

export const SimpleAppRadioGroup = Template.bind({});
SimpleAppRadioGroup.args = {
  options: [
    {
      label: "blue",
      value: 1,
    },
    {
      label: "green",
      value: 2,
    },
  ],
};
