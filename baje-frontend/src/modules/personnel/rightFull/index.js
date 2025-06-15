//use older implementation until refactor
import AddRightFull from "pages/persons/addRightFull/AddRightfull";
import RightFullList from "pages/persons/addRightFull/list/RightFullList";
import RightFullView from "pages/persons/addRightFull/view/RightFullView";
import EditRightFull from "pages/persons/addRightFull/edit/EditRightFull";
import AddGroupRightFull from "pages/persons/addRightFull/addGroup/AddGroupRightFull";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route component={AddRightFull} path={pageNames.personnel.rightFull.add} />,
    <Route
      component={EditRightFull}
      path={pageNames.personnel.rightFull.edit}
    />,
    <Route
      component={RightFullView}
      path={pageNames.personnel.rightFull.view}
    />,
    <Route
      component={RightFullList}
      path={pageNames.personnel.rightFull.list}
    />,
    <Route
      component={AddGroupRightFull}
      path={pageNames.personnel.rightFull.addGroup}
    />,
  ];
};

export default {
  route,
};
