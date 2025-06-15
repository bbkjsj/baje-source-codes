import React from "react";
import ExcelBtn from "../components/general/ExcelBtn";

export default {
  title: "components/general/ExcelBtn",
  component: ExcelBtn,
};

const Template = (args) => <ExcelBtn {...args} />;

export const SimpleExcelBtn = Template.bind({});
SimpleExcelBtn.args = {};
