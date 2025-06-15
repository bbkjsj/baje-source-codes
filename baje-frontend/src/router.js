import { pageNames } from "./constant";
// componenets:
// suggest
import ConfigurationForm from "modules/suggest/configuration/ConfigurationForm";
import EvaluationForm from "modules/suggest/evaluation/EvaluationForm";
import ForumIndex from "modules/suggest/forum/ForumIndex";
import ReportIndex from "modules/suggest/report/ReportIndex";
// suggest/auth
import SuggestionsSignup from "modules/suggest/auth/signupContext";
import SuggestionsSignupIntro from "modules/suggest/auth/Intro";
// suggest/committee
import CommitteeList from "modules/suggest/committee/CommitteeList";
import CommitteeMemberForm from "modules/suggest/committee/CommitteeMemberForm";
import CommitteeMemberList from "modules/suggest/committee/CommitteeMemberList";
// suggest/AssessmentCriteria
import AssessmentCriteriaList from "modules/suggest/assessmentCriteria/AssessmentCriteriaList";
import AssessmentCriteriaForm from "modules/suggest/assessmentCriteria/AssessmentCriteriaForm";
// suggest/RejectionCriteria
import RejectionCriteriaForm from "modules/suggest/rejectionCriteria/RejectionCriteriaForm";
import RejectionCriteriaList from "modules/suggest/rejectionCriteria/RejectionCriteriaList";
// suggest/Category
import CategoryForm from "modules/suggest/category/CategoryForm";
import CategoryList from "modules/suggest/category/CategoryList";
// suggest/Call
import CallForm from "modules/suggest/call/CallForm";
import CallList from "modules/suggest/call/CallList";
// suggest/suggestion
import SuggestionForm from "modules/suggest/suggestion/SuggestionForm";
import SuggestionDetails from "modules/suggest/suggestion/SuggestionDetails";
import SuggestionList from "modules/suggest/suggestion/SuggestionList";
import SuggestionReject from "modules/suggest/suggestion/SuggestionReject";
//suggest/problemreport
import ProblemReportForm from "modules/suggest/problemReport/ProblemReportForm";
import ProblemReportDetails from "modules/suggest/problemReport/ProblemReportDetails";
import ProblemReportList from "modules/suggest/problemReport/ProblemReportList";
// contract
import ContractList from "modules/contracts/List";
import ContractAdd from "modules/contracts/Add";
import ContractUpdate from "modules/contracts/Edit";
import ContractView from "modules/contracts/View";

// machinery

import MachineAdd from "modules/machinery/MachineAdd/MachineAdd";
import MachineEdit from "modules/machinery/MachineEdit/MachineEdit";
import MachineView from "modules/machinery/MachineView/MachineView";
import MachineList from "modules/machinery/MachineList/MachineList";
import MachineAddGroup from "modules/machinery/MachineAddGroup/MachineAddGroup";

