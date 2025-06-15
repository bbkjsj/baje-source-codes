import { Route } from "react-router-dom";
import React from "react";

import SuggestionForm from "./SuggestionForm";
import SuggestionList from "./SuggestionList";
import SuggestionDetails from "./SuggestionDetails";
import SuggestionReject from "./SuggestionReject";
import { pageNames } from "constant";

const routes = () => {
  return [
    <Route
      component={SuggestionForm}
      path={pageNames.suggest.suggestion.add}
    />,
    <Route
      component={SuggestionForm}
      path={pageNames.suggest.suggestion.edit}
    />,
    <Route
      component={SuggestionList}
      path={pageNames.suggest.suggestion.list}
    />,
    <Route
      component={SuggestionList}
      path={pageNames.suggest.suggestion.publicList}
    />,
    <Route
      component={SuggestionDetails}
      path={pageNames.suggest.suggestion.view}
    />,
    <Route
      component={SuggestionReject}
      path={pageNames.suggest.suggestion.reject}
    />,
  ];
};

export default {
  routes,
};
