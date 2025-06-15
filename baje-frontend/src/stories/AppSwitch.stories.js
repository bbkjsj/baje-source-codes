import React from "react";
import AppSwitch from "../components/general/AppSwitch";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

export default {
  title: "components/general/AppSwitch",
  component: AppSwitch,
};

const Template = (args) => <AppSwitch {...args} />;

export const SimpleAppSwitch = Template.bind({});
SimpleAppSwitch.args = {
  defaultChecked: false,
};

export const IconicSwitch = Template.bind({});
IconicSwitch.args = {
  defaultChecked: false,
  checkedChildren: <CheckOutlined />,
  unCheckedChildren: <CloseOutlined />,
};
