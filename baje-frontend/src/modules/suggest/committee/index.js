import { Route } from "react-router-dom";
import React from "react";

import CommitteeList from "./CommitteeList";
import CommitteeMemberForm from "./CommitteeMemberForm";
import CommitteeMemberList from "./CommitteeMemberList";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={CommitteeList}
      path={pageNames.suggest.commitee.add}
      exact={true}
    />,
    <Route
      component={CommitteeList}
      path={pageNames.suggest.commitee.list}
      exact={true}
    />,
    <Route
      component={CommitteeMemberList}
      path={pageNames.suggest.commitee.member.list}
    />,
    <Route
      component={CommitteeMemberForm}
      path={pageNames.suggest.commitee.member.add}
    />,
    <Route
      component={CommitteeMemberForm}
      path={pageNames.suggest.commitee.member.edit}
    />,
  ];
};

export default {
  routes,
};
