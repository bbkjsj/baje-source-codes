import { Route } from "react-router-dom";
import React from "react";
import TestCalendar from "./TestCalendar";
import JobList from "./JobList";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      exact
      path={pageNames.personnel.jobs.calender}
      component={TestCalendar}
    />,
    <Route exact path={pageNames.personnel.jobs.list} component={JobList} />,
  ];
};

export default {
  route,
};
