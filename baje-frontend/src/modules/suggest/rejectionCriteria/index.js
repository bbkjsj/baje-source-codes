import { Route } from "react-router-dom";
import React from "react";

import RejectionCriteriaForm from "./RejectionCriteriaForm";
import RejectionCriteriaList from "./RejectionCriteriaList";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={RejectionCriteriaForm}
      path={pageNames.suggest.rejectionCriteria.add}
    />,
    <Route
      component={RejectionCriteriaForm}
      path={pageNames.suggest.rejectionCriteria.edit}
    />,
    <Route
      component={RejectionCriteriaList}
      path={pageNames.suggest.rejectionCriteria.list}
    />,
  ];
};

export default {
  routes,
};
