import { Route } from "react-router-dom";
import React from "react";
import DeductionsAdd from "./DeductionsAdd";
import DeductionsList from "./DeductionsList";
import DeductionsEdit from "./DeductionsEdit";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={DeductionsAdd}
      path={pageNames.personnel.insurance.supplymentary.personnel.deucation.add}
    />,
    <Route
      component={DeductionsList}
      path={
        pageNames.personnel.insurance.supplymentary.personnel.deucation.list
      }
    />,
    <Route
      component={DeductionsEdit}
      path={
        pageNames.personnel.insurance.supplymentary.personnel.deucation.edit
      }
    />,
  ];
};

export default {
  route,
};
