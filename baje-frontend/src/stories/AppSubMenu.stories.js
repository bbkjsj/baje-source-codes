import React from "react";
import AppSubMenu from "../components/general/AppSubMenu";
import { Menu } from "antd";

export default {
  title: "components/general/AppSubMenu",
  component: AppSubMenu,
};

const Template = (args) => (
  <Menu>
    <AppSubMenu {...args}>
      <Menu.ItemGroup title="group-1">
        <Menu.Item key="1">item1</Menu.Item>
        <Menu.Item key="2">item2</Menu.Item>
      </Menu.ItemGroup>
    </AppSubMenu>
  </Menu>
);

export const SimpleAppSubMenu = Template.bind({});
SimpleAppSubMenu.args = { hidden: false, key: "test", title: "sub1-hover" };
