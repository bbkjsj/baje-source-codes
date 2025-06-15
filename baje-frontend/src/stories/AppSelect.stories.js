import React from "react";
import AppSelect from "../components/general/AppSelect";

export default {
  title: "components/general/AppSelect",
  component: AppSelect,
};

const Template = (args) => <AppSelect {...args} />;

export const SimpleAppSelect = Template.bind({});
SimpleAppSelect.args = {
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
  defaultValue: 2,
};
