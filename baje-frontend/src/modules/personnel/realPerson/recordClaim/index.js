import RecordClaimAdd from "./RecordClaimAdd";
import RecordClaimList from "./RecordClaimList";
import RecordClaimEdit from "./RecordClaimEdit";
import RecordClaimDetail from "./RecordClaimDetail";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={RecordClaimAdd}
      path={pageNames.personnel.realPerson.recordClaim.add}
    />,
    <Route
      exact
      component={RecordClaimList}
      path={pageNames.personnel.realPerson.recordClaim.list}
    />,
    <Route
      component={RecordClaimEdit}
      path={pageNames.personnel.realPerson.recordClaim.edit}
    />,
    <Route
      component={RecordClaimDetail}
      path={pageNames.personnel.realPerson.recordClaim.view}
    />,
  ];
};

export default {
  route,
};
