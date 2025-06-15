import { Route } from "react-router-dom";
import React from "react";

import AccidentReportAdd from "./AccidentReportAdd";
import AccidentReportList from "./AccidentReportList";
import AccidentReportEdit from "./AccidentReportEdit";
import AccidentReportDetail from "./AccidentReportDetail";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={AccidentReportAdd}
      path={pageNames.personnel.realPerson.add}
    />,
    <Route
      component={AccidentReportList}
      path={pageNames.personnel.realPerson.accidentReport.list}
    />,
    <Route
      component={AccidentReportEdit}
      path={pageNames.personnel.realPerson.edit}
    />,
    <Route
      component={AccidentReportDetail}
      path={pageNames.personnel.realPerson.accidentReport.view}
    />,
  ];
};

export default {
  route,
};
