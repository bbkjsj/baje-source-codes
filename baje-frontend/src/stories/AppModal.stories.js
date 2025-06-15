import React from "react";
import AppModal from "../components/general/AppModal";

export default {
  title: "components/general/AppModal",
  component: AppModal,
};

const Template = (args) => <AppModal {...args} />;

export const SimpleModal = Template.bind({});
SimpleModal.args = {
  visible: true,
};

export const NonClosableModal = Template.bind({});
NonClosableModal.args = {
  visible: true,
  closable: false,
};

export const TitledModal = Template.bind({});
TitledModal.args = {
  visible: true,
  title: "Basic Modal",
};
