import { Route } from "react-router-dom";
import React from "react";

import ReportIndex from "./ReportIndex";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route component={ReportIndex} path={pageNames.suggest.reportIndex} />,
  ];
};

export default {
  routes,
};
