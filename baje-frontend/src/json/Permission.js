const levels = {
  USER: "baje",
  COMPANY: "company",
  CONTRACT: "contract",
  ENVIRONMENT: "environment",
};

const baseLevels = {
  environment: { value: "environment", label: "محیط" },
  baje: { value: "baje", label: "باجه" },
  company: { value: "company", label: "شرکت" },
};

const permission = {
  LIST_PERSON: { permission: "person/list", level: levels.ENVIRONMENT },
  INSERT_PERSON: { permission: "person/insert", level: levels.ENVIRONMENT },
  EDIT_PERSON: { permission: "person/edit", level: levels.ENVIRONMENT },
  DELETE_PERSON: { permission: "person/delete", level: levels.ENVIRONMENT },
  APPROVE_PERSON: { permission: "person/approve", level: levels.ENVIRONMENT },
  PRIVET_DESCRIPTION_PERSON: {
    permission: "person/privatedescription",
    level: levels.ENVIRONMENT,
  },
  EDIT_CONTACT_PERSON: {
    permission: "person/editcontact",
    level: levels.ENVIRONMENT,
  },
  VIEWSUBORDINATE_PERSON: {
    permission: "person/viewsubordinate",
    level: levels.ENVIRONMENT,
  },
  TIMEOFFFOROTHERS: {
    permission: "person/submit-timeoff-forothers",
    level: levels.USER,
  },
  APPROVETIMEOFF: {
    permission: "person/approve-timeoff",
    level: levels.USER,
  },
  LIST_LEGAL: { permission: "legal/list", level: levels.USER },
  INSERT_LEGAL: { permission: "legal/insert", level: levels.USER },
  EDIT_LEGAL: { permission: "legal/edit", level: levels.USER },
  DELETE_LEGAL: { permission: "legal/delete", level: levels.USER },
  APPROVE_LEGAL: { permission: "legal/approve", level: levels.USER },
  EDIT_CONTACT_LEGAL: { permission: "legal/editcontact", level: levels.USER },
  EDIT_CONTACT_MACHINERY: {
    permission: "machinery/editcontact",
    level: levels.USER,
  },
  LIST_MACHINERY: { permission: "machinery/list", level: levels.ENVIRONMENT },
  INSERT_MACHINERY: {
    permission: "machinery/insert",
    level: levels.ENVIRONMENT,
  },
  EDIT_MACHINERY: { permission: "machinery/edit", level: levels.ENVIRONMENT },
  DELETE_MACHINERY: {
    permission: "machinery/delete",
    level: levels.ENVIRONMENT,
  },
  APPROVE_MACHINERY: {
    permission: "machinery/approve",
    level: levels.ENVIRONMENT,
  },
  LIST_CONTRACT: { permission: "contract/list", level: levels.COMPANY },
  INSERT_CONTRACT: { permission: "contract/insert", level: levels.COMPANY },
  EDIT_CONTRACT: { permission: "contract/edit", level: levels.COMPANY },
  DELETE_CONTRACT: { permission: "contract/delete", level: levels.COMPANY },
  APPROVE_CONTRACT: { permission: "contract/approve", level: levels.COMPANY },
  ADD_EDIT_PROGRESS: {
    permission: "contract/progress-add-edit",
    level: levels.USER,
  },
  APPROVE_PROGRESS: {
    permission: "contract/progress-approve",
    level: levels.USER,
  },
  ADD_EDIT_PRODUCTION: {
    permission: "contract/production-report-add-edit",
    level: levels.USER,
  },
  APPROVE_PRODUCTION: {
    permission: "contract/production-report-approve",
    level: levels.USER,
  },
  ADD_EDIT_PEYMAN: {
    permission: "contract/peyman-report-add-edit",
    level: levels.USER,
  },
  APPROVE_PEYMAN: {
    permission: "contract/peyman-report-approve",
    level: levels.USER,
  },
  DASHBOARD_CHART_REPORTS: {
    permission: "contract/dashboard-report",
    level: levels.USER,
  },

  SOCIAL_INSURANCE_MENU: {
    permission: "tamin_insurance/menu",
    level: levels.ENVIRONMENT,
  },

  SOCIAL_INSURANCE_CHANGE_STATUS: {
    permission: "tamin_insurance/list_change_status",
    level: levels.ENVIRONMENT,
  }, // 3
  SOCIAL_INSURANCE_LIST_EXCEL_EXPORT: {
    permission: "tamin_insurance/export_list",
    level: levels.ENVIRONMENT,
  }, // 4
  SOCIAL_INSURANCE_MEMEBERS_EXCEL_EXPORT: {
    permission: "tamin_insurance/export_personnel_list",
    level: levels.ENVIRONMENT,
  },
  SOCIAL_INSURANCE_REPORT: {
    permission: "tamin_insurance/report",
    level: levels.ENVIRONMENT,
  }, // 6
  SOCIAL_INSURANCE_CONTRACTS: {
    permission: "tamin_insurance/view_contract_in_report",
    level: levels.ENVIRONMENT,
  },
  // 7
  SOCIAL_INSURANCE_BENEFITS: {
    permission: "tamin_insurance/view_include_notinclude_in_report",
    level: levels.ENVIRONMENT,
  },
  HSE_SETTINGS: {
    permission: "hse/settings",
    level: levels.USER,
  },
  HSE_VIEW: {
    permission: "hse/view",
    level: levels.ENVIRONMENT,
  },
  HSE_AUDIT: {
    permission: "hse/audit",
    level: levels.ENVIRONMENT,
  },
  HSE_APPROVEAUDIT: {
    permission: "hse/approve",
    level: levels.ENVIRONMENT,
  },
  // third party insurance
  THIRD_PARTY_INSURANCE_VIEW: {
    permission: "third_party_insurance/view",
    level: levels.ENVIRONMENT,
  },
  THIRD_PARTY_INSURANCE_APPROVE: {
    permission: "third_party_insurance/approve",
    level: levels.ENVIRONMENT,
  },
  // environment
  ENVIRONMENT_CREATE: {
    permission: "environment/create",
    level: levels.COMPANY,
  },
  ENVIRONMENT_EDIT: {
    permission: "environment/edit",
    level: levels.COMPANY,
  },
  ENVIRONMENT_LIST: {
    permission: "environment/list",
    level: levels.COMPANY,
  },
  ENVIRONMENT_DELETE: {
    permission: "environment/delete",
    level: levels.COMPANY,
  },

  // environment usage
  ENVIRONMENT_USAGE_CREATE: {
    permission: "environment_usage/create",
    level: levels.USER,
  },
  ENVIRONMENT_USAGE_EDIT: {
    permission: "environment_usage/edit",
    level: levels.USER,
  },
  ENVIRONMENT_USAGE_LIST: {
    permission: "environment_usage/list",
    level: levels.USER,
  },
  ENVIRONMENT_USAGE_DELETE: {
    permission: "environment_usage/delete",
    level: levels.USER,
  },

  // supplementary insurance
  SUPPLEMENTARY_CREATE: {
    permission: "supplementary_insurance/create",
    level: levels.COMPANY,
  },
  SUPPLEMENTARY_EDIT: {
    permission: "supplementary_insurance/update",
    level: levels.COMPANY,
  },
  SUPPLEMENTARY_LIST: {
    permission: "supplementary_insurance/list",
    level: levels.COMPANY,
  },
  SUPPLEMENTARY_DELETE: {
    permission: "supplementary_insurance/delete",
    level: levels.COMPANY,
  },

  // access
  ACCESS_LIST: {
    permission: "access/list",
    level: levels.USER,
  },
};