import MachineTypeAdd from "modules/machinery/Type/MachineType";
import MachineSystemAdd from "modules/machinery/System/MachineSystem";
import MachineTipAdd from "modules/machinery/Tip/MachineTip";
// dashboard
import projectProgress from "modules/dashboard/projectProgress/List";
import chartReports from "modules/dashboard/chartReports/View";
// dashboard/peymanManagement
import peymanManagementForm from "modules/dashboard/peymanManagement/PeymanForm";
import peymanList from "modules/dashboard/peymanManagement/List";
// dashboard/ProductionReport
import ProductionReportForm from "modules/dashboard/productionReport/ProductionForm";
import ProductionReportList from "modules/dashboard/productionReport/List";
// personnel/realPersons
// import RealPersonAdd from "modules/personnel/realPerson/RealPersonAdd";
// import RealPersonEdit from "modules/personnel/realPerson/RealPersonEdit";
import RealPersonAdd from "modules/personnel/realPerson/users/AddUser";
import RealPersonEdit from "modules/personnel/realPerson/users/EditUser";
//personnel use older implementation until refactor
import RealPersonView from "pages/persons/realPerson/View/RealPersonView";
// import RealPersonList from "pages/persons/realPerson/list/RealPersonList";
import RealPersonList from "pages/persons/realPerson/list/RealPersonList";
import SubordinateList from "pages/persons/realPerson/list/SubordinateList";
import SubordinateAdd from "pages/persons/realPerson/list/SubordinateAdd";
import RealPersonAddGroup from "pages/persons/realPerson/addGroup/AddGroupRealPerson";
import RealPersonAssignShift from "pages/persons/realPerson/assignShift/AssignShiftForm";
// personnel/realPersons/accidentReport
import AccidentReportAdd from "modules/personnel/accidentReport/AccidentReportAdd";
import AccidentReportEdit from "modules/personnel/accidentReport/AccidentReportEdit";
import AccidentReportDetail from "modules/personnel/accidentReport/AccidentReportDetail";
import AccidentReportList from "modules/personnel/accidentReport/AccidentReportList";
//personnel/realPersons/service
import ServiceAdd from "modules/personnel/realPerson/service/ServiceAdd";
import ServiceList from "modules/personnel/realPerson/service/ServiceList";
//personnel/realPersons/Examination
import ExaminationAdd from "modules/personnel/realPerson/examination/ExaminationAdd";
import ExaminationList from "modules/personnel/realPerson/examination/ExaminationList";
import ExaminationPersonList from "modules/personnel/realPerson/examination/PersonList";
//personnel/realPersons/checkout
import CheckoutAdd from "modules/personnel/realPerson/checkout/CheckoutAdd";
import CheckoutEdit from "modules/personnel/realPerson/checkout/CheckoutEdit";
import CheckoutDetails from "modules/personnel/realPerson/checkout/CheckoutDetails";
import CheckoutList from "modules/personnel/realPerson/checkout/CheckoutList";
//personnel/realPersons/recordClaim
import RecordClaimAdd from "modules/personnel/realPerson/recordClaim/RecordClaimAdd";
import RecordClaimEdit from "modules/personnel/realPerson/recordClaim/RecordClaimEdit";
import RecordClaimDetail from "modules/personnel/realPerson/recordClaim/RecordClaimDetail";
import RecordClaimList from "modules/personnel/realPerson/recordClaim/RecordClaimList";
//personnel/realPerson/leaveRequest
import LeaveRequestAdd from "modules/personnel/realPerson/leaveRequest/LeaveRequestAdd";
import LeaveRequestEdit from "modules/personnel/realPerson/leaveRequest/LeaveRequestEdit";
import LeaveRequestView from "modules/personnel/realPerson/leaveRequest/LeaveRequestView";
import LeaveRequestList from "modules/personnel/realPerson/leaveRequest/LeaveRequestList";
//personnel/realPerson/LoanRequest
import LoanRequestAdd from "modules/personnel/realPerson/loanRequest/LoanRequestAdd";
import LoanRequestEdit from "modules/personnel/realPerson/loanRequest/LoanRequestEdit";
import LoanRequestView from "modules/personnel/realPerson/loanRequest/ViewLoanRequest";
import LoanRequestList from "modules/personnel/realPerson/loanRequest/LoanRequestList";
//personnel/realPerson/Mission
import MissionAdd from "modules/personnel/realPerson/mission/MissionAdd";
import MissionEdit from "modules/personnel/realPerson/mission/MissionEdit";
import MissionList from "./modules/personnel/realPerson/mission/MissionList";
import MissionView from "./modules/personnel/realPerson/mission/MissionView";
// personnel/rigthFull
import RightFullAdd from "pages/persons/addRightFull/AddRightfull";
import RightFullEdit from "pages/persons/addRightFull/edit/EditRightFull";
import RightFullView from "pages/persons/addRightFull/view/RightFullView";
import RightFullList from "pages/persons/addRightFull/list/RightFullList";
import RightFullAddGroup from "pages/persons/addRightFull/addGroup/AddGroupRightFull";
// personnel/doctor
import DoctorAdd from "modules/personnel/doctor/DoctorAdd";
import DoctorEdit from "modules/personnel/doctor/DoctorEdit";
import DoctorList from "modules/personnel/doctor/DoctorList";
//personnel/annualSetting
import AnnualSettingAdd from "modules/personnel/annualSettings/AnnualSettingAdd";
import AnnualSettingEdit from "modules/personnel/annualSettings/AnnualSettingEdit";
import AnnualSettingView from "modules/personnel/annualSettings/View";
import AnnualSettingList from "modules/personnel/annualSettings/List";
//personnel/jobs
import JobList from "modules/personnel/jobs/JobList";
import JobCalendar from "modules/personnel/jobs/TestCalendar";
//personnel/shiftWork
import ShiftworkAdd from "modules/personnel/shiftwork/ShiftForm";
import ShiftworkList from "modules/personnel/shiftwork/ShiftList";
// insurance/tamin
import SocialInsuranceAdd from "modules/personnel/socialInsurance/SocialInsuranceAdd";
import SocialInsuranceList from "modules/personnel/socialInsurance/SocialInsuranceList";
import SocialInsurancePrint from "modules/personnel/socialInsurance/SocialInsurancePrint";
import PrintDisketList from "modules/personnel/socialInsurance/prints/PrintDisketList";
import SocialInsurancePersonnelReport from "modules/personnel/socialInsurance/SocialInsurancePersonnelReport";
import SocialInsurancePersonnelReportPrint from "modules/personnel/socialInsurance/SocialInsurancePersonnelReportPrint";
// insurance/tamin/peyman
import SocialInsurancPaymentList from "modules/personnel/socialInsurance/payment/PaymentList";
import SocialInsurancPaymentEdit from "modules/personnel/socialInsurance/payment/PaymentEdit";
import SocialInsurancPaymentDetail from "modules/personnel/socialInsurance/payment/PaymentDetail";
//insurance/tamin/personnel
import SocialInsurancePersonnelList from "modules/personnel/socialInsurance/socialInsurancePersonnel/List";
import SocialInsurancePersonnelAdd from "modules/personnel/socialInsurance/socialInsurancePersonnel/Add";
// insurance/supplymetary
import SupplementaryInsuranceAdd from "modules/personnel/SupplementaryInsurance/SupplementaryInsuranceAdd";
import SupplementaryInsuranceList from "modules/personnel/SupplementaryInsurance/SupplementaryInsuranceList";
import SupplementaryInsuranceEdit from "modules/personnel/SupplementaryInsurance/SupplementaryInsuranceEdit";
import SupplementaryInsuranceDetail from "modules/personnel/SupplementaryInsurance/SupplementaryInsuranceDetail";
import SupplementaryInsuranceGeneralInfo from "modules/personnel/SupplementaryInsurance/SupplementaryInsuranceGeneralInfo";
// insurance/supplymetary/personnel
import SupplementaryInsurancePersonAdd from "modules/personnel/SupplementaryInsurance/person/MainPersonAdd";
import SupplementaryInsurancePersonList from "modules/personnel/SupplementaryInsurance/person/PersonList";
import SupplementaryInsurancePersonHistory from "modules/personnel/SupplementaryInsurance/person/PersonHistory";
import SupplementaryInsurancePrintIntroLetter from "modules/personnel/SupplementaryInsurance/person/PrintIntroLetter";
// insurance/supplymetary/deducation
import SupplementaryInsuranceDeductionsAdd from "modules/personnel/SupplementaryInsurance/deductions/DeductionsAdd";
import SupplementaryInsuranceDeductionsList from "modules/personnel/SupplementaryInsurance/deductions/DeductionsList";
import SupplementaryInsuranceDeductionsEdit from "modules/personnel/SupplementaryInsurance/deductions/DeductionsEdit";
// insurance/supplymetary/contracts
import SupplementaryInsuranceAddPeoplList from "modules/personnel/insurance/mobileInsuranceContracts/AddPeopleList";
import SupplementaryInsuranceViewPeoplList from "modules/personnel/insurance/mobileInsuranceContracts/ViewPeopleList";
import SupplementaryInsuranceContractsList from "modules/personnel/insurance/mobileInsuranceContracts/ContractsList";
import SupplementaryInsuranceSubordinateAdd from "modules/personnel/insurance/mobileInsuranceContracts/SubordinateAdd";
import SupplementaryInsuranceSubordinateEdit from "modules/personnel/insurance/mobileInsuranceContracts/SubordinateEdit";
import SupplementaryInsuranceSubordinateAddNew from "modules/personnel/insurance/mobileInsuranceContracts/SubordinateAddNew";
import SupplementaryInsuranceSubordinateEditNew from "modules/personnel/insurance/mobileInsuranceContracts/SubordinateEditNew";
// insurance/accident
import AccidentInsuranceAdd from "modules/personnel/AccidentInsurance/AccidentInsuranceAdd";
import AccidentInsuranceEdit from "modules/personnel/AccidentInsurance/AccidentInsuranceEdit";
import AccidentInsuranceList from "modules/personnel/AccidentInsurance/AccidentInsuranceList";
import AccidentInsuranceDetail from "modules/personnel/AccidentInsurance/AccidentInsuranceDetail";
import AccidentInsuranceGeneralInfo from "modules/personnel/AccidentInsurance/AccidentInsuranceGeneralInfo";
// insurance/accident/personnel
import AccidentInsurancePersonAdd from "modules/personnel/AccidentInsurance/person/PersonAdd";
import AccidentInsurancePersonList from "modules/personnel/AccidentInsurance/person/PersonList";
import AccidentInsurancePersonHistory from "modules/personnel/AccidentInsurance/person/PersonHistory";
import AccidentInsurancePrintIntroLetter from "modules/personnel/AccidentInsurance/person/PrintIntroLetter";
// insurance/accident/deducations
import AccidentInsuranceDeductionsAdd from "modules/personnel/AccidentInsurance/deductions/DeductionsAdd";
import AccidentInsuranceDeductionsEdit from "modules/personnel/AccidentInsurance/deductions/DeductionsEdit";
import AccidentInsuranceDeductionsList from "modules/personnel/AccidentInsurance/deductions/DeductionsList";
// insurance/thirdParty
import ThirdPartyInsAdd from "modules/personnel/insurance/thirdParty/ThirdPartyInsAdd";
import ThirdPartyInsEdit from "modules/personnel/insurance/thirdParty/ThirdPartyInsEdit";
import ThirdPartyInsList from "modules/personnel/insurance/thirdParty/ThirdPartyInsList";
import ThirdPartyInsView from "modules/personnel/insurance/thirdParty/ThirdPartyInsView";
//home
import WebHome from "modules/home/web/WebHome";
import MobileHome from "./modules/home/mobile/MobileHome";
//auth
import RestPassword from "modules/auth/resetPassword";

