import React from "react";
import AppTextArea from "../components/general/AppTextArea";

export default {
  title: "components/general/AppTextArea",
  component: AppTextArea,
};

const Template = (args) => <AppTextArea {...args} />;

export const SimpleAppTextArea = Template.bind({});
SimpleAppTextArea.args = {
  rows: 3,
};
