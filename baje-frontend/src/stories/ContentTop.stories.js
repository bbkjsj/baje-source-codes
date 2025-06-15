import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ContentTop from "../components/general/ContentTop";

export default {
  title: "components/general/ContentTop",
  component: ContentTop,
};

const Template = (args) => (
  <Router>
    <ContentTop {...args} />
  </Router>
);

export const SimpleContentTop = Template.bind({});
SimpleContentTop.args = {
  breadcrumbItems: [
    { text: "item1", link: "/" },
    { text: "item2", link: "/" },
  ],
  title: "main title",
};
