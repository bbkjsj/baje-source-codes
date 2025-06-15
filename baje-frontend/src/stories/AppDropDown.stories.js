import React from "react";
import AppDropdown from "../components/general/AppDropdown";

export default {
  title: "components/general/AppDropdown",
  component: AppDropdown,
};

const Template = (args) => (
  <AppDropdown {...args}>
    <span>hover me</span>
  </AppDropdown>
);

export const SimpleAppDropdown = Template.bind({});
SimpleAppDropdown.args = {
  overlay: <p>some data</p>,
};
