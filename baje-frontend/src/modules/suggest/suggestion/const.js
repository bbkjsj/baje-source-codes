import getSecretariatForwardFields from "./suggestionList/forwardSecretariatFields";
import getExecutorForwardFields from "./suggestionList/forwardExecuterFields";

export const participationType = {
  SINGLE: "انفرادی",
  GROUP: "گروهی",
};

export const suggestionType = {
  QUALITATIVE: "کیفی",
  QUANTITATIVE: "کمی",
  SPECIAL: "ویژه",
};

export const dealType = {
  REGULATION: "آیین نامه جهاد نصر",
  SELL: "فروش پیشنهاد",
  PARTNERSHIP: "شراکت در منافع",
};

export const forwardTypeValues = {
  TO_STARTER: "to_starter",
  TO_SECRETARIAT_MEMBER: "to_secretariat_member",
  TO_SECRETARIAT: "to_secretariat_head",
  TO_COMMITTEE: "to_committee",
  TO_COMMITTEE_MEMBER: "to_committee_member",
  TO_EXCELLENT_COMMITTEE: "to_excellent_committee",
  TO_EXCELLENT_MEMBER: "to_excellent_member",
  TO_EXECUTOR_INITIAL: "to_executor_initial",
  TO_EXECUTOR: "to_executor",
  TO_CEO: "to_ceo",
  TO_PENDING: "to_pending",
  TO_REJECT: "to_reject",
};

export const statusChangeTypes = {
  FORWARD: "forward",
  BACKWARD: "backward",
};

export const statusTypes = {
  STARTER_REVIEW: "در انتظار بررسی توسط پیشنهاد دهنده",
  STARTER_REVIEW_REQUEST: "درخواست تجدید نظر توسط پیشنهاد دهنده",
  STARTER_REVISION_REQUEST: "درخواست بررسی اصلاحات پیشنهاد دهنده",
  SECRETARIAT_HEAD_REVIEW: "ارزیابی دبیر دبیرخانه",
  SECRETARIAT_MEMBER_REVIEW: "ارزیابی عضو دبیرخانه",
  SECRETARIAT_REJECTION: "رد شده توسط دبیرخانه",
  SECRETARIAT_CHANGE_WORKGROUP: "در انتظار تغییر کارگروه تخصصی",
  COMMITTEE_HEAD_REVIEW: "ارزیابی دبیر کارگروه تخصصی",
  COMMITTEE_HEAD_REJECTION: "رد شده توسط دبیر کارگروه تخصصی",
  COMMITTEE_HEAD_TIMELINE_REVIEW: "در انتظار تایید برنامه زمانبندی",
  COMMITTEE_MEMBER_REVIEW: "ارزیابی اعضای کارگروه تخصصی",
  COMMITTEE_MEMBER_ACCEPTION: "در انتظار تایید نهایی کارگروه تخصصی",
  COMMITTEE_MEMBER_REJECTION: "در انتظار رد نهایی کارگروه تخصصی",
  COMMITTEE_REJECTION: "رد شده توسط کارگروه تخصصی",
  EXCELLENT_COMMITTEE_MEMBER_REVIEW: "ارزیابی اعضای کارگروه عالی",
  EXCELLENT_COMMITTEE_REJECTION: "رد شده توسط کارگروه عالی",
  CEO_REVIEW: "ارزیابی مدیرعامل",
  EXECUTOR_INITIAL_REVIEW: "ارزیابی اولیه مجری",
  EXECUTOR_INFORM: "ابلاغ به مجری",
  EXECUTOR_TIMELINE_CORRECTION: "در انتظار اصلاح برنامه زمانبندی",
  EXECUTOR_REJECTION: "رد اجرا توسط مجری", //changed from "رد اولیه توسط مجری"
  PENDING: "تعویق عملیات اجرایی",
  FINAL_REJECTION: "رد نهایی",
};

export const detailsPageActions = {
  EXCELLENT_COMMITTEE_VOTE: "excellent_committee_vote",
  CEO_TO_EXECUTOR_SIGNIFY: "ceo_to_executor_signify",
  SET_AS_PENDING: "set_as_pending",
};

export const cartableFilters = {
  ALL: "all",
  TO_APPROVE: "toapprove",
  EVALUATING: "evaluating",
  IN_MODIFICATION: "toedit",
  REJECTED: "rejects",
  APPROVED: "approves",
  HAS_PROBLEM: "problem",
  IN_EXECUTION: "inprogress",
  TO_SIGNIFY: "toassign",
  ASSIGNED: "assigned",
  PENDING: "pending", //new
};

