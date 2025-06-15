import Form from "./chartsForm";
import List from "./chartsList";
import View from "./chartsView";

import { Route } from "react-router-dom";
import React from "react";

import { pageNames } from "constant";

const route = () => {
  return [
    <Route exact component={Form} path={pageNames.personnel.orgCharts.add} />,
    <Route exact component={List} path={pageNames.personnel.orgCharts.list} />,
    <Route exact path={pageNames.personnel.orgCharts.edit}>
      <Form updating />
    </Route>,
    <Route exact path={pageNames.personnel.orgCharts.view} component={View} />,
  ];
};

export default {
  route,
};
