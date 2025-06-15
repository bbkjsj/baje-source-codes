import React from "react";
import AppPopConfirm from "../components/general/AppPopConfirm";
import { Button } from "antd";

export default {
  title: "components/general/AppPopConfirm",
  component: AppPopConfirm,
};

const Template = (args) => (
  <div
    style={{
      width: "300px",
      height: "300px",
      textAlign: "center",
      paddingTop: "100px",
    }}
  >
    <AppPopConfirm {...args}>
      <Button>click</Button>
    </AppPopConfirm>
  </div>
);

export const SimpleAppPopConfirm = Template.bind({});
SimpleAppPopConfirm.args = {
  placement: "topLeft",
  title: " test",
};
