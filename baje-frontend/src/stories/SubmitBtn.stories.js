import React from "react";
import SubmitBtn from "../components/general/SubmitBtn";

export default {
  title: "components/general/SubmitBtn",
  component: SubmitBtn,
};

const Template = (args) => <SubmitBtn {...args} />;

export const SimpleSubmitBtn = Template.bind({});
SimpleSubmitBtn.args = {};
