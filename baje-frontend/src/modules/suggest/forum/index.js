import { Route } from "react-router-dom";
import React from "react";

import ForumIndex from "./ForumIndex";
import { pageNames } from "constant";

const routes = () => {
  return [<Route component={ForumIndex} path={pageNames.suggest.forumIndex} />];
};

export default {
  routes,
};
