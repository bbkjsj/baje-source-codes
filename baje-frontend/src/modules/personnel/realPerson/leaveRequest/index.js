import LeaveRequestList from "./LeaveRequestList";
import LeaveRequestView from "./LeaveRequestView";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import LeaveRequestAdd from "./LeaveRequestAdd";
import LeaveRequestEdit from "./LeaveRequestEdit";

const route = () => {
  return [
    <Route
      exact
      component={LeaveRequestAdd}
      path={pageNames.personnel.realPerson.leaveRequest.add}
    />,
    <Route
      exact
      component={LeaveRequestList}
      path={pageNames.personnel.realPerson.leaveRequest.list}
    />,
    <Route
      exact
      path={pageNames.personnel.realPerson.leaveRequest.edit}
      component={LeaveRequestEdit}
    />,
    <Route
      exact
      component={LeaveRequestView}
      path={pageNames.personnel.realPerson.leaveRequest.view}
    />,
  ];
};

export default {
  route,
};
