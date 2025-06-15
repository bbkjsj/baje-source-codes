import React from "react";
import ShadowAvatar from "../components/general/ShadowAvatar";

export default {
  title: "components/general/ShadowAvatar",
  component: ShadowAvatar,
};

const Template = (args) => <ShadowAvatar {...args} />;

export const SimpleShadowAvatar = Template.bind({});
ShadowAvatar.args = {};
