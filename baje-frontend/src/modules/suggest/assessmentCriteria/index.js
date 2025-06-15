import { Route } from "react-router-dom";
import React from "react";

import AssessmentCriteriaList from "./AssessmentCriteriaList";
import AssessmentCriteriaForm from "./AssessmentCriteriaForm";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={AssessmentCriteriaForm}
      path={pageNames.suggest.assessmentCriteria.add}
    />,
    <Route
      component={AssessmentCriteriaForm}
      path={pageNames.suggest.assessmentCriteria.edit}
    />,
    <Route
      component={AssessmentCriteriaList}
      path={pageNames.suggest.assessmentCriteria.list}
    />,
  ];
};

export default {
  routes,
};
