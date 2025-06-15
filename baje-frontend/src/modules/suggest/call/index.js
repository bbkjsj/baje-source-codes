import { Route } from "react-router-dom";
import React from "react";

import CallForm from "./CallForm";
import CallList from "./CallList";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route component={CallForm} path={pageNames.suggest.call.add} />,
    <Route component={CallForm} path={pageNames.suggest.call.edit} />,
    <Route component={CallList} path={pageNames.suggest.call.list} />,
  ];
};

export default {
  routes,
};
