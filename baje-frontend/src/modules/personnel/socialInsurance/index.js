import { Route } from "react-router-dom";
import React from "react";
import SocialInsuranceAdd from "./SocialInsuranceAdd";
import SocialInsuranceList from "./SocialInsuranceList";
import SocialInsurancePrint from "./SocialInsurancePrint";
import PrintDisketList from "./prints/PrintDisketList";
import SocialInsurancePersonnelReport from "./SocialInsurancePersonnelReport";
import SocialInsurancePersonnelReportPrint from "./SocialInsurancePersonnelReportPrint";
import { pageNames } from "constant";

const route = () => {
  return [
    <Route
      component={SocialInsuranceAdd}
      path={pageNames.personnel.insurance.tamin.add}
    />,
    <Route
      exact
      component={SocialInsuranceList}
      path={pageNames.personnel.insurance.tamin.list}
    />,

    <Route
      component={SocialInsurancePrint}
      path={pageNames.personnel.insurance.tamin.print}
    />,
    <Route
      component={PrintDisketList}
      path={pageNames.personnel.insurance.tamin.printDisket}
    />,
    <Route
      component={SocialInsurancePersonnelReport}
      path={pageNames.personnel.insurance.tamin.personnelReport}
    />,
    <Route
      component={SocialInsurancePersonnelReportPrint}
      path={pageNames.personnel.insurance.tamin.personnelReportPrint}
    />,
  ];
};

export default {
  route,
};