export const suggestAccessTypes = {
  SURVEY_MANAGER: "SURVEY_MANAGER",
  SECRETARIAT_HEAD: "SECRETARIAT_HEAD",
  SECRETARIAT_MEMBER: "SECRETARIAT_MEMBER",
  WORKGROUP_HEAD: "WORKGROUP_HEAD",
  WORKGROUP_MEMBER: "WORKGROUP_MEMBER",
  EXCELLENT_HEAD: "EXCELLENT_HEAD",
  EXCELLENT_MEMBER: "EXCELLENT_MEMBER",
  EXECUTOR: "EXECUTOR",
  HOLDING_CEO: "HOLDING_CEO",
  STARTER: "STARTER",
};

export const accessToCartable = {
  [cartableFilters.ALL]: [suggestAccessTypes.SURVEY_MANAGER],
  [cartableFilters.TO_APPROVE]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.WORKGROUP_HEAD,
    suggestAccessTypes.EXCELLENT_HEAD,
    suggestAccessTypes.EXCELLENT_MEMBER,
    suggestAccessTypes.EXECUTOR,
  ],
  [cartableFilters.TO_SIGNIFY]: [suggestAccessTypes.HOLDING_CEO],
  [cartableFilters.EVALUATING]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.WORKGROUP_HEAD,
    suggestAccessTypes.WORKGROUP_MEMBER,
  ],
  [cartableFilters.IN_MODIFICATION]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.WORKGROUP_HEAD,
  ],
  [cartableFilters.IN_EXECUTION]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.EXECUTOR,
    suggestAccessTypes.HOLDING_CEO,
  ],
  [cartableFilters.APPROVED]: [
    suggestAccessTypes.EXCELLENT_MEMBER,
    suggestAccessTypes.EXCELLENT_HEAD,
  ],
  [cartableFilters.REJECTED]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.WORKGROUP_HEAD,
    suggestAccessTypes.EXCELLENT_HEAD,
    suggestAccessTypes.EXCELLENT_MEMBER,
  ],
  [cartableFilters.HAS_PROBLEM]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.EXECUTOR,
    suggestAccessTypes.HOLDING_CEO,
  ],
  [cartableFilters.ASSIGNED]: [suggestAccessTypes.HOLDING_CEO],
  [cartableFilters.PENDING]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
    suggestAccessTypes.HOLDING_CEO,
    suggestAccessTypes.EXECUTOR,
  ],
};

export const cartableToStatus = {
  [cartableFilters.TO_APPROVE]: [
    statusTypes.SECRETARIAT_HEAD_REVIEW,
    statusTypes.SECRETARIAT_MEMBER_REVIEW,
    statusTypes.STARTER_REVIEW_REQUEST,
    statusTypes.COMMITTEE_HEAD_REVIEW,
    statusTypes.COMMITTEE_MEMBER_ACCEPTION,
    statusTypes.COMMITTEE_MEMBER_REJECTION,
    statusTypes.EXCELLENT_COMMITTEE_MEMBER_REVIEW,
    statusTypes.EXECUTOR_INITIAL_REVIEW,
    statusTypes.STARTER_REVISION_REQUEST,
    statusTypes.COMMITTEE_HEAD_TIMELINE_REVIEW,
    statusTypes.SECRETARIAT_CHANGE_WORKGROUP,
  ],
  [cartableFilters.EVALUATING]: [
    statusTypes.SECRETARIAT_MEMBER_REVIEW,
    statusTypes.COMMITTEE_MEMBER_REVIEW,
    // statusTypes.CEO_REVIEW,
  ],
  [cartableFilters.IN_MODIFICATION]: [
    statusTypes.STARTER_REVIEW,
    statusTypes.EXECUTOR_TIMELINE_CORRECTION,
  ],
  [cartableFilters.REJECTED]: [
    statusTypes.SECRETARIAT_REJECTION,
    statusTypes.COMMITTEE_REJECTION,
    statusTypes.EXCELLENT_COMMITTEE_REJECTION,
    statusTypes.EXECUTOR_REJECTION,
    statusTypes.FINAL_REJECTION,
    statusTypes.COMMITTEE_HEAD_REJECTION,
  ],
  [cartableFilters.PENDING]: [statusTypes.PENDING],
  [cartableFilters.TO_SIGNIFY]: [statusTypes.CEO_REVIEW],
  [cartableFilters.IN_EXECUTION]: [statusTypes.EXECUTOR_INFORM],
  [cartableFilters.HAS_PROBLEM]: ["ثبت گزارش مشکل توسط مجری"],
};

