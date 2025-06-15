export const systemStatus = {
  not_approved: "بدون تایید",
  user_approaved: "تایید کاربر",
  manager_approved: "تایید مدیرپروژه",
};

export const sections = {
  progress: "progress",
  production: "production",
  peyman: "peyman",
  charts: "charts",
};

export const allowedContractsTypes = {
  progress: "progress",
  production: "production",
  peyman: "peyman",
};

export const reportTypes = {
  daily_production: "daily_production",
  periodic_production: "periodic_production",
  periodic_project_progress: "periodic_project_progress",
  daily_machines_activity: "daily_machines_activity",
  daily_machines_activity_average: "daily_machines_activity_average",
  periodic_machines_activity: "periodic_machines_activity",
  periodic_ready_to_work_factor: "periodic_ready_to_work_factor",
};

// the word "periodic" should exist in periodic types!!
export const ReportTypesAndLabels = [
  {
    label: "تولید روزانه",
    value: reportTypes.daily_production,
  },
  {
    label: "تولید دوره ای ",
    value: reportTypes.periodic_production,
  },
  {
    label: "پیشرفت پروژه",
    value: reportTypes.periodic_project_progress,
  },
  {
    label: "ماشین آلات فعال/غیرفعال روزانه",
    value: reportTypes.daily_machines_activity,
  },
  {
    label: "میانگین ماشین آلات فعال/غیرفعال روزانه",
    value: reportTypes.daily_machines_activity_average,
  },
  {
    label: "ماشین آلات فعال/غیرفعال دوره ای",
    value: reportTypes.periodic_machines_activity,
  },
  {
    label: "ضریب آماده به کاری دوره ای ",
    value: reportTypes.periodic_ready_to_work_factor,
  },
];

export const periodicReportTypes = Object.values(reportTypes).filter((val) =>
  val.includes("periodic")
);

export const CHART_COLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

export const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];
