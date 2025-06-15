import { Route } from "react-router-dom";
import React from "react";

import EvaluationForm from "./EvaluationForm";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={EvaluationForm}
      path={pageNames.suggest.evaluationApply}
    />,
  ];
};

export default {
  routes,
};
