import ThirdPartyInsList from "./ThirdPartyInsList";
import ThirdPartyInsView from "./ThirdPartyInsView";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import ThirdPartyInsAdd from "./ThirdPartyInsAdd";
import ThirdPartyInsEdit from "./ThirdPartyInsEdit";

const route = () => {
  return [
    <Route
      exact
      component={ThirdPartyInsAdd}
      path={pageNames.personnel.insurance.thirdPartyIns.add}
    />,
    <Route
      exact
      component={ThirdPartyInsList}
      path={pageNames.personnel.insurance.thirdPartyIns.list}
    />,
    <Route
      exact
      path={pageNames.personnel.insurance.thirdPartyIns.edit}
      component={ThirdPartyInsEdit}
    />,
    <Route
      exact
      path={pageNames.personnel.insurance.thirdPartyIns.view}
      component={ThirdPartyInsView}
    />,
  ];
};

export default {
  route,
};
