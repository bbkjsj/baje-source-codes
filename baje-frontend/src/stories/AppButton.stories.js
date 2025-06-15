import React from "react";
import AppButton from "../components/general/AppButton";

export default {
  title: "components/general/AppButton",
  component: AppButton,
};

const Template = (args) => <AppButton {...args}>test</AppButton>;

export const PrimaryButton = Template.bind({});
PrimaryButton.args = {
  variant: "primary",
};

export const GrayButton = Template.bind({});
GrayButton.args = {
  variant: "gray",
};

export const AltPrimaryButton = Template.bind({});
AltPrimaryButton.args = {
  variant: "alt-primary",
};

export const SuccessButton = Template.bind({});
SuccessButton.args = {
  variant: "success",
};

export const DangerButton = Template.bind({});
DangerButton.args = {
  variant: "danger",
};

export const InfoButton = Template.bind({});
InfoButton.args = {
  variant: "info",
};

export const LoadingButton = Template.bind({});
LoadingButton.args = { variant: "", loading: true };

export const DisabledButton = Template.bind({});
DisabledButton.args = { variant: "", disabled: true };

export const ResetButton = Template.bind({});
ResetButton.args = { variant: "", htmlType: "reset" };

export const SubmitButton = Template.bind({});
SubmitButton.args = { variant: "", htmlType: "submit" };
