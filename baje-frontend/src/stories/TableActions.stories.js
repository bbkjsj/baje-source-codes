import React from "react";
import TableActions from "../components/general/TableActions";
import ReduxProvider from "../provider/redux";

export default {
  title: "components/general/TableActions",
  component: TableActions,
};

const Template = (args) => (
  <ReduxProvider>
    <TableActions {...args} />
  </ReduxProvider>
);

export const SimpleTableActions = Template.bind({});
SimpleTableActions.args = {
  list: [{ name: "delete", onClick: () => {} }],
};
