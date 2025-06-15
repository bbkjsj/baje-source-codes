import React from "react";
import LoadingLogo from "../components/general/LoadingLogo";

export default {
  title: "components/general/LoadingLogo",
  component: LoadingLogo,
};

const Template = (args) => <LoadingLogo {...args} />;

export const SimpleLoadingLogo = Template.bind({});
SimpleLoadingLogo.args = {};
