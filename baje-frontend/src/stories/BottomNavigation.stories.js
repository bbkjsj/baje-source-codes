import React from "react";
import BottomNavigation from "../components/general/BottomNavigation";
import { CheckOutlined } from "@ant-design/icons";

export default {
  title: "components/general/BottomNavigation",
  component: BottomNavigation,
};

const Template = (args) => <BottomNavigation {...args} />;

export const SimpleBottomNavigation = Template.bind({});
SimpleBottomNavigation.args = {
  items: [
    { title: "item1", onClick: () => {}, icon: <CheckOutlined /> },
    { title: "item2", onClick: () => {}, icon: <CheckOutlined /> },
  ],
};
