import DoctorAdd from "./DoctorAdd";
import DoctorEdit from "./DoctorEdit";
import DoctorList from "./DoctorList";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route component={DoctorAdd} path={pageNames.personnel.doctor.add} />,
    <Route component={DoctorEdit} path={pageNames.personnel.doctor.edit} />,
    <Route component={DoctorList} path={pageNames.personnel.doctor.list} />,
  ];
};

export default {
  route,
};
