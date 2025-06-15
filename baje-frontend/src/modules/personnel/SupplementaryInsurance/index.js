import SupplementaryInsuranceAdd from "./SupplementaryInsuranceAdd";
import SupplementaryInsuranceList from "./SupplementaryInsuranceList";
import SupplementaryInsuranceEdit from "./SupplementaryInsuranceEdit";
import SupplementaryInsuranceDetail from "./SupplementaryInsuranceDetail";
import SupplementaryInsuranceGeneralInfo from "./SupplementaryInsuranceGeneralInfo";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={SupplementaryInsuranceGeneralInfo}
      path={pageNames.personnel.insurance.supplymentary.generalInfo}
    />,
    <Route
      component={SupplementaryInsuranceAdd}
      path={pageNames.personnel.insurance.supplymentary.add}
    />,
    <Route
      exact
      component={SupplementaryInsuranceList}
      path={pageNames.personnel.insurance.supplymentary.list}
    />,
    <Route
      component={SupplementaryInsuranceEdit}
      path={pageNames.personnel.insurance.supplymentary.edit}
    />,
    <Route
      component={SupplementaryInsuranceDetail}
      path={pageNames.personnel.insurance.supplymentary.view}
    />,
  ];
};

export default {
  route,
};
