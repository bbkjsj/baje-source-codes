import { pageNames } from "constant";
import React from "react";
import { Route } from "react-router-dom";
import List from "./List";

function route() {
  return [
    <Route component={List} path={pageNames.dashboard.projectProgress}></Route>,
  ];
}

export default {
  route,
};