import NewLogin from "modules/auth/newLogin/NewLogin";
import MobileLogin from "modules/auth/newLogin/MobileLogin";
import Error from "./pages/Error/Error";
import NotFound from "modules/NotFound";
import PrintIntroLetter from "modules/personnel/SupplementaryInsurance/person/PrintIntroLetter";

import ChartsList from "./modules/personnel/orgCharts/chartsList";
import ChartsForm from "./modules/personnel/orgCharts/chartsForm";
import ChartsView from "./modules/personnel/orgCharts/chartsView";
import ChartsEdit from "./modules/personnel/orgCharts/chartsEdit";
import ResumeList from "./pages/persons/realPerson/resume/ResumeList";
import ResumeView from "./pages/persons/realPerson/resume/ResumeView";

import Hse from "modules/hse/pages";
import Questions from "modules/hse/pages/Questions";
import AddEditQuestion from "modules/hse/pages/Questions/AddEditQuestion";
import Checklist from "modules/hse/pages/Checklist";
import AddEditChecklist from "modules/hse/pages/Checklist/AddEditChecklist";
import Allocate from "modules/hse/pages/Allocate";
import Audit from "modules/hse/pages/Audit";
import AuditAddOrEdit from "modules/hse/pages/Audit/AddEditAudit";
import PerformAnAudit from "modules/hse/pages/Audit/PerformAnAudit";
import AuditDetail from "modules/hse/pages/Audit/AuditDetail";
import AuditPDFRetport from "modules/hse/pages/Audit/PDFReport";
import BoardMembersList from "./modules/personnel/boardMembers/BoardMembersList";
import BoardMemberForm from "modules/personnel/boardMembers/BoardMemberForm";
import BoardMemberView from "./modules/personnel/boardMembers/BoardMemberDetails";
import BoardMemberUpdate from "modules/personnel/boardMembers/BoardMemberUpdate";
import TableName from "modules/task/pages/TableName";
import TableColumn from "modules/task/pages/TableColumn";
import TaskCondition from "modules/task/pages/TaskCondition";
import CreateTaskCondition from "modules/task/pages/TaskCondition/CreateTaskCondition";
import CardBoards from "modules/task/pages/CardBoards";
import Tasks from "modules/task/pages/Tasks";
import TaskDetail from "modules/task/pages/Tasks/TaskDetail";
import CreateTask from "modules/task/pages/Tasks/CreateTask";
// environments
import EnvironmetUsageList from "modules/environment/EnvironmetUsageList";
import EnvironmentList from "modules/environment/enviromentDefinition/EnviromentList";
import EnvironmentsAdd from "modules/environment/enviromentDefinition/EnviromentAdd";
import EnvironmentsView from "modules/environment/enviromentDefinition/EnviromentView";
import EnvironmentsEdit from "modules/environment/enviromentDefinition/EnviromentEdit";
import PermissionsList from "modules/permissions/PermissionsList";
import PersonPermissionsList from "modules/permissions/PersonPermissionsList";
import PersonPermissionsAdd from "modules/permissions/PersonPermissionAdd";
import PrintSalary from "pages/persons/realPerson/list/PrintSalary";

