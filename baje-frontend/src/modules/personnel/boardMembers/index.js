import BoardMemberForm from "./BoardMemberForm";
import BoardMemberList from "./BoardMembersList";
import BoardMemberDetails from "./BoardMemberDetails";

import { Route } from "react-router-dom";
import React from "react";
import routes from "../routes";

const {
  PERSONNEL_BOARD_MEMBERS_ADD,
  PERSONNEL_BOARD_MEMBERS_LIST,
  PERSONNEL_BOARD_MEMBERS_VIEW,
  PERSONNEL_BOARD_MEMBERS_EDIT,
} = routes;

const route = () => {
  return [
    <Route
      exact
      component={BoardMemberForm}
      path={PERSONNEL_BOARD_MEMBERS_ADD}
    />,
    <Route
      exact
      component={BoardMemberList}
      path={PERSONNEL_BOARD_MEMBERS_LIST}
    />,
    <Route
      exact
      component={BoardMemberDetails}
      path={PERSONNEL_BOARD_MEMBERS_VIEW}
    />,
    <Route exact path={PERSONNEL_BOARD_MEMBERS_EDIT}>
      <BoardMemberForm updating />
    </Route>,
  ];
};

export default {
  route,
};
