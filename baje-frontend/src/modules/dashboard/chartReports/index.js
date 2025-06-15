import { pageNames } from "constant";
import React from "react";
import { Route } from "react-router-dom";
import View from "./View";

function route() {
  return [
    <Route component={View} path={pageNames.dashboard.chartReports}></Route>,
  ];
}

export default {
  route,
};
