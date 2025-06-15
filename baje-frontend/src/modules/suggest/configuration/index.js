import { Route } from "react-router-dom";
import React from "react";

import ConfigurationForm from "./ConfigurationForm";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={ConfigurationForm}
      path={pageNames.suggest.configuration}
    />,
  ];
};

export default {
  routes,
};
