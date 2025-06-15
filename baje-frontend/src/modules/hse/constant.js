import { range } from "lodash";

export const constant = {
  environment: "environment",
  vehicle: "vehicle",
  inidividual: "individual",
  rate: "rate",
  criticalToPerfect: "critical/perfect",
  nothingToMore: "nothing/more",
  wellOrFault: "well/fault",
  lowToHigh: "low/high",
  measurement: "measurement",
  yesOrNo: "yes/no",
  manual: "manual",
  auto: "auto",
  exclusive: "exclusive",
  public: "public",
  yes: "yes",
  no: "no",
  perfect: "perfect",
  good: "good",
  average: "average",
  bad: "bad",
  critical: "critical",
  high: "high",
  veryHigh: "veryHigh",
  low: "low",
  veryLow: "veryLow",
  nothing: "nothing",
  auditInfo: "auditInfo",
  auditQuestion: "auditQuestion",
};

export const checklistTypes = [
  { text: "عمومی", value: constant.public },
  // { text: "اختصاصی", value: constant.exclusive },
];

export const questionGroups = [
  { text: "اشخاص", value: constant.inidividual },
  { text: "محیط", value: constant.environment },
  { text: "ماشین", value: constant.vehicle },
];

export const questionTypes = [
  { label: "بله یا خیر", value: constant.yesOrNo },
  { label: "نمره دهی", value: constant.rate },
  { label: "بحرانی تا عالی", value: constant.criticalToPerfect },
  { label: "هیچ تا خیلی زیاد", value: constant.nothingToMore },
  { label: "سالم یا معیوب", value: constant.wellOrFault },
  { label: "پایین تا بالا", value: constant.lowToHigh },
  { label: "اندازه گیری", value: constant.measurement },
];

export const endPoints = {
  questions: {
    base: "/api/v1/baje/hse/question",
  },
  jobs: "/api/v1/baje/hse/jobs",
  searchPerson: `api/v1/baje/personnel/list/-1/-1`,
  vehicles: `/api/v1/baje/vehicle/find`,
  newVehicles: "/api/v1/baje/vehicle/advance-search",
  vehicleTypes: `/api/v1/baje/hse/types`,
  checklist: {
    base: "/api/v1/baje/hse/checklist",
  },
  allocate: {
    base: "/api/v1/baje/hse/allocate",
  },
  audit: {
    base: "/api/v1/baje/hse/audit",
    exclusiveQuestion: "/api/v1/baje/hse/audit/questions",
  },
};

export const criticalValues = (isReverse) => ({
  "yes/no": [
    { label: "بله", value: isReverse ? "0" : "4" },
    { label: "خیر", value: isReverse ? "4" : "0" },
  ],
  "well/fault": [
    { label: "سالم", value: "4" },
    { label: "معیوب", value: "0" },
  ],
  "critical/perfect": [
    {
      label: "عالی",
      value: "4",
    },
    {
      label: "خوب",
      value: "3",
    },
    {
      label: "متوسط",
      value: "2",
    },
    {
      label: "ضعیف",
      value: "1",
    },
    {
      label: "بحرانی",
      value: "0",
    },
  ],
  "low/high": [
    {
      label: "بالا",
      value: isReverse ? "0" : "4",
    },
    {
      label: "نسبتا بالا",
      value: isReverse ? "1" : "3",
    },
    {
      label: "متوسط",
      value: "2",
    },
    {
      label: "نسبتا پایین",
      value: isReverse ? "3" : "1",
    },
    {
      label: "پایین",
      value: isReverse ? "4" : "0",
    },
  ],
  "nothing/more": [
    {
      label: "خیلی زیاد",
      value: isReverse ? "0" : "4",
    },
    {
      label: "زیاد",
      value: isReverse ? "1" : "3",
    },
    {
      label: "متوسط",
      value: "2",
    },
    {
      label: "کم",
      value: isReverse ? "3" : "1",
    },
    {
      label: "هیچ",
      value: isReverse ? "4" : "0",
    },
  ],
  rate: [
    {
      label: "4",
      value: "4",
    },
    {
      label: "3",
      value: "3",
    },
    {
      label: "2",
      value: "2",
    },
    {
      label: "1",
      value: "1",
    },
    {
      label: "0",
      value: "0",
    },
  ],
});

export const weightFactor = range(1, 4).map((item) => ({
  label: "" + item,
  value: item,
}));
