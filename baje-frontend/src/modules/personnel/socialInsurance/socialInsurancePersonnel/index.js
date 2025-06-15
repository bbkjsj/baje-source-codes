import List from "./List";
import Add from "./Add";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={Add}
      path={pageNames.personnel.insurance.tamin.personnel.add}
    />,
    <Route
      exact
      component={List}
      path={pageNames.personnel.insurance.tamin.personnel.list}
    />,
  ];
};
export default {
  route,
};