export const forwardTypes = [
  {
    title: "اصلاح توسط پیشنهاد دهنده",
    value: forwardTypeValues.TO_STARTER,
    personnel: null,
  },
  {
    title: "بررسی توسط عضو دبیرخانه",
    value: forwardTypeValues.TO_SECRETARIAT_MEMBER,
    personnel: [],
    personnelRequired: true,
  },
  {
    title: "بررسی در کارگروه تخصصی",
    value: forwardTypeValues.TO_COMMITTEE,
    fieldTitle: "انتخاب کارگروه",
    personnel: null,
    custom: [],
    customRequired: true,
  },
  {
    title: "بررسی توسط اعضای کارگروه",
    value: forwardTypeValues.TO_COMMITTEE_MEMBER,
    personnel: [],
    multiplePersonnel: true,
    personnelRequired: true,
  },
  {
    title: "برگشت به دبیرخانه",
    value: forwardTypeValues.TO_SECRETARIAT,
    personnel: null,
    fields: getSecretariatForwardFields,
  },
  {
    title: "انتخاب مجری",
    value: forwardTypeValues.TO_EXECUTOR_INITIAL,
    personnel: true,
    companies: true,
    fields: getExecutorForwardFields,
  },
  {
    title: "بررسی در کارگروه عالی",
    value: forwardTypeValues.TO_EXCELLENT_COMMITTEE,
    personnel: null,
  },
  {
    title: "برگشت به مدیرعامل",
    value: forwardTypeValues.TO_CEO,
    personnel: null,
  },
];

export const forwardTypesMap = {
  [statusTypes.SECRETARIAT_HEAD_REVIEW]: [
    //forwardTypeValues.TO_SECRETARIAT_MEMBER,
    forwardTypeValues.TO_COMMITTEE,
  ],
  [statusTypes.STARTER_REVIEW_REQUEST]: [
    //forwardTypeValues.TO_SECRETARIAT_MEMBER,
    forwardTypeValues.TO_COMMITTEE,
  ],
  [statusTypes.SECRETARIAT_MEMBER_REVIEW]: [forwardTypeValues.TO_COMMITTEE],
  [statusTypes.SECRETARIAT_CHANGE_WORKGROUP]: [
    forwardTypeValues.TO_COMMITTEE,
    //forwardTypeValues.TO_SECRETARIAT_MEMBER,
  ],
  [statusTypes.COMMITTEE_HEAD_REVIEW]: [
    forwardTypeValues.TO_STARTER,
    forwardTypeValues.TO_SECRETARIAT,
    forwardTypeValues.TO_COMMITTEE_MEMBER,
  ],
  [statusTypes.STARTER_REVISION_REQUEST]: [
    forwardTypeValues.TO_STARTER,
    forwardTypeValues.TO_SECRETARIAT,
    forwardTypeValues.TO_COMMITTEE_MEMBER,
  ],
  [statusTypes.COMMITTEE_MEMBER_ACCEPTION]: [
    forwardTypeValues.TO_EXECUTOR_INITIAL,
  ],
  [statusTypes.COMMITTEE_HEAD_TIMELINE_REVIEW]: [
    forwardTypeValues.TO_EXCELLENT_COMMITTEE,
  ],
  [statusTypes.EXECUTOR_REJECTION]: [forwardTypeValues.TO_EXECUTOR_INITIAL],
  [statusTypes.EXECUTOR_INFORM]: [],
};

export const forwardTypesPermissions = {
  [forwardTypeValues.TO_STARTER]: [suggestAccessTypes.WORKGROUP_HEAD],
  [forwardTypeValues.TO_SECRETARIAT_MEMBER]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
  ],
  [forwardTypeValues.TO_SECRETARIAT]: [suggestAccessTypes.WORKGROUP_HEAD],
  [forwardTypeValues.TO_COMMITTEE_MEMBER]: [suggestAccessTypes.WORKGROUP_HEAD],
  [forwardTypeValues.TO_COMMITTEE]: [
    suggestAccessTypes.SECRETARIAT_HEAD,
    suggestAccessTypes.SECRETARIAT_MEMBER,
  ],
  [forwardTypeValues.TO_EXCELLENT_COMMITTEE]: [
    suggestAccessTypes.WORKGROUP_HEAD,
  ],
  [forwardTypeValues.TO_EXCELLENT_MEMBER]: [],
  [forwardTypeValues.TO_EXECUTOR_INITIAL]: [suggestAccessTypes.WORKGROUP_HEAD],
};

export const keyMap = (incoming = false) => {
  return {
    participation_type: "participate_type",
    group_title: incoming ? "participate_group_name" : "group_name",

    is_for_call: incoming ? "survey_call" : "is_survey_call",
    related_call: incoming
      ? "survey_workgroup_call_id_fk"
      : "workgroup_call_id",
    suggestion_type: "type",
    category: incoming ? "survey_category_id_fk" : "category_id",
    custom_category: "category_title",
    the_problem: "problem_description",
    the_idea: "suggestion",
    requirements: "requirement",
    is_in_process: "is_exist",
    want_partnership: "participate_in_execution",
    deal_type: "participate_exe_type",
    suggestion_price: "idea_price",
    partnership_percent: "participate_exe_percent",
    partnership_period: "participate_exe_year",
    workgroup: incoming ? "workgroup_id_fk" : "workgroup_id",
    participants: {
      percentage: incoming ? "participation_percent" : "percent",
      national_id: "national_number",
    },
  };
};
