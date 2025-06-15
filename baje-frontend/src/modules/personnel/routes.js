export default {
  //------------------------REAL---------------------------------
  PERSONNEL_REAL_ADD: "/management/person/addRealPerson",
  PERSONNEL_REAL_EDIT: "/management/person/editRealPerson/:id",
  PERSONNEL_REAL_VIEW: "/management/person/realPersonView/:id",
  PERSONNEL_REAL_LIST: "/management/person/realPersons",
  PERSONNEL_REAL_GROUP_ADD: "/management/person/addGroupRealPerson",
  PERSONNEL_REAL_ASSIGN_SHIFT: "/management/person/assignShift",
  PERSONNEL_REAL_RESUME: "/management/person/resume/:id",
  PERSONNEL_REAL_RESUME_VIEW: "/management/person/resume/:id/:resume_id",
  //--------------------------------SERVICE------------------------------------------
  PERSONNEL_REAL_SERVICE_ADD: "/management/person/addService",
  PERSONNEL_REAL_SERVICE_LIST: "/management/person/service",
  //---------------------------EXAMINATION------------------------------------
  PERSONNEL_REAL_EXAMINATION_ADD: "/management/person/addExamination",
  PERSONNEL_REAL_EXAMINATION_PERSON_LIST: "/management/person/examination",
  PERSONNEL_REAL_EXAMINATION_VISIT_LIST:
    "/management/person/listExamination/:id",
  //------------------------------CHECKOUT-----------------------------------------------
  PERSONNEL_REAL_CHECKOUT_ADD: "/management/person/addCheckout",
  PERSONNEL_REAL_CHECKOUT_LIST: "/management/person/checkout",
  PERSONNEL_REAL_CHECKOUT_EDIT: "/management/person/checkout/edit/:id",
  PERSONNEL_REAL_CHECKOUT_DETAIL: "/management/person/checkout/:id",
  //-------------------------------RECORD_CLAIM-----------------------------------------
  PERSONNEL_REAL_RECORD_CLAIM_ADD: "/management/person/addRecordClaim",
  PERSONNEL_REAL_RECORD_CLAIM_EDIT: "/management/person/recordClaim/edit/:id",
  PERSONNEL_REAL_RECORD_CLAIM_DETAIL:
    "/management/person/recordClaim/detail/:id",
  PERSONNEL_REAL_RECORD_CLAIM_LIST: "/management/person/recordClaim",
  //--------------------------------LEAVE_REQUEST-----------------------------------------------
  PERSONNEL_REAL_LEAVE_REQUEST_ADD: "/management/person/addLeaveRequest",
  PERSONNEL_REAL_LEAVE_REQUEST_LIST: "/management/person/leaveRequest",
  PERSONNEL_REAL_LEAVE_REQUEST_EDIT: "/management/person/leaveRequest/edit/:id",
  PERSONNEL_REAL_LEAVE_REQUEST_DETAIL: "/management/person/leaveRequest/:id",
  //-----------------------------------LOAN_REQUEST----------------------------------------------------
  PERSONNEL_REAL_LOAN_REQUEST_ADD: "/management/person/addLoanRequest",
  PERSONNEL_REAL_LOAN_REQUEST_LIST: "/management/person/loanRequest",
  PERSONNEL_REAL_LOAN_REQUEST_EDIT:
    "/management/person/editLoanRequest/:id/:nid",
  PERSONNEL_REAL_LOAN_REQUEST_DETAIL:
    "/management/person/loanRequestDetail/:id/:nid",
  //-------------------------------------MISSION---------------------------------------------------------
  PERSONNEL_REAL_MISSION_ADD: "/management/person/addMission",
  PERSONNEL_REAL_MISSION_LIST: "/management/person/mission",
  PERSONNEL_REAL_MISSION_EDIT: "/management/person/mission/edit/:id",
  PERSONNEL_REAL_MISSION_DETAIL: "/management/person/mission/:id",
  //-----------------------------------------ACCIDENT-------------------------------------------------------------
  ACCIDENT_REPORT_ADD: "/management/accidentReportAdd",
  ACCIDENT_REPORT_EDIT: "/management/accidentReportEdit/:id",
  ACCIDENT_REPORT_LIST: "/management/accidentReportList",
  ACCIDENT_REPORT_DETAIL: "/management/accidentReportDetail/:id",
  //------------------------------------------RIGHTFUL-----------------------------------------------------------
  PERSONNEL_RIGHTFUL_ADD: "/management/person/addRightful",
  PERSONNEL_RIGHTFUL_EDIT: "/management/person/editRightful/:id",
  PERSONNEL_RIGHTFUL_VIEW: "/management/person/rightFullView/:id",
  PERSONNEL_RIGHTFUL_LIST: "/management/person/rightFullList",
  PERSONNEL_RIGHTFUL_GROUP_ADD: "/management/person/addGroupRightful",
  //------------------------------------------------SUPPLEMENTARY_INSURANCE---------------------------------------------------------------
  PERSONNEL_SUPPLEMENTARY_INSURANCE_ADD:
    "/management/person/supplementaryInsurance/add",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_LIST:
    "/management/person/supplementaryinsurance",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_EDIT:
    "/management/person/supplementaryinsurance/edit/:id",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_DETAIL:
    "/management/person/supplementaryinsurance/detail/:id",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PRINT_INTRO:
    "/management/person/supplementaryinsurance/printintro/:id",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_GENERAL_INFO:
    "/management/person/supplementaryinsurance/genralInfo/:id",
  //---------------------------------------------SUPPLEMENTARY_INSURANCE_PERSON-------------------------
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PERSON_ADD:
    "/management/personnel/supplementaryinsurance/person/add/:id",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PERSON_LIST:
    "/management/personnel/supplementaryinsurance/person/list/:id",
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PERSON_HISTORY:
    "/management/personnel/supplementaryinsurance/person/history/:id/:personName",
  //------------------------------------------------Deductions----------------------------------------------------------------
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PERSON_DEDUCTIONS_ADD:
    "/management/personnel/supplementaryinsurance/person/deductions/add/:insuranceId/:userId", // send insurance id and user id
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PERSON_DEDUCTIONS_EDIT:
    "/management/personnel/supplementaryinsurance/person/deductions/edit/:id/:insuranceId/:userId", // send insurance id and user id
  PERSONNEL_SUPPLEMENTARY_INSURANCE_PERSON_DEDUCTIONS_LIST:
    "/management/personnel/supplementaryinsurance/person/deductions/list/:insuranceId/:userId", // send insurance id and user id
  //------------------------------------------------ACCIDENT_INSURANCE---------------------------------------------------------------
  PERSONNEL_ACCIDENT_INSURANCE_ADD: "/management/person/accidentInsurance/add",
  PERSONNEL_ACCIDENT_INSURANCE_LIST: "/management/person/accidentinsurance",
  PERSONNEL_ACCIDENT_INSURANCE_EDIT:
    "/management/person/accidentinsurance/edit/:id",
  PERSONNEL_ACCIDENT_INSURANCE_DETAIL:
    "/management/person/accidentinsurance/detail/:id",
  PERSONNEL_ACCIDENT_INSURANCE_PRINT_INTRO:
    "/management/person/accidentinsurance/printintro/:id",
  PERSONNEL_ACCIDENT_INSURANCE_GENERAL_INFO:
    "/management/person/accidentinsurance/genralInfo/:id",
  //---------------------------------------------ACCIDENT_INSURANCE_PERSON-------------------------
  PERSONNEL_ACCIDENT_INSURANCE_PERSON_ADD:
    "/management/personnel/accidentinsurance/person/add/:id",
  PERSONNEL_ACCIDENT_INSURANCE_PERSON_LIST:
    "/management/personnel/accidentinsurance/person/list/:id",
  PERSONNEL_ACCIDENT_INSURANCE_PERSON_HISTORY:
    "/management/personnel/accidentinsurance/person/history/:id",
  //------------------------------------------------Deductions----------------------------------------------------------------
  PERSONNEL_ACCIDENT_INSURANCE_PERSON_DEDUCTIONS_ADD:
    "/management/personnel/accidentinsurance/person/deductions/add/:insuranceId/:userId", // send insurance id and user id
  PERSONNEL_ACCIDENT_INSURANCE_PERSON_DEDUCTIONS_EDIT:
    "/management/personnel/accidentinsurance/person/deductions/edit/:id/:insuranceId/:userId", // send insurance id and user id
  PERSONNEL_ACCIDENT_INSURANCE_PERSON_DEDUCTIONS_LIST:
    "/management/personnel/accidentinsurance/person/deductions/list/:insuranceId/:userId", // send insurance id and user id
  //-------------------------------------------DOCTOR-------------------------------------------------------------------
  PERSONNEL_DOCTOR_ADD: "/management/person/addDoctor",
  PERSONNEL_DOCTOR_EDIT: "/management/person/editDoctor/:id",
  PERSONNEL_DOCTOR_LIST: "/management/person/doctor",
  //-------------------------------------------------------------SOCIAL_INSURANCE-------------------------------------------------------------------
  PERSONNEL_SOCIAL_INSURANCE_LIST: "/management/insurance/tamin",
  PERSONNEL_SOCIAL_INSURANCE_ADD: "/management/insurance/tamin/add",
  PERSONNEL_SOCIAL_INSURANCE_PRINT: "/management/insurance/tamin/print/:id",

  PERSONNEL_SOCIAL_INSURANCE_PRINT_DISKET:
    "/management/insurance/tamin/printDisket/:id",

  PERSONNEL_SOCIAL_INSURANCE_PERSONNEL_REPORT:
    "/management/insurance/tamin/personnelReport/:id",
  PERSONNEL_SOCIAL_INSURANCE_PERSONNEL_REPORT_PRINT:
    "/management/insurance/tamin/personnelReportPrint/:id",
  //------------------------------------------------------------------SOCIAL_INSURANCE_PAYMENT--------------------------------------------------------
  PERSONNEL_SOCIAL_INSURANCE_PAYMENT_LIST:
    "/management/insurance/tamin/payment/:contractID/:insuranceID",
  PERSONNEL_SOCIAL_INSURANCE_PAYMENT_ADD:
    "/management/insurance/tamin/payment/add",
  PERSONNEL_SOCIAL_INSURANCE_PAYMENT_EDIT:
    "/management/insurance/tamin/payment/edit/:id",
  PERSONNEL_SOCIAL_INSURANCE_PAYMENT_DETAIL:
    "/management/insurance/tamin/payment/detail/:id",

  //-----------------------------------PERSONNEL_ANNUAL_SETTINGS----------------------------------------------------
  PERSONNEL_ANNUAL_SETTINGS_ADD: "/management/personnel/addSetting",
  PERSONNEL_ANNUAL_SETTINGS_LIST: "/management/personnel/settings",
  PERSONNEL_ANNUAL_SETTINGS_EDIT: "/management/personnel/editSetting/:id",
  PERSONNEL_ANNUAL_SETTINGS_DETAIL: "/management/personnel/settingDetail/:id",

  //---------------------------- SOCIAL_INSURANCE_PERSONNEL -----------------------------------//
  SOCIAL_INSURANCE_PEOPLE_ADD: "/management/insurance/tamin/personnel/:id/add",

  SOCIAL_INSURANCE_PEOPLE_LIST:
    "/management/insurance/tamin/personnel/:id/status/:status",
  SOCIAL_INSURANCE_PEOPLE_EDIT:
    "/management/insurance/tamin/personnel/:id/edit/:person_id",
  SOCIAL_INSURANCE_PEOPLE_DETAIL:
    "/management/insurance/tamin/personnel/:id/details/:person_id",

  //-----------------------------------PERSONNEL_JOBS----------------------------------------------------
  PERSONNEL_JOBS_LIST: "/management/personnel/jobs",
  PERSONNEL_JOBS_ORGANIZATIONAL_CHART:
    "/management/personnel/jobs/organizational-chart",
  PERSONNEL_JOBS_CALENDAR: "/management/personnel/jobs/calendar",
  SHIFTWORK_ADD: "/management/personnel/jobs/shiftwork/add",
  SHIFTWORK_LIST: "/management/personnel/jobs/shiftwork",

  // CHARTS
  PERSONNEL_JOBS_CHARTS_LIST: "/management/person/org-charts/:id",
  PERSONNEL_JOBS_CHARTS_ADD: "/management/person/org-charts/:id/add",
  PERSONNEL_JOBS_CHARTS_EDIT:
    "/management/person/org-charts/:id/edit/:chart_id",
  PERSONNEL_JOBS_CHARTS_VIEW:
    "/management/person/org-charts/:id/view/:chart_id",

  // BOARD MEMBERS
  PERSONNEL_BOARD_MEMBERS_LIST: "/management/person/board-members/:id",
  PERSONNEL_BOARD_MEMBERS_ADD: "/management/person/board-members/:id/add",
  PERSONNEL_BOARD_MEMBERS_EDIT:
    "/management/person/board-members/:id/edit/:member_id",
  PERSONNEL_BOARD_MEMBERS_VIEW:
    "/management/person/board-members/:id/view/:member_id",
  //-----------------------------------INSURANCE----------------------------------------------------
  // insurance contracts
  PERSONNEL_INSURANCE_CONTRACTS_LIST: "/management/person/insurance/contracts",
  PERSONNEL_INSURANCE_CONTRACTS_NEW_LIST:
    "/management/person/insurance/contracts/:id/new",
  PERSONNEL_INSURANCE_CONTRACT_DETAILS:
    "/management/person/insurance/contracts/:id",
  PERSONNEL_INSURANCE_CONTRACTS_PEOPLE_ADD_SUB:
    "/management/person/insurance/contracts/:id/people/add_sub",
  PERSONNEL_INSURANCE_CONTRACTS_PEOPLE_EDIT_SUB:
    "/management/person/insurance/contracts/:id/people/edit_subs",
  PERSONNEL_INSURANCE_CONTRACTS_PEOPLE_ADD_SUB_NEW:
    "/management/person/insurance/contracts/:contract_id/people/add_sub/new",
  PERSONNEL_INSURANCE_CONTRACTS_PEOPLE_ADD_SUB_EDIT:
    "/management/person/insurance/contracts/:id/people/add_sub/edit/:sub_id",
};
