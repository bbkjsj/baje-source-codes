import ServiceAdd from "./ServiceAdd";
import ServiceList from "./ServiceList";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={ServiceAdd}
      path={pageNames.personnel.realPerson.service.add}
    />,
    <Route
      component={ServiceList}
      path={pageNames.personnel.realPerson.service.list}
    />,
  ];
};

export default {
  route,
};
