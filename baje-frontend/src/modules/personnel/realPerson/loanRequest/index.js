import LoanRequestList from "./LoanRequestList";
import ViewLoanRequest from "./ViewLoanRequest";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import LoanRequestAdd from "./LoanRequestAdd";
import LoanRequestEdit from "./LoanRequestEdit";

const route = () => {
  return [
    <Route
      component={LoanRequestAdd}
      path={pageNames.personnel.realPerson.loanRequest.add}
    />,
    <Route
      component={LoanRequestList}
      path={pageNames.personnel.realPerson.loanRequest.list}
    />,
    <Route
      path={pageNames.personnel.realPerson.loanRequest.edit}
      component={LoanRequestEdit}
    />,
    <Route
      path={pageNames.personnel.realPerson.loanRequest.view}
      component={ViewLoanRequest}
    />,
  ];
};

export default {
  route,
};
