import AccidentInsuranceAdd from "./AccidentInsuranceAdd";
import AccidentInsuranceList from "./AccidentInsuranceList";
import AccidentInsuranceEdit from "./AccidentInsuranceEdit";
import AccidentInsuranceDetail from "./AccidentInsuranceDetail";
import AccidentInsuranceGeneralInfo from "./AccidentInsuranceGeneralInfo";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={AccidentInsuranceGeneralInfo}
      path={pageNames.personnel.insurance.accident.generalInfo}
    />,
    <Route
      component={AccidentInsuranceAdd}
      path={pageNames.personnel.insurance.accident.add}
    />,
    <Route
      exact
      component={AccidentInsuranceList}
      path={pageNames.personnel.insurance.accident.list}
    />,
    <Route
      component={AccidentInsuranceEdit}
      path={pageNames.personnel.insurance.accident.edit}
    />,
    <Route
      component={AccidentInsuranceDetail}
      path={pageNames.personnel.insurance.accident.view}
    />,
  ];
};

export default {
  route,
};
