import RealPersonAdd from "./RealPersonAdd";
import RealPersonEdit from "./RealPersonEdit";

//use older implementation until refactor
import RealPersonList from "pages/persons/realPerson/list/RealPersonList";
import RealPersonView from "pages/persons/realPerson/View/RealPersonView";
import AddGroupRealPerson from "pages/persons/realPerson/addGroup/AddGroupRealPerson";
import AssignShift from "pages/persons/realPerson/assignShift/AssignShiftForm";
import ResumeList from "pages/persons/realPerson/resume/ResumeList";
import ResumeView from "pages/persons/realPerson/resume/ResumeView";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={RealPersonAdd}
      path={pageNames.personnel.realPerson.add}
    />,
    <Route
      component={RealPersonEdit}
      path={pageNames.personnel.realPerson.edit}
    />,
    <Route
      component={RealPersonView}
      path={pageNames.personnel.realPerson.view}
    />,
    <Route
      component={RealPersonList}
      path={pageNames.personnel.realPerson.list}
    />,
    <Route
      component={AddGroupRealPerson}
      path={pageNames.personnel.realPerson.addGroup}
    />,
    <Route
      component={AssignShift}
      path={pageNames.personnel.realPerson.assignShift}
    />,
    <Route
      exact
      component={ResumeList}
      path={pageNames.personnel.realPerson.resume.list}
    />,
    <Route
      exact
      component={ResumeView}
      path={pageNames.personnel.realPerson.resume.view}
    />,
  ];
};

export default {
  route,
};
