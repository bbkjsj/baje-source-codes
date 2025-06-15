import React from "react";
import InsuranceBtn from "../components/general/InsuranceBtn";

export default {
  title: "components/general/InsuranceBtn",
  component: InsuranceBtn,
};

const Template = (args) => <InsuranceBtn {...args} />;

export const SimpleInsuranceBtn = Template.bind({});
SimpleInsuranceBtn.args = {};
