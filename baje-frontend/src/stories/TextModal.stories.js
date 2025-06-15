import React from "react";
import TextModal from "../components/general/TextModal";

export default {
  title: "components/general/TextModal",
  component: TextModal,
};

const Template = (args) => <TextModal {...args} />;

export const SimpleTextModal = Template.bind({});
SimpleTextModal.args = { status: true, title: "عنوان" };
