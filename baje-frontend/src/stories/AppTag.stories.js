import React from "react";
import AppTag from "../components/general/AppTag";

export default {
  title: "components/general/AppTag",
  component: AppTag,
};

const Template = (args) => <AppTag {...args}>test</AppTag>;

export const SimpleAppTag = Template.bind({});
SimpleAppTag.args = {
  color: "red",
};
