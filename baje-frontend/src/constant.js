import { subDomain } from "./_helpers";

export const pageNames = {
  auth: {
    login: "/login",
    resetPassword: "/rest-password",
  },
  home: {
    web: "/",
    mobile: "/mobile-home",
  },
  error: "/error",
  tableExample: "/example",
  printLetter: "/print-intro-letter",
  suggest: {
    auth: {
      signUp: "/suggest/signup/:type",
      intro: "/nezam",
    },
    commitee: {
      add: "/suggest/committee/add",
      list: "/suggest/committee/list",
      member: {
        add: "/suggest/committee/member/add",
        edit: "/suggest/committee/member/edit/:id",
        list: "/suggest/committee/member/list/:id",
      },
    },
    assessmentCriteria: {
      add: "/suggest/assessment-criteria/add",
      edit: "/suggest/assessment-criteria/edit/:id",
      list: "/suggest/assessment-criteria/list/:id?",
    },
    rejectionCriteria: {
      add: "/suggest/rejection-criteria/add",
      edit: "/suggest/rejection-criteria/edit/:id",
      list: "/suggest/rejection-criteria/list/:id?",
    },
    category: {
      add: "/suggest/category/add",
      edit: "/suggest/category/edit/:id",
      list: "/suggest/category/list",
    },
    call: {
      add: "/suggest/call/add",
      edit: "/suggest/call/edit/:id",
      list: "/suggest/call/list",
    },
    suggestion: {
      add: "/suggest/suggestion/add",
      edit: "/suggest/suggestion/edit/:id",
      view: "/suggest/suggestion/details/:id",
      list: "/suggest/suggestion/list/:filter?",
      publicList: "/suggest/suggestion/list/public",
      reject: "/suggest/suggestion/reject/:id",
    },
    problem: {
      add: "/suggest/problem/add/:id",
      edit: "/suggest/problem/edit/:id/:itemId",
      view: "/suggest/problem/details/:id/:itemId",
      list: "/suggest/problem/list/:id",
    },
    configuration: "/suggest/configuration",
    evaluationApply: "/suggest/evaluation/apply/:suggestion/:personnel?",
    forumIndex: "/suggest/forum/index/:id",
    reportIndex: "/suggest/report/index",
  },
  contract: {
    add: "/management/contract/add",
    edit: "/management/contract/edit/:id",
    view: "/management/contract/view/:id",
    list: "/management/contract/list",
  },
  machinery: {
    add: "/management/machinery/add-machine",
    edit: "/management/machinery/edit-machine/:id",
    view: "/management/machinery/machine-view/:id",
    list: "/management/machinery/machine",
    addGroup: "/management/machinery/add-group-machine",
    addType: "/management/machinery/add-type",
    addSystem: "/management/machinery/add-system",
    addTip: "/management/machinery/add-tip",
  },
  dashboard: {
    peymanManagement: {
      add: "/dashboard/peyman-management/add/:id",
      edit: "/dashboard/peyman-management/edit/:id",
      view: "/dashboard/peyman-management/detail/:id",
      list: "/dashboard/peyman-management/list",
    },
    productionReport: {
      add: "/dashboard/production-report/add/:id",
      edit: "/dashboard/production-report/edit/:id",
      view: "/dashboard/production-report/detail/:id",
      list: "/dashboard/production-report/list",
    },
    projectProgress: "/dashboard/production-report",
    chartReports: "/dashboard/chart-reports",
  },
  personnel: {
    realPerson: {
      add: "/management/person/add-real-person",
      edit: "/management/person/edit-real-person/:id",
      view: "/management/person/real-person-view/:id",
      list: "/management/person/real-persons",
      salary: "/management/person/real-persons/salary/:id",
      addGroup: "/management/person/add-group-real-person",
      assignShift: "/management/person/assign-shift/:id",
      accidentReport: {
        add: "/management/accident-report-add",
        edit: "/management/accident-report-edit/:id",
        view: "/management/accident-report-detail/:id",
        list: "/management/accident-report-list",
      },
      subordinate: {
        list: "/management/person/real-person/:id/subordidate-list",
        add: "/management/person/real-person/:id/subordidate-add",
      },

      service: {
        add: "/management/person/add-service",
        list: "/management/person/service",
      },
      examination: {
        add: "/management/person/add-examination",
        list: "/management/person/list-examination/:id",
        personList: "/management/person/examination",
      },
      checkout: {
        add: "/management/person/add-checkout",
        edit: "/management/person/checkout/edit/:id",
        view: "/management/person/checkout/:id",
        list: "/management/person/checkout",
      },
      recordClaim: {
        add: "/management/person/add-record-claim",
        edit: "/management/person/record-claim/edit/:id",
        view: "/management/person/record-claim/detail/:id",
        list: "/management/person/record-claim",
      },
      leaveRequest: {
        add: "/management/person/add-leave-request",
        edit: "/management/person/leave-request/edit/:id",
        view: "/management/person/leave-request/:id",
        list: "/management/person/leave-request",
      },
      loanRequest: {
        add: "/management/person/add-loan-request",
        edit: "/management/person/edit-loan-request/:id/:nid",
        view: "/management/person/loan-request-detail/:id/:nid",
        list: "/management/person/loan-request",
      },
      mission: {
        add: "/management/person/add-mission",
        edit: "/management/person/mission/edit/:id",
        view: "/management/person/mission/:id",
        list: "/management/person/mission",
      },
      resume: {
        list: "/management/person/resume/:id",
        view: "/management/person/resume/:id/:resume_id",
      },
    },

    rightFull: {
      add: "/management/person/add-rightful",
      edit: "/management/person/edit-rightful/:id",
      view: "/management/person/rightful-view/:id",
      list: "/management/person/rightFul-list",
      addGroup: "/management/person/add-group-rightful",
    },

    boardMembers: {
      list: "/management/person/board-members/:id",
      add: "/management/person/board-members/:id/add",
      edit: "/management/person/board-members/:id/edit/:member_id",
      view: "/management/person/board-members/:id/view/:member_id",
    },

    doctor: {
      add: "/management/person/add-doctor",
      edit: "/management/person/edit-doctor/:id",
      list: "/management/person/doctor",
    },
    annualSetting: {
      add: "/management/personnel/add-setting",
      edit: "/management/personnel/edit-setting/:id",
      view: "/management/personnel/setting-detail/:id",
      list: "/management/personnel/settings",
    },
    jobs: {
      list: "/management/personnel/jobs",
      orgenaizationalChart: "/management/personnel/jobs/organizational-chart",
      calender: "/management/personnel/jobs/calendar",
    },
    shiftWork: {
      add: "/management/personnel/jobs/shiftwork/add",
      edit: "/management/personnel/jobs/shiftwork/edit/:id",
      list: "/management/personnel/jobs/shiftwork",
    },
    orgCharts: {
      list: "/management/person/org-charts/:id",
      add: "/management/person/org-charts/:id/add",
      edit: "/management/person/org-charts/:id/edit/:chart_id",
      view: "/management/person/org-charts/:id/view/:chart_id",
    },

    insurance: {
      tamin: {
        add: "/management/insurance/tamin/add",
        list: "/management/insurance/tamin",
        print: "/management/insurance/tamin/print/:id",
        printDisket: "/management/insurance/tamin/print-disket/:id",
        personnelReport: "/management/insurance/tamin/personnel-report/:id",
        personnelReportPrint:
          "/management/insurance/tamin/personnel-report-print/:id",
        payment: {
          add: "/management/insurance/tamin/payment/add",
          edit: "/management/insurance/tamin/payment/edit/:id",
          view: "/management/insurance/tamin/payment/detail/:id",
          list: "/management/insurance/tamin/payment/:contractID/:insuranceID",
        },
        personnel: {
          add: "/management/insurance/tamin/personnel/:id/add",
          edit: "/management/insurance/tamin/personnel/:id/edit/:person_id",
          view: "/management/insurance/tamin/personnel/:id/details/:person_id",
          list: "/management/insurance/tamin/personnel/:id/status/:status",
        },
      },
      supplymentary: {
        add: "/management/person/supplementary-insurance/add",
        edit: "/management/person/supplementary-insurance/edit/:id",
        view: "/management/person/supplementary-insurance/detail/:id",
        list: "/management/person/supplementary-insurance",
        generalInfo:
          "/management/person/supplementary-insurance/general-info/:id",
        personnel: {
          add: "/management/personnel/supplementary-insurance/person/add/:id",
          list: "/management/personnel/supplementary-insurance/person/list/:id",
          history:
            "/management/personnel/supplementary-insurance/person/history/:id/:personName",
          printIntro:
            "/management/person/supplementary-insurance/print-intro/:id",
          deucation: {
            add:
              "/management/personnel/supplementary-insurance/person/deductions/add/:insuranceId/:userId",
            edit:
              "/management/personnel/supplementary-insurance/person/deductions/edit/:id/:insuranceId/:userId",
            list:
              "/management/personnel/supplementary-insurance/person/deductions/list/:insuranceId/:userId",
          },
        },
        contracts: {
          add: "/management/person/insurance/contracts/:id/new",
          view: "/management/person/insurance/contracts/:id",
          list: "/management/person/insurance/contracts",
          subordinate: {
            add: "/management/person/insurance/contracts/:id/people/add_sub",
            edit: "/management/person/insurance/contracts/:id/people/edit_subs",
            addNew:
              "/management/person/insurance/contracts/:contract_id/people/add_sub/new",
            editNew:
              "/management/person/insurance/contracts/:id/people/add_sub/edit/:sub_id",
          },
        },
      },
      accident: {
        add: "/management/person/accident-insurance/add",
        edit: "/management/person/accident-insurance/edit/:id",
        view: "/management/person/accident-insurance/detail/:id",
        list: "/management/person/accident-insurance",
        generalInfo: "/management/person/accident-insurance/genral-info/:id",
        personnel: {
          add: "/management/personnel/accident-insurance/person/add/:id",
          list: "/management/personnel/accident-insurance/person/list/:id",
          history:
            "/management/personnel/accident-insurance/person/history/:id",
          printIntro: "/management/person/accident-insurance/printintro/:id",
          deducation: {
            add:
              "/management/personnel/accident-insurance/person/deductions/add/:insuranceId/:userId",
            edit:
              "/management/personnel/accident-insurance/person/deductions/edit/:id/:insuranceId/:userId",
            list:
              "/management/personnel/accident-insurance/person/deductions/list/:insuranceId/:userId",
          },
        },
      },
      thirdPartyIns: {
        add: "/management/insurance/third-party/add",
        edit: "/management/insurance/third-party/edit/:id",
        view: "/management/insurance/third-party/view/:id",
        list: "/management/insurance/third-party",
      },
    },
  },
  hse: {
    index: "/hse",
    questions: { index: "/hse/question", addEdit: "/hse/question/add" },
    checklist: { index: "/hse/checklist", addEdit: "/hse/checklist/add" },
    audit: {
      index: "/hse/audit",
      addEdit: "/hse/audit/add",
      auditDetail: "/hse/audit/detail/:id",
      auditReport: "/hse/audit/report/:id",
    },
    allocate: { index: "/hse/allocate" },
    performAnAudit: { index: "/hse/perform-an-audit/:id" },
  },
  task: {
    index: "/tasks/:status",
    detail: "/task/detail/:id/:role",
    create: "/task/create",

    tableName: {
      index: "/task/table-name",
      columns: "/task/table-name/columns",
    },
    taskCondtion: {
      index: "/task/task-condition",
      create: "/task/task-condition/create",
    },
    cardBoards: "/card-boards",
  },

  environment: {
    usage: "/environment-usage",
    add: "/management/environments/add",
    edit: "/management/environments/edit/:id",
    view: "/management/environments/view/:id",
    list: "/management/environments/list",
  },

  permissions: {
    list: "/management/permissions/list",
    person: {
      add: "/management/user-permissions/add/:id",
      list: "/management/user-permissions/list/:id",
      edit: "/management/user-permissions/edit/:id",
      view: "/management/user-permissions/view/:id",
      all: "/management/user-permissions/list/all",
    },
  },
};

