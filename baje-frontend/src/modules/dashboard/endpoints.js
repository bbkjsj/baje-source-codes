const endpoints = {
  chartReports: {
    getReportContracts: "/api/admin/contract/report/dashboard/access",
    getChartData: (url) => "/api/admin" + url,
  },
  peymanManagement: {
    getPeymanReportList: (id) => `/api/admin/contract/peyman-report/${id}`,
    updatePeyman: "/api/admin/contract/peyman/report", //put
    getSinglePeymanReport: (id) => `/api/admin/contract/peyman/detail/${id}`,
  },
  productionReport: {
    getProductionReportList: (id) =>
      `/api/admin/contract/production-report/${id}`,
    updateProduction: "/api/admin/contract/production/report", //put
    getSingleProductionReport: (id) =>
      `/api/admin/contract/production/detail/${id}`,
  },
  projectProgress: {
    getProgress: (id) => `/api/admin/contract/progress/${id}`,
    putProgress: "/api/admin/contract/progress",
  },
  misc: {
    getContracts: "/api/admin/personnel/legal/list/contracts",
  },
};

export default endpoints;