const PermissionsSectionsFarsiLabels = {
  person: "افراد حقیقی",
  legal: "افراد حقوقی",
  machinery: "ماشین آلات",
  contract: "قراردادها",
  hse: "بازرسی",
  tamin_insurance: "بیمه تامین اجتماعی",
  third_party_insurance: "بیمه شخص ثالث",
  environment: "محیط ها",
  environment_usage: "کاربری محیط",
  supplementary_insurance: "بیمه تکمیلی",
  access: "دسترسی‌ها",
};

const PermissionsFarsiLabels = {
  //person  10s / : 10L
  person_insert: { label: "ثبت رکورد", value: "person/insert", level: "" },
  person_edit: { label: "ویرایش رکورد", value: "person/edit", level: "" },
  person_delete: { label: "حذف رکورد", value: "person/delete", level: "" },
  person_approve: { label: "تایید رکورد", value: "person/approve", level: "" },
  person_privatedescription: {
    label: "مشاهده توضیحات اختصاصی",
    value: "person/privatedescription",
    level: "",
  },
  person_editcontact: {
    label: "تغییر اطلاعات تماس",
    value: "person/editcontact",
    level: "",
  },
  person_viewsubordinate: {
    label: "مشاهده افراد تبعی",
    value: "person/viewsubordinate",
    level: "",
  },
  person_list: { label: "لیست پرسنل", value: "person/list", level: "" },
  person_timeoff_for_others: {
    label: "درخواست مرخصی برای دیگران",
    value: "person/submit-timeoff-forothers",
    level: "",
  },
  person_approve_timeoff: {
    label: "تایید مرخصی",
    value: "person/approve-timeoff",
    level: "",
  },
  //legal  //6s: 6L
  legal_insert: { label: "ثبت رکورد", value: "legal/insert", level: "" },
  legal_edit: { label: "ویرایش رکورد", value: "legal/edit", level: "" },
  legal_delete: { label: "حذف رکورد", value: "legal/delete", level: "" },
  legal_approve: { label: "تایید رکورد", value: "legal/approve", level: "" },
  legal_editcontact: {
    label: "تغییر اطلاعات تماس",
    value: "legal/editcontact",
    level: "",
  },
  legal_list: { label: "لیست حقوقی", value: "legal/list", level: "" },
  //machinery //6s: 6L
  machinery_insert: {
    label: "ثبت رکورد",
    value: "machinery/insert",
    level: "",
  },
  machinery_edit: { label: "ویرایش رکورد", value: "machinery/edit", level: "" },
  machinery_delete: {
    label: "حذف رکورد",
    value: "machinery/delete",
    level: "",
  },
  machinery_approve: {
    label: "تایید رکورد",
    value: "machinery/approve",
    level: "",
  },
  machinery_editcontact: {
    label: "تغییر اطلاعات تماس",
    value: "machinery/editcontact",
    level: "",
  },
  machinery_list: {
    label: "لیست ماشین آلات",
    value: "machinery/list",
    level: "",
  },
  //contract //13S : 12L
  contract_insert: { label: "ثبت رکورد", value: "contract/insert", level: "" },
  contract_edit: { label: "ویرایش رکورد", value: "contract/edit", level: "" },
  contract_delete: { label: "حذف رکورد", value: "contract/delete", level: "" },
  contract_approve: {
    label: "تایید رکورد",
    value: "contract/approve",
    level: "",
  },
  contract_list: {
    label: "لیست قرارداد ها",
    value: "contract/list",
    level: "",
  },
  contract_progress_add_edit: {
    label: "ثبت/ویرایش اطلاعات پیشرفت پروژه",
    value: "contract/progress-add-edit",
    level: "",
  },
  contract_progress_approve: {
    label: "تایید اطلاعات پیشرفت پروژه",
    value: "contract/progress-approve",
    level: "",
  },
  contract_production_report_add_edit: {
    label: "ثبت/ویرایش اطلاعات گزارش تولید",
    value: "contract/production-report-add-edit",
    level: "",
  },
  contract_production_report_approve: {
    label: "تایید اطلاعات گزارش تولید",
    value: "contract/production-report-approve",
    level: "",
  },
  contract_peyman_report_add_edit: {
    label: "ثبت/ویرایش اطلاعات اولیه کنترل پروژه ماشین آلات",
    value: "contract/peyman-report-add-edit",
    level: "",
  },
  contract_peyman_report_approve: {
    label: "تایید اطلاعات اولیه کنترل پروژه ماشین آلات",
    value: "contract/peyman-report-approve",
    level: "",
  },
  contract_dashboard_report: {
    label: "گزارشات داشبورد",
    value: "contract/dashboard-report",
    level: "",
  },
  // tamin_insurance_view_contract_in_report:{ label: " ", value:  "tamin_insurance/view_contract_in_report", level: "" },

  //tamin //7S : 7L
  tamin_insurance_menu: {
    label: "منوی بیمه تامین اجتماعی",
    value: "tamin_insurance/menu",
    level: "",
  },
  tamin_insurance_list_change_status: {
    label: "تغییر وضعیت لیست بیمه تامین اجتماعی",
    value: "tamin_insurance/list_change_status",
    level: "",
  },
  tamin_insurance_export_list: {
    label: "خروجی اکسل از لیست های بیمه تامین اجتماعی",
    value: "tamin_insurance/export_list",
    level: "",
  },
  tamin_insurance_report: {
    label: "گزارش بیمه تامین اجتماعی",
    value: "tamin_insurance/report",
    level: "",
  },
  tamin_insurance_view_contract_in_report: {
    label: "مشاهده قرارداد ها در گزارش تامین اجتماعی",
    value: "tamin_insurance/view_contract_in_report",
    level: "",
  },
  tamin_insurance_view_include_notification_in_report: {
    label: "مشاهده مشمول و غیر مشمول در گزارش تامین اجتماعی",
    value: "tamin_insurance/view_include_notinclude_in_report",
    level: "",
  },
  tamin_insurance_export_personnel_list: {
    label: "خروجی اکسل از لیست ریز اسامی بیمه تامین اجتماعی",
    value: "tamin_insurance/export_personnel_list",
    level: "",
  },

  //hse //4S : 4L
  hse_approve: { label: "تایید بازرسی", value: "hse/approve", level: "" },
  hse_audit: { label: "انجام بازرسی", value: "hse/audit", level: "" },
  hse_settings: { label: "تنظیمات HSE", value: "hse/settings", level: "" },
  hse_view: { label: "ویوی بازرسی", value: "hse/view", level: "" },

  // third party insurance
  third_party_insurance_view: {
    label: "مشاهده بیمه شخص ثالث",
    value: "third_party_insurance/view",
    level: "",
  },
  third_party_insurance_approve: {
    label: "تغییر وضعیت بیمه شخص ثالث",
    value: "third_party_insurance/approve",
    level: "",
  },
  // environment
  environment_create: {
    label: "ساخت محیط",
    value: "environment/create",
    level: "",
  },
  environment_delete: {
    label: "حذف محیط",
    value: "environment/delete",
    level: "",
  },
  environment_edit: {
    label: "ویرایش محیط",
    value: "environment/edit",
    level: "",
  },
  environment_list: {
    label: "مشاهده محیط ها",
    value: "environment/list",
    level: "",
  },
  // environment usage
  environment_usage_create: {
    label: "ساخت کاربری محیط",
    value: "environment_usage/create",
    level: "",
  },
  environment_usage_delete: {
    label: "حذف کاربری محیط",
    value: "environment_usage/delete",
    level: "",
  },
  environment_usage_edit: {
    label: "ویرایش کاربری محیط",
    value: "environment_usage/edit",
    level: "",
  },
  environment_usage_list: {
    label: "لیست کاربری محیط",
    value: "environment_usage/list",
    level: "",
  },
  // supplementary insurance
  supplementary_insurance_list: {
    label: "مشاهده لیست بیمه های تکمیلی",
    value: "supplementary_insurance/list",
    level: "",
  },
  supplementary_insurance_create: {
    label: "ساخت بیمه تکمیلی جدید",
    value: "supplementary_insurance/create",
    level: "",
  },
  supplementary_insurance_update: {
    label: "ویرایش بیمه تکمیلی",
    value: "supplementary_insurance/update",
    level: "",
  },
  supplementary_insurance_delete: {
    label: "حذف بیمه تکمیلی",
    value: "supplementary_insurance/delete",
    level: "",
  },

  // additional untranslated permissions
  person_submit_timeoff_forothers: {
    label: "ثبت مرخصی برای دیگران",
    value: "person/submit_timeoff_forothers",
    level: "",
  },
  tamin_insurance_view_include_notinclude_in_report: {
    label: "انتخاب موارد موجود در گزارش بیمه تامین اجتماعی",
    value: "tamin_insurance/view_include_notinclude_in_report",
    level: "",
  },
  access_list: {
    label: "لیست دسترسی‌ها",
    value: "access/list",
    level: "",
  },
};

export {
  levels,
  baseLevels,
  permission,
  PermissionsFarsiLabels,
  PermissionsSectionsFarsiLabels,
};
