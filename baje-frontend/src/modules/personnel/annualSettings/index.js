import List from "./List";
import View from "./View";

import { Route } from "react-router-dom";
import React from "react";
import { pageNames } from "constant";
import AnnualSettingAdd from "./AnnualSettingAdd";
import AnnualSettingEdit from "./AnnualSettingEdit";

const route = () => {
  return [
    <Route
      component={AnnualSettingAdd}
      path={pageNames.personnel.annualSetting.add}
    />,
    <Route component={List} path={pageNames.personnel.annualSetting.list} />,
    <Route
      component={AnnualSettingEdit}
      path={pageNames.personnel.annualSetting.edit}
    />,
    <Route path={pageNames.personnel.annualSetting.view} component={View} />,
  ];
};

export default {
  route,
};
