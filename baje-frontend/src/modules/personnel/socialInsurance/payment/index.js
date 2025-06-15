import { Route } from "react-router-dom";
import React from "react";
import PaymentList from "./PaymentList";
import PaymentEdit from "./PaymentEdit";
import PaymentDetail from "./PaymentDetail";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={PaymentList}
      path={pageNames.personnel.insurance.tamin.payment.list}
      exact
    />,
    <Route
      component={PaymentEdit}
      path={pageNames.personnel.insurance.tamin.payment.edit}
      exact
    />,
    <Route
      component={PaymentDetail}
      path={pageNames.personnel.insurance.tamin.payment.view}
      exact
    />,
  ];
};

export default {
  route,
};
