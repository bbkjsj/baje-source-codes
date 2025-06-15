import React from "react";
import AppMenuItem from "../components/general/AppMenuItem";
import { Menu } from "antd";

export default {
  title: "components/general/AppMenuItem",
  component: AppMenuItem,
};

const Template = (args) => (
  <Menu>
    <AppMenuItem {...args}>
      <span>item1</span>
    </AppMenuItem>
  </Menu>
);

export const SimpleAppMenuItem = Template.bind({});

export const HiddenAppMenuItem = Template.bind({});
HiddenAppMenuItem.args = {
  hidden: true,
};
export const DangerAppMenuItem = Template.bind({});
DangerAppMenuItem.args = {
  danger: true,
};
export const DisabledAppMenuItem = Template.bind({});
DisabledAppMenuItem.args = {
  disabled: true,
};