export default [
  // -----------auth---------------
  {
    path: pageNames.auth.login,
    component: NewLogin,
  },

  {
    path: pageNames.auth.resetPassword,
    component: RestPassword,
  },

  // -----------home---------------
  {
    path: pageNames.home.web,
    component: WebHome,
  },
  {
    path: pageNames.home.mobile,
    component: MobileHome,
  },
  // -----------error---------------
  {
    path: pageNames.error,
    component: Error,
  },
  // {
  //
  //   component: NotFound,
  // },

  // -----------printLetter---------------
  {
    path: pageNames.printLetter,
    component: PrintIntroLetter,
  },
  // -----------suggest---------------
  {
    path: pageNames.suggest.auth.signUp,
    component: SuggestionsSignup,
  },
  {
    path: pageNames.suggest.auth.intro,
    component: SuggestionsSignupIntro,
  },
  // -----------suggest/committee---------------
  {
    path: pageNames.suggest.commitee.add,
    component: CommitteeList,
  },
  {
    path: pageNames.suggest.commitee.list,
    component: CommitteeList,
  },
  // -----------suggest/committee/member---------------
  {
    path: pageNames.suggest.commitee.member.add,
    component: CommitteeMemberForm,
  },
  {
    path: pageNames.suggest.commitee.member.edit,
    component: CommitteeMemberForm,
  },
  {
    path: pageNames.suggest.commitee.member.list,
    component: CommitteeMemberList,
  },
  // -----------suggest/assessmentCriteria---------------
  {
    path: pageNames.suggest.assessmentCriteria.add,
    component: AssessmentCriteriaForm,
  },
  {
    path: pageNames.suggest.assessmentCriteria.edit,
    component: AssessmentCriteriaForm,
  },
  {
    path: pageNames.suggest.assessmentCriteria.list,
    component: AssessmentCriteriaList,
  },
  // -----------suggest/rejectionCriteria---------------
  {
    path: pageNames.suggest.rejectionCriteria.add,
    component: RejectionCriteriaForm,
  },
  {
    path: pageNames.suggest.rejectionCriteria.edit,
    component: RejectionCriteriaForm,
  },
  {
    path: pageNames.suggest.rejectionCriteria.list,
    component: RejectionCriteriaList,
  },
  // -----------suggest/category---------------
  {
    path: pageNames.suggest.category.add,
    component: CategoryForm,
  },
  {
    path: pageNames.suggest.category.edit,
    component: CategoryForm,
  },
  {
    path: pageNames.suggest.category.list,
    component: CategoryList,
  },
  // -----------suggest/call---------------
  {
    path: pageNames.suggest.call.add,
    component: CallForm,
  },
  {
    path: pageNames.suggest.call.edit,
    component: CallForm,
  },
  {
    path: pageNames.suggest.call.list,
    component: CallList,
  },

  // -----------suggest/suggestion---------------
  {
    path: pageNames.suggest.suggestion.add,
    component: SuggestionForm,
  },
  {
    path: pageNames.suggest.suggestion.edit,
    component: SuggestionForm,
  },
  {
    path: pageNames.suggest.suggestion.view,
    component: SuggestionDetails,
  },
  {
    path: pageNames.suggest.suggestion.list,
    component: SuggestionList,
  },
  {
    path: pageNames.suggest.suggestion.publicList,
    component: SuggestionList,
  },
  {
    path: pageNames.suggest.suggestion.reject,
    component: SuggestionReject,
  },
  // -----------suggest/problemReport-------------
  {
    path: pageNames.suggest.problem.add,
    component: ProblemReportForm,
  },
  {
    path: pageNames.suggest.problem.edit,
    component: ProblemReportForm,
  },
  {
    path: pageNames.suggest.problem.view,
    component: ProblemReportDetails,
  },
  {
    path: pageNames.suggest.problem.list,
    component: ProblemReportList,
  },
  // -----------suggest/configuration---------------
  {
    path: pageNames.suggest.configuration,
    component: ConfigurationForm,
  },

  // -----------suggest/evaluation---------------
  {
    path: pageNames.suggest.evaluationApply,
    component: EvaluationForm,
  },
  // -----------suggest/forum---------------
  {
    path: pageNames.suggest.forumIndex,
    component: ForumIndex,
  },
  // -----------suggest/report---------------
  {
    path: pageNames.suggest.reportIndex,
    component: ReportIndex,
  },
  // -----------contract---------------
  {
    path: pageNames.contract.add,
    component: ContractAdd,
  },
  {
    path: pageNames.contract.edit,
    component: ContractUpdate,
  },
  {
    path: pageNames.contract.view,
    component: ContractView,
  },
  {
    path: pageNames.contract.list,
    component: ContractList,
  },

  /* ------------------------- HSE ------------------------ */
  {
    path: pageNames.hse.index,
    component: Hse,
  },
  {
    path: pageNames.hse.questions.index,
    component: Questions,
  },
  {
    path: pageNames.hse.questions.addEdit,
    component: AddEditQuestion,
  },
  {
    path: pageNames.hse.checklist.index,
    component: Checklist,
  },
  {
    path: pageNames.hse.checklist.addEdit,
    component: AddEditChecklist,
  },
  {
    path: pageNames.hse.allocate.index,
    component: Allocate,
  },
  {
    path: pageNames.hse.audit.index,
    component: Audit,
  },
  {
    path: pageNames.hse.audit.addEdit,
    component: AuditAddOrEdit,
  },
  {
    path: pageNames.hse.performAnAudit.index,
    component: PerformAnAudit,
  },
  {
    path: pageNames.hse.audit.auditDetail,
    component: AuditDetail,
  },
  {
    path: pageNames.hse.audit.auditReport,
    component: AuditPDFRetport,
  },
  /* ------------------------- HSE ------------------------ */

  /* ------------------------ Task ------------------------ */
  {
    path: pageNames.task.tableName.index,
    component: TableName,
  },

  {
    path: pageNames.task.tableName.columns,
    component: TableColumn,
  },
  {
    path: pageNames.task.taskCondtion.index,
    component: TaskCondition,
  },
  {
    path: pageNames.task.taskCondtion.create,
    component: CreateTaskCondition,
  },
  {
    path: pageNames.task.cardBoards,
    component: CardBoards,
  },
  {
    path: pageNames.task.index,
    component: Tasks,
  },
  {
    path: pageNames.task.detail,
    component: TaskDetail,
  },
  {
    path: pageNames.task.create,
    component: CreateTask,
  },

  /* ------------------------ Task ------------------------ */

  // -----------environment---------------
  {
    path: pageNames.environment.usage,
    component: EnvironmetUsageList,
  },
  {
    path: pageNames.environment.list,
    component: EnvironmentList,
  },
  {
    path: pageNames.environment.add,
    component: EnvironmentsAdd,
  },
  {
    path: pageNames.environment.view,
    component: EnvironmentsView,
  },
  {
    path: pageNames.environment.edit,
    component: EnvironmentsEdit,
  },

  // -----------machinery---------------
  {
    path: pageNames.machinery.add,
    component: MachineAdd,
  },

  {
    path: pageNames.machinery.edit,
    component: MachineEdit,
  },
  {
    path: pageNames.machinery.view,
    component: MachineView,
  },
  {
    path: pageNames.machinery.list,
    component: MachineList,
  },
  {
    path: pageNames.machinery.addGroup,
    component: MachineAddGroup,
  },
  {
    path: pageNames.machinery.addType,
    component: MachineTypeAdd,
  },
  {
    path: pageNames.machinery.addSystem,
    component: MachineSystemAdd,
  },
  {
    path: pageNames.machinery.addTip,
    component: MachineTipAdd,
  },
  // -----------dashboard---------------
  {
    path: pageNames.dashboard.projectProgress,
    component: projectProgress,
  },
  {
    path: pageNames.dashboard.chartReports,
    component: chartReports,
  },
  // -----------dashboard/peyman---------------
  {
    path: pageNames.dashboard.peymanManagement.add,
    component: peymanManagementForm,
  },
  {
    path: pageNames.dashboard.peymanManagement.edit,
    component: peymanManagementForm,
  },
  {
    path: pageNames.dashboard.peymanManagement.view,
    component: peymanManagementForm,
  },
  {
    path: pageNames.dashboard.peymanManagement.list,
    component: peymanList,
  },
  // -----------dashboard/productionReport---------------
  {
    path: pageNames.dashboard.productionReport.add,
    component: ProductionReportForm,
  },
  {
    path: pageNames.dashboard.productionReport.edit,
    component: ProductionReportForm,
  },
  {
    path: pageNames.dashboard.productionReport.view,
    component: ProductionReportForm,
  },
  {
    path: pageNames.dashboard.productionReport.list,
    component: ProductionReportList,
  },
  // -----------personnel/realPerson---------------
  {
    path: pageNames.personnel.realPerson.add,
    component: RealPersonAdd,
  },
  {
    path: pageNames.personnel.realPerson.edit,
    component: RealPersonEdit,
  },
  {
    path: pageNames.personnel.realPerson.view,
    component: RealPersonView,
  },
  {
    path: pageNames.personnel.realPerson.list,
    component: RealPersonList,
  },
  {
    path: pageNames.personnel.realPerson.addGroup,
    component: RealPersonAddGroup,
  },
  {
    path: pageNames.personnel.realPerson.assignShift,
    component: RealPersonAssignShift,
  },
  {
    path: pageNames.personnel.realPerson.subordinate.list,
    component: SubordinateList,
  },
  {
    path: pageNames.personnel.realPerson.subordinate.add,
    component: SubordinateAdd,
  },
  {
    path: pageNames.personnel.realPerson.salary,
    component: PrintSalary,
  },
  // -----------personnel/realPerson/accidentReport---------------
  {
    path: pageNames.personnel.realPerson.accidentReport.add,
    component: AccidentReportAdd,
  },
  {
    path: pageNames.personnel.realPerson.accidentReport.edit,
    component: AccidentReportEdit,
  },
  {
    path: pageNames.personnel.realPerson.accidentReport.view,
    component: AccidentReportDetail,
  },
  {
    path: pageNames.personnel.realPerson.accidentReport.list,
    component: AccidentReportList,
  },
  // -----------personnel/realPerson/service---------------
  {
    path: pageNames.personnel.realPerson.service.add,
    component: ServiceAdd,
  },
  {
    path: pageNames.personnel.realPerson.service.list,
    component: ServiceList,
  },
  // -----------personnel/realPerson/examination---------------
  {
    path: pageNames.personnel.realPerson.examination.add,
    component: ExaminationAdd,
  },
  {
    path: pageNames.personnel.realPerson.examination.list,
    component: ExaminationList,
  },
  {
    path: pageNames.personnel.realPerson.examination.personList,
    component: ExaminationPersonList,
  },
  // -----------personnel/realPerson/checkout---------------
  {
    path: pageNames.personnel.realPerson.checkout.add,
    component: CheckoutAdd,
  },
  {
    path: pageNames.personnel.realPerson.checkout.edit,
    component: CheckoutEdit,
  },
  {
    path: pageNames.personnel.realPerson.checkout.view,
    component: CheckoutDetails,
  },
  {
    path: pageNames.personnel.realPerson.checkout.list,
    component: CheckoutList,
  },
  // -----------personnel/realPerson/recordClaim---------------
  {
    path: pageNames.personnel.realPerson.recordClaim.add,
    component: RecordClaimAdd,
  },
  {
    path: pageNames.personnel.realPerson.recordClaim.edit,
    component: RecordClaimEdit,
  },
  {
    path: pageNames.personnel.realPerson.recordClaim.view,
    component: RecordClaimDetail,
  },
  {
    path: pageNames.personnel.realPerson.recordClaim.list,
    component: RecordClaimList,
  },
  // -----------personnel/realPerson/leaveRequest---------------
  {
    path: pageNames.personnel.realPerson.leaveRequest.add,
    component: LeaveRequestAdd,
  },
  {
    path: pageNames.personnel.realPerson.leaveRequest.edit,
    component: LeaveRequestEdit,
  },
  {
    path: pageNames.personnel.realPerson.leaveRequest.view,
    component: LeaveRequestView,
  },
  {
    path: pageNames.personnel.realPerson.leaveRequest.list,
    component: LeaveRequestList,
  },
  // -----------personnel/realPerson/loanRequest---------------
  {
    path: pageNames.personnel.realPerson.loanRequest.add,
    component: LoanRequestAdd,
  },
  {
    path: pageNames.personnel.realPerson.loanRequest.edit,
    component: LoanRequestEdit,
  },
  {
    path: pageNames.personnel.realPerson.loanRequest.view,
    component: LoanRequestView,
  },
  {
    path: pageNames.personnel.realPerson.loanRequest.list,
    component: LoanRequestList,
  },
  // -----------personnel/realPerson/mission---------------
  {
    path: pageNames.personnel.realPerson.mission.add,
    component: MissionAdd,
  },
  {
    path: pageNames.personnel.realPerson.mission.edit,
    component: MissionEdit,
  },
  {
    path: pageNames.personnel.realPerson.mission.view,
    component: MissionView,
  },
  {
    path: pageNames.personnel.realPerson.mission.list,
    component: MissionList,
  },
  // -----------personnel/rightfull---------------
  {
    path: pageNames.personnel.rightFull.add,
    component: RightFullAdd,
  },
  {
    path: pageNames.personnel.rightFull.edit,
    component: RightFullEdit,
  },
  {
    path: pageNames.personnel.rightFull.view,
    component: RightFullView,
  },
  {
    path: pageNames.personnel.rightFull.list,
    component: RightFullList,
  },
  {
    path: pageNames.personnel.rightFull.addGroup,
    component: RightFullAddGroup,
  },
  // -----------personnel/doctor---------------
  {
    path: pageNames.personnel.doctor.add,
    component: DoctorAdd,
  },
  {
    path: pageNames.personnel.doctor.edit,
    component: DoctorEdit,
  },
  {
    path: pageNames.personnel.doctor.list,
    component: DoctorList,
  },
  // -----------personnel/annualSetting---------------
  {
    path: pageNames.personnel.annualSetting.add,
    component: AnnualSettingAdd,
  },
  {
    path: pageNames.personnel.annualSetting.edit,
    component: AnnualSettingEdit,
  },
  {
    path: pageNames.personnel.annualSetting.view,
    component: AnnualSettingView,
  },
  {
    path: pageNames.personnel.annualSetting.list,
    component: AnnualSettingList,
  },
  // -----------personnel/jobs---------------
  {
    path: pageNames.personnel.jobs.list,
    component: JobList,
  },
  {
    path: pageNames.personnel.jobs.calender,
    component: JobCalendar,
  },

  // -----------personnel/orgCharts---------------
  {
    path: pageNames.personnel.orgCharts.list,
    component: ChartsList,
  },
  {
    path: pageNames.personnel.orgCharts.add,
    component: ChartsForm,
  },
  {
    path: pageNames.personnel.orgCharts.edit,
    component: ChartsEdit,
  },
  {
    path: pageNames.personnel.orgCharts.view,
    component: ChartsView,
  },
  // -----------personnel/shiftWork---------------
  {
    path: pageNames.personnel.shiftWork.add,
    component: ShiftworkAdd,
  },
  {
    path: pageNames.personnel.shiftWork.edit,
    component: ShiftworkAdd,
  },
  {
    path: pageNames.personnel.shiftWork.list,
    component: ShiftworkList,
  },

  // ----------- personnel/resume ------------
  {
    component: ResumeList,
    path: pageNames.personnel.realPerson.resume.list,
  },
  {
    component: ResumeView,
    path: pageNames.personnel.realPerson.resume.view,
  },

  // ----------- personnel/board members ------------
  {
    component: BoardMembersList,
    path: pageNames.personnel.boardMembers.list,
  },
  {
    component: BoardMemberForm,
    path: pageNames.personnel.boardMembers.add,
  },
  {
    component: BoardMemberUpdate,
    path: pageNames.personnel.boardMembers.edit,
  },
  {
    component: BoardMemberView,
    path: pageNames.personnel.boardMembers.view,
  },
  // -----------insurance/tamin---------------
  {
    path: pageNames.personnel.insurance.tamin.add,
    component: SocialInsuranceAdd,
  },
  {
    path: pageNames.personnel.insurance.tamin.list,
    component: SocialInsuranceList,
  },
  {
    path: pageNames.personnel.insurance.tamin.print,
    component: SocialInsurancePrint,
  },
  {
    path: pageNames.personnel.insurance.tamin.printDisket,
    component: PrintDisketList,
  },
  {
    path: pageNames.personnel.insurance.tamin.personnelReport,
    component: SocialInsurancePersonnelReport,
  },
  {
    path: pageNames.personnel.insurance.tamin.personnelReportPrint,
    component: SocialInsurancePersonnelReportPrint,
  },
  // -----------insurance/tamin/payment---------------
  {
    path: pageNames.personnel.insurance.tamin.payment.edit,
    component: SocialInsurancPaymentEdit,
  },
  {
    path: pageNames.personnel.insurance.tamin.payment.view,
    component: SocialInsurancPaymentDetail,
  },
  {
    path: pageNames.personnel.insurance.tamin.payment.list,
    component: SocialInsurancPaymentList,
  },
  // -----------insurance/tamin/personnel---------------
  {
    path: pageNames.personnel.insurance.tamin.personnel.add,
    component: SocialInsurancePersonnelAdd,
  },
  {
    path: pageNames.personnel.insurance.tamin.personnel.list,
    component: SocialInsurancePersonnelList,
  },
  // -----------insurance/supplymentary---------------
  {
    path: pageNames.personnel.insurance.supplymentary.add,
    component: SupplementaryInsuranceAdd,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.edit,
    component: SupplementaryInsuranceEdit,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.view,
    component: SupplementaryInsuranceDetail,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.list,
    component: SupplementaryInsuranceList,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.generalInfo,
    component: SupplementaryInsuranceGeneralInfo,
  },
  // -----------insurance/supplymentary/personnel---------------
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.add,
    component: SupplementaryInsurancePersonAdd,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.list,
    component: SupplementaryInsurancePersonList,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.history,
    component: SupplementaryInsurancePersonHistory,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.printIntro,
    component: SupplementaryInsurancePrintIntroLetter,
  },
  // -----------insurance/supplymentary/personnel/deducation---------------
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.deucation.add,
    component: SupplementaryInsuranceDeductionsAdd,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.deucation.edit,
    component: SupplementaryInsuranceDeductionsEdit,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.personnel.deucation.list,
    component: SupplementaryInsuranceDeductionsList,
  },
  // -----------insurance/supplymentary/personnel/contracts---------------
  {
    path: pageNames.personnel.insurance.supplymentary.contracts.add,
    component: SupplementaryInsuranceAddPeoplList,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.contracts.view,
    component: SupplementaryInsuranceViewPeoplList,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.contracts.list,
    component: SupplementaryInsuranceContractsList,
  },
  {
    path: pageNames.personnel.insurance.supplymentary.contracts.subordinate.add,
    component: SupplementaryInsuranceSubordinateAdd,
  },
  {
    path:
      pageNames.personnel.insurance.supplymentary.contracts.subordinate.edit,
    component: SupplementaryInsuranceSubordinateEdit,
  },
  {
    path:
      pageNames.personnel.insurance.supplymentary.contracts.subordinate.addNew,
    component: SupplementaryInsuranceSubordinateAddNew,
  },
  {
    path:
      pageNames.personnel.insurance.supplymentary.contracts.subordinate.editNew,
    component: SupplementaryInsuranceSubordinateEditNew,
  },
  // -----------insurance/accident---------------
  {
    path: pageNames.personnel.insurance.accident.add,
    component: AccidentInsuranceAdd,
  },
  {
    path: pageNames.personnel.insurance.accident.edit,
    component: AccidentInsuranceEdit,
  },
  {
    path: pageNames.personnel.insurance.accident.view,
    component: AccidentInsuranceDetail,
  },
  {
    path: pageNames.personnel.insurance.accident.list,
    component: AccidentInsuranceList,
  },
  {
    path: pageNames.personnel.insurance.accident.generalInfo,
    component: AccidentInsuranceGeneralInfo,
  },
  // -----------insurance/accident/personnel---------------
  {
    path: pageNames.personnel.insurance.accident.personnel.add,
    component: AccidentInsurancePersonAdd,
  },
  {
    path: pageNames.personnel.insurance.accident.personnel.list,
    component: AccidentInsurancePersonList,
  },
  {
    path: pageNames.personnel.insurance.accident.personnel.history,
    component: AccidentInsurancePersonHistory,
  },
  {
    path: pageNames.personnel.insurance.accident.personnel.printIntro,
    component: AccidentInsurancePrintIntroLetter,
  },
  // -----------insurance/accident/personnel/deducation---------------
  {
    path: pageNames.personnel.insurance.accident.personnel.deducation.add,
    component: AccidentInsuranceDeductionsAdd,
  },
  {
    path: pageNames.personnel.insurance.accident.personnel.deducation.edit,
    component: AccidentInsuranceDeductionsEdit,
  },
  {
    path: pageNames.personnel.insurance.accident.personnel.deducation.list,
    component: AccidentInsuranceDeductionsList,
  },
  // -----------personnel/insurance/thirdParty---------------
  {
    path: pageNames.personnel.insurance.thirdPartyIns.add,
    component: ThirdPartyInsAdd,
  },
  {
    path: pageNames.personnel.insurance.thirdPartyIns.edit,
    component: ThirdPartyInsEdit,
  },
  {
    path: pageNames.personnel.insurance.thirdPartyIns.view,
    component: ThirdPartyInsView,
  },
  {
    path: pageNames.personnel.insurance.thirdPartyIns.list,
    component: ThirdPartyInsList,
  },
  // -----------permissions---------------
  {
    path: pageNames.permissions.list,
    component: PermissionsList,
  },
  {
    path: pageNames.permissions.person.list,
    component: PersonPermissionsList,
  },
  {
    path: pageNames.permissions.person.add,
    component: PersonPermissionsAdd,
  },
];