export const noneLayoutPages = [
  pageNames.suggest.auth.signUp,
  pageNames.suggest.auth.intro,
  pageNames.error,
  pageNames.auth.login,
  pageNames.auth.resetPassword,
];

export const reduxTypes = {
  user: "reduxUserType",
  token: "reduxTokenType",
  suggestToken: "reduxtSuggestionsToken",
  suggestUserData: "reduxSuggestUserData",
  contractList: "reduxContractList",
  shiftList: "reduxShiftList",
  currentOffice: "reduxCurrentOffice",
  currentContract: "reduxCurrentContract",
  currentEnvironment: "reduxCurrentEnvironment",
  environmentList: "reduxEnvironmentList",
  officeLogo: "reduxOfficeLofo",
  lastSuggestFilter: "reduxLastSuggestFilter",
  taskNotifications: "taskNotifications",
};

export const formItemLayout = {
  labelCol: { span: 24 },
  colon: false,
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

export const formRowGutter = { xs: 8, sm: 16, md: 24, lg: 32 };
export const formColSpan = { xs: 24, sm: 24, md: 12, xl: 6 };
export const formColSpanFull = { xs: 24, sm: 24, md: 24, xl: 24 };
export const BASE_URL = "https://baje724.ir";

export const ruleMessages = {
  required: (fieldName) => `${fieldName} الزامی است`,
};

export const aboutText = `شرکت نگین گهر زمین سیرجان، از شرکت های زیرمجموعه هلدینگ جهاد نصر کرمان
        است که درسال ۱۳۸۴ تاسیس شد و تا سال ۱۳۹۸ فعالیتی نداشت. پس از آن با
        تغییر اساس نامه و مدیریت مهندس قاسم محمدی فصل نوینی از فعالیت های شرکت
        نگین گهر زمین سیرجان آغاز شد. از طرفی با گسترش دامنه فعالیت های هلدینگ
        جهاد نصر کرمان، پراکندگی پروژه های این مجموعه در سرتاسر کشور و نیز تمرکز
        بر حوزه معدنکاری، نیاز به نرم افزاری جامع در حوزه مدیریت منابع، از
        انسانی تا ماشین آلات و ... در مدیران احساس و پروژه بزرگ بانک اطلاعاتی و
        نرم افزار "باجه"(بانک اطلاعات جامع هلدینگ) تعریف، و اجرای آن به شرکت
        نگین گهرزمین محول شد. با طراحی مهندس علیرضا جهانشاهی و اجرا و پیاده سازی
        مهندسین ارشد و برجسته برنامه نویسی، آقایان امیر زندی و صالح شورآبادی،
        پروژه تولید نرم افزار "باجه" تحت مدیریت مهندس فرشید حقیقی نژاد از ابتدای
        تابستان ۱۳۹۹ کلید خورد و فاز اول این نرم افزار در شهریور ماه ۱۳۹۹ به
        بهره برداری رسید.`;

const prod = {
  url: {
    API_URL: "https://baje724.ir",
  },
};

const dev = {
  url: {
    API_URL: "https://test.baje724.ir",
  },
};

export const config =
  process.env.NODE_ENV === "development" || subDomain(window.location.href)
    ? dev
    : prod;

// export const config = prod;
