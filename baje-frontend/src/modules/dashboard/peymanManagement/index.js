import { pageNames } from "constant";
import React from "react";
import { Route } from "react-router-dom";
import List from "./List";
import peymanManagement from "./PeymanForm";

function route() {
  return [
    <Route
      component={List}
      path={pageNames.dashboard.peymanManagement.list}
    ></Route>,
    <Route
      component={peymanManagement}
      path={pageNames.dashboard.peymanManagement.edit}
    ></Route>,
    <Route
      component={peymanManagement}
      path={pageNames.dashboard.peymanManagement.view}
    ></Route>,
    <Route
      component={peymanManagement}
      path={pageNames.dashboard.peymanManagement.add}
    ></Route>,
  ];
}

export default {
  route,
};
