import React from "react";
import AppBadge from "../components/general/AppBadge";

export default {
  title: "components/general/AppBadge",
  component: AppBadge,
};

const Template = (args) => <AppBadge {...args} />;

export const SimpleBadge = Template.bind({});
SimpleBadge.args = {
  count: 1,
  className: "mr-2",
};
