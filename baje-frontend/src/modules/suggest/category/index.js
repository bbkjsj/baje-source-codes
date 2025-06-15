import { Route } from "react-router-dom";
import React from "react";

import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route component={CategoryForm} path={pageNames.suggest.category.add} />,
    <Route component={CategoryForm} path={pageNames.suggest.category.edit} />,
    <Route
      component={CategoryList}
      path={pageNames.suggest.category.list}
      exact={true}
    />,
  ];
};

export default {
  routes,
};
