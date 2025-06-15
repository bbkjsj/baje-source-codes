import React from "react";
import peymanManagement from "./peymanManagement";
import projectProgress from "./projectProgress";
import productionReport from "./productionReport";
import chartReports from "./chartReports";

const route = () => {
  return (
    <>
      {[
        ...projectProgress.route(),
        ...chartReports.route(),
        ...peymanManagement.route(),
        ...productionReport.route(),
      ]}
    </>
  );
};
export default {
  route,
};
