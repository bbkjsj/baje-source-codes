import React from "react";
import committee from "./committee";
import assessmentCriteria from "./assessmentCriteria";
import rejectionCriteria from "./rejectionCriteria";
import category from "./category";
import call from "./call";
import configuration from "./configuration";
import suggestion from "./suggestion";
import evaluation from "./evaluation";
import problemReport from "./problemReport";
import forum from "./forum";
import report from "./report";

const ModuleContext = React.createContext(null);

const routes = () => {
  return (
    <ModuleContext.Provider value={"daniel"}>
      {[
        ...committee.routes(),
        ...assessmentCriteria.routes(),
        ...rejectionCriteria.routes(),
        ...category.routes(),
        ...call.routes(),
        ...configuration.routes(),
        ...evaluation.routes(),
        ...forum.routes(),
        ...report.routes(),
        ...suggestion.routes(),
        ...problemReport.routes(),
      ]}
    </ModuleContext.Provider>
  );
};

export default {
  routes,
  ModuleContext,
};
