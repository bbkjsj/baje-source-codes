import React from "react";
import TodayDate from "../components/general/TodayDate";

export default {
  title: "components/general/TodayDate",
  component: TodayDate,
};

const Template = (args) => <TodayDate {...args} />;

export const SimpleTodayDate = Template.bind({});
SimpleTodayDate.args = {};
