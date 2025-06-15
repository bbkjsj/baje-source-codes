import React from "react";
import AppCard from "../components/general/AppCard";

export default {
  title: "components/general/AppCard",
  component: AppCard,
};

const Template = (args) => (
  <AppCard {...args}>
    <p>some content...</p>
    <p>some content...</p>
  </AppCard>
);

export const SimpleAppCard = Template.bind({});
export const LoadingAppCard = Template.bind({});
LoadingAppCard.args = {
  loading: true,
};

export const TitledAppCard = Template.bind({});
TitledAppCard.args = {
  title: "main title",
};

export const ExtraTitledAppCard = Template.bind({});
ExtraTitledAppCard.args = {
  title: "main title",
  extra: <a href="#">More</a>,
};

export const SmallAppCard = Template.bind({});
SmallAppCard.args = {
  title: "main title",
  size: "small",
};

export const BorderedAppCard = Template.bind({});
BorderedAppCard.args = {
  title: "main title",
  bordered: true,
};
