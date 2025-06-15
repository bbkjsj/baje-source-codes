import ExaminationAdd from "./ExaminationAdd";
import PersonList from "./PersonList";
import ExaminationList from "./ExaminationList";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={ExaminationAdd}
      path={pageNames.personnel.realPerson.examination.add}
    />,
    <Route
      component={PersonList}
      path={pageNames.personnel.realPerson.examination.personList}
    />,
    <Route
      component={ExaminationList}
      path={pageNames.personnel.realPerson.examination.list}
    />,
  ];
};

export default {
  route,
};
