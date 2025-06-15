export const constant = {
  killTask: "kill",
  delayed: "delayed",
  independent: "independent",
  frequentTask: "frequentTask",
  conditionalTask: "conditionalTask",
  chained: "chained",
  isNull: "is null",
  personnel: "personnel",
  job: "job",
  new: "new",
  inprogress: "inprogress",
  done: "done",
  mytasks: "mytasks",
  toapprove: "toapprove",
  redirected: "redirected",
  notdone: "notdone",
  notMyDuty: "notmyduty",
  toinfo: "toinfo",
  low: "low",
  normal: "normal",
  high: "high",
  none: "none",
  declineContract: "decline_contract",
  cashPenalty: "cash_penalty",
  suspension: "suspension",
  disciplinaryCommittee: "disciplinary_committee",
  negativePoint: "negative_point",
  weekly: "weekly",
  daily: "daily",
  monthly: "monthly",
  yearly: "yearly",
  onStart: "onstart",
  on25percent: "on25percent",
  on50percent: "on50percent",
  on75percent: "on75percent",
  on90percent: "on90percent",
  bySupervisor: "by_supervisor",
  specificJob: "specific_job",
  superAdmin: "super_admin",
  byReferal: "by_referral",
  specificPerson: "specific_person",
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  linear: "linear",
  parallel: "parallel",
  gregorian: "gregorina",
  solar: "solar",
  lunar: "lunar",
  firstName: "firstName",
  lastName: "lastName",
  nationNumber: "nationNumber",
  auto: "auto",
  manual: "manual",
};

export const endPoint = {
  tableName: {
    base: "/api/v1/baje/table-name",
    dbTableName: "/api/v1/baje/table-name/db/tables",
    columns: {
      base: "/api/v1/baje/table-name/column/table",
      column: "/api/v1/baje/table-name/column",
      dbColumns: "/api/v1/baje/table-name/db",
    },
  },
  taskCondition: {
    base: "/api/v1/baje/tasks/condition",
  },
  personnel: "api/v1/baje/personnel/list/-1/-1",
  jobs: "/api/v1/baje/jobs",
  tasks: {
    openTask: "/api/v1/baje/tasks/open",
    base: "/api/v1/baje/tasks",
    taskApprove: "/api/v1/baje/tasks/approve",
    cartboards: "/api/v1/baje/tasks/kartabl",
    detail: "/api/v1/baje/tasks/detail",
    notMyDuty: "/api/v1/baje/tasks/not-my-duty",
    unreadCount: "/api/v1/baje/tasks/counters",
    saveRead: "/api/v1/baje/tasks/read-task",
    forward: (id) => "/api/v1/baje/tasks/" + id + "/forward",
  },
};

export const operators = [
  { value: ">", label: "کوچکتر از" },
  { value: "=", label: "برابر باشد با" },
  { value: "<", label: "بزرگتر از" },
  { value: "is null", label: "خالی باشد" },
  // { value: "isNotValid" },
];

export const logicalOperators = { and: "and", or: "or" };

export const columnTypes = {
  integer: "int(11)",
  varchar200: "varchar(200)",
  varchar45: "varchar(45)",
  text: "text",
  date: "datetime",
};

export const ifTaskFailed = [
  { value: constant.killTask, label: "مرگ وظیفه" },
  { value: constant.delayed, label: "ثبت تاخیر" },
];

export const taskCreateType = [
  { value: constant.conditionalTask, label: "وضعیت یک سلول" },
  { value: constant.frequentTask, label: "وظیفه مکرر" },
];

export const taskType = [
  { value: constant.independent, label: "مستقل" },
  { value: constant.chained, label: "سیستمی" },
];

export const cartBoardStatus = [
  {
    label: "در حال انجام",
    value: constant.inprogress,
  },
  {
    label: "انجام شده",
    value: constant.done,
  },
  {
    label: "وظایف",
    value: constant.mytasks,
  },
  {
    label: "جهت اطلاع",
    value: constant.toinfo,
  },
  {
    label: "انجام نشده",
    value: constant.notdone,
  },
  {
    label: "ارجاع شده",
    value: constant.redirected,
  },
  {
    label: "بررسی انجام",
    value: constant.toapprove,
  },
];

export const taskStatus = [
  {
    label: "جدید",
    value: constant.new,
  },
  {
    label: "انجام شده",
    value: constant.done,
  },
  {
    label: "تمام نشده",
    value: constant.inprogress,
  },
];

export const taskPriority = [
  {
    label: "کم",
    value: constant.low,
  },
  {
    label: "متوسط",
    value: constant.normal,
  },
  {
    label: "زیاد",
    value: constant.high,
  },
];

export const taskPunishment = [
  {
    label: "بدون تنبیه",
    value: constant.none,
  },
  {
    label: "لغو قرارداد",
    value: constant.declineContract,
  },
  {
    label: "تعلیق تردد",
    value: constant.suspension,
  },
  {
    label: "جریمه نقدی",
    value: constant.cashPenalty,
  },
  {
    label: "کمیته انظباطی",
    value: constant.disciplinaryCommittee,
  },
  {
    label: "نمره منفی",
    value: constant.negativePoint,
  },
];

export const scheduleTypes = [
  {
    label: "روزانه",
    value: constant.daily,
  },
  {
    label: "هفتگی",
    value: constant.weekly,
  },
  {
    label: "ماهانه",
    value: constant.monthly,
  },
  {
    label: "سالانه",
    value: constant.yearly,
  },
];

export const taskSMSNotirfication = [
  { value: constant.onStart, label: "موقع ساخت وظیفه" },
  {
    value: constant.on25percent,
    label: "پس از گذشت 25 درصد از زمان شروع وظیفه",
  },
  {
    value: constant.on50percent,
    label: "پس از گذشت 50 درصد از زمان شروع وظیفه",
  },
  {
    value: constant.on75percent,
    label: "پس از گذشت 75 درصد از زمان شروع وظیفه",
  },
  {
    value: constant.on90percent,
    label: "پس از گذشت 90 درصد از زمان شروع وظیفه",
  },
];

export const taskDoneCondition = [
  { value: constant.none, label: "بدون نیاز به تایید" },
  { value: constant.specificJob, label: "توسط شغل مشخص" },
  { value: constant.superAdmin, label: "توسط سوپرادمین ها" },
  { value: constant.byReferal, label: "توسط ارجاع دهنده" },
  { value: constant.specificPerson, label: "توسط شخص خاص" },
  { value: constant.bySupervisor, label: "توسط سوپروایزر", disabled: true },
];

export const taskApproveSequence = [
  { value: constant.linear, label: "خطی" },
  { value: constant.parallel, label: "موازی" },
];

export const weekDays = [
  { value: constant.saturday, label: "شنبه" },
  { value: constant.sunday, label: "یک شنبه" },
  { value: constant.monday, label: "دو شنبه" },
  { value: constant.tuesday, label: "سه شنبه" },
  { value: constant.wednesday, label: "چهار شنبه" },
  { value: constant.thursday, label: "پنج شنبه" },
  { value: constant.friday, label: "جمعه" },
];

export const jalaaliMonths = [
  { value: 1, label: "فروردین" },
  { value: 2, label: "اردیبهشت" },
  { value: 3, label: "خرداد" },
  { value: 4, label: "تیر" },
  { value: 5, label: "مرداد" },
  { value: 6, label: "شهریور" },
  { value: 7, label: "مهر" },
  { value: 8, label: "آباد" },
  { value: 9, label: "آذر" },
  { value: 10, label: "دی" },
  { value: 11, label: "بهمن" },
  { value: 12, label: "اسفند" },
];
