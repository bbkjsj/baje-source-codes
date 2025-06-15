import CheckoutList from "./CheckoutList";
import CheckoutDetails from "./CheckoutDetails";
import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import CheckoutAdd from "./CheckoutAdd";
import CheckoutEdit from "./CheckoutAdd";

const route = () => {
  return [
    <Route
      exact
      component={CheckoutAdd}
      path={pageNames.personnel.realPerson.checkout.add}
    />,
    <Route
      exact
      component={CheckoutList}
      path={pageNames.personnel.realPerson.checkout.list}
    />,
    <Route
      exact
      component={CheckoutDetails}
      path={[pageNames.personnel.realPerson.checkout.view]}
    />,
    <Route
      exact
      path={pageNames.personnel.realPerson.edit}
      component={CheckoutEdit}
    />,
  ];
};

export default {
  route,
};
