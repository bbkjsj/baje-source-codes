import { Route } from "react-router-dom";
import React from "react";
import PersonAdd from "./PersonAdd";
import PersonList from "./PersonList";
import PersonHistory from "./PersonHistory";
import PrintIntroLetter from "./PrintIntroLetter";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={PersonAdd}
      path={pageNames.personnel.insurance.accident.personnel.add}
    />,
    <Route
      exact
      component={PersonList}
      path={pageNames.personnel.insurance.accident.personnel.list}
    />,
    <Route
      exact
      component={PersonHistory}
      path={pageNames.personnel.insurance.accident.personnel.history}
    />,
    <Route
      exact
      component={PrintIntroLetter}
      path={pageNames.personnel.insurance.accident.personnel.printIntro}
    />,
  ];
};

export default {
  route,
};
