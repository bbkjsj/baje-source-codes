import { Route } from "react-router-dom";
import React from "react";

import ProblemReportForm from "./ProblemReportForm";
import ProblemReportList from "./ProblemReportList";
import ProblemReportDetails from "./ProblemReportDetails";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={ProblemReportForm}
      path={pageNames.suggest.problem.add}
    />,
    <Route
      component={ProblemReportList}
      path={pageNames.suggest.problem.list}
    />,
    <Route path={pageNames.suggest.problem.edit}>
      <ProblemReportForm update />
    </Route>,
    <Route
      component={ProblemReportDetails}
      path={pageNames.suggest.problem.view}
    />,
  ];
};

export default {
  routes,
};
