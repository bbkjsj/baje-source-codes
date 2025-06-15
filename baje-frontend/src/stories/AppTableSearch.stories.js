import React from "react";
import AppTableSearch from "../components/general/AppTableSearch";

export default {
  title: "components/general/AppTableSearch",
  component: AppTableSearch,
};

const Template = (args) => <AppTableSearch {...args} />;

export const SimpleAppTableSearch = Template.bind({});
SimpleAppTableSearch.args = {
  onSearch: () => {
    console.log("onSeerch");
  },
  onReset: () => {
    console.log("onReset");
  },
};
