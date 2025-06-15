import React from "react";
import ListActions from "../components/general/ListActions";

export default {
  title: "components/general/ListActions",
  component: ListActions,
};

const Template = (args) => <ListActions {...args} />;

export const SimpleListActions = Template.bind({});
SimpleListActions.args = {
  actions: {
    excelExport: () => {},
    print: () => {},
  },
};
