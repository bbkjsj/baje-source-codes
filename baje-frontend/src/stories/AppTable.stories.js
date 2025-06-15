import React from "react";
import AppTable from "../components/general/AppTable";

export default {
  title: "components/general/AppTable",
  component: AppTable,
};

const Template = (args) => <AppTable {...args} />;

export const BasicTable1 = Template.bind({});
BasicTable1.args = {
  dataSource: [
    {
      key: 1,
      name: "test",
      age: 10,
    },
    {
      key: 2,
      name: "test2",
      age: 15,
    },
  ],
  columns: [
    { title: "radif", dataIndex: "index", key: "index" },
    { title: "nam", dataIndex: "name", key: "name" },
  ],
};
