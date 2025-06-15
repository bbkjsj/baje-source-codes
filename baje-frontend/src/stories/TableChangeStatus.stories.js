import React from "react";
import TableChangeStatus from "../components/general/TableChangeStatus";

export default {
  title: "components/general/TableChangeStatus",
  component: TableChangeStatus,
};

const Template = (args) => <TableChangeStatus {...args} />;

export const SimpleTableChangeStatus = Template.bind({});
SimpleTableChangeStatus.args = {
  disabled: false,

  options: [
    {
      label: "ok",
      value: 1,
    },
    {
      label: "cancel",
      value: 0,
    },
  ],
};
