import MissionList from "./MissionList";
import MissionView from "./MissionView";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import MissionAdd from "./MissionAdd";
import MissionEdit from "./MissionEdit";

const route = () => {
  return [
    <Route
      exact
      component={MissionAdd}
      path={pageNames.personnel.realPerson.mission.add}
    />,
    <Route
      exact
      component={MissionList}
      path={pageNames.personnel.realPerson.mission.list}
    />,
    <Route
      exact
      path={pageNames.personnel.realPerson.mission.edit}
      component={MissionEdit}
    />,
    <Route
      exact
      path={pageNames.personnel.realPerson.mission.view}
      component={MissionView}
    />,
  ];
};

export default {
  route,
};
