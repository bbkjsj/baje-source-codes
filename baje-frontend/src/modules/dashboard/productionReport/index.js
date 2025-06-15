import { pageNames } from "constant";
import React from "react";
import { Route } from "react-router-dom";
import List from "./List";
import ProductionForm from "./ProductionForm";

function route() {
  return [
    <Route
      component={List}
      path={pageNames.dashboard.productionReport.list}
    ></Route>,
    <Route
      component={ProductionForm}
      path={pageNames.dashboard.productionReport.edit}
    ></Route>,
    <Route
      component={ProductionForm}
      path={pageNames.dashboard.productionReport.view}
    ></Route>,
    <Route
      component={ProductionForm}
      path={pageNames.dashboard.productionReport.add}
    ></Route>,
  ];
}

export default {
  route,
};
