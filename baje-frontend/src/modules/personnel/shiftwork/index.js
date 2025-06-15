import { Route } from "react-router-dom";
import React from "react";
import ShiftForm from "./ShiftForm";
import ShiftList from "./ShiftList";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      exact
      component={ShiftForm}
      path={pageNames.personnel.shiftWork.add}
    />,
    <Route
      exact
      component={ShiftForm}
      path={pageNames.personnel.shiftWork.edit}
    />,
    <Route
      exact
      component={ShiftList}
      path={pageNames.personnel.shiftWork.list}
    />,
  ];
};

export default {
  route,
};
