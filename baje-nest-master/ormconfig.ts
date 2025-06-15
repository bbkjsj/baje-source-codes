import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

import { PersonnelAccess } from './src/app/personnel/schemas/personnel-access.schema';
import { Subordinate } from './src/app/personnel/schemas/subordinate.schema';
import { JobTitle } from './src/app/jobTitle/schemas/job-title.schema';
import { DamageService } from './src/app/damageService/schemas/damageService.schema';
import { TimeOff } from './src/app/timeOff/schemas/timeoff.schema';
import { PersonnelIncident } from './src/app/incident/schemas/incident.schema';
import { PersonnelImprest } from './src/app/imprest/schemas/imprest.schema';
import { PersonnelMission } from './src/app/mission/schemas/mission.schema';
import { InsuranceTakmiliPersonnelSchema } from './src/app/insurance/takmili/schemas/takmili.schema';
import { InsuranceHistoryClaim } from './src/app/insurance/history-claim/schemas/history-claim.schema';
import { Insurance } from './src/app/insurance/schemas/insurance.schema';
import { Settle } from './src/app/settle/schemas/settle.schema';
import { InsuranceTaminPersonnel } from './src/app/insurance/tamin/schemas/tamin-personnel.schema';
import { DoctorVisit } from './src/app/doctorVisit/schemas/visit.schema';
import { ContractProgress } from './src/app/contractProgress/schemas/contractProgress.schema';
import { ContractProductionReport } from './src/app/contractProductionReport/schemas/contractProductionReport.schema';
import { ContractPeymanReport } from './src/app/contractPeymanReport/schemas/contractPeymanReport.schema';
import { Contract } from './src/app/contract/schemas/contract.schema';
import { HSEQuestion } from './src/app/hse/schemas/question.schema';
import { Job } from './src/app/jobs/schemas/job.schema';
import { VehicleType } from './src/app/vehicle/schemas/vehicle-type.schema';
import { HSEChecklist } from './src/app/hse/schemas/checklist.schema';
import { HSEChecklistQuestion } from './src/app/hse/schemas/checklist-questions.schema';
import { HSEAllocateQuestion } from './src/app/hse/schemas/allocate-question.schema';
import { Vehicle } from './src/app/vehicle/schemas/vehicle.schema';
import { HSEAudit } from './src/app/hse/schemas/hse-audit.schema';
import { HSEAuditQuestion } from './src/app/hse/schemas/audit-question.schema';
import { JobPermission } from './src/app/jobs/schemas/job_permission.schema';
import { JobsTaminCode } from './src/app/jobs/schemas/job_tamin_code.schema';
import { JobsShift } from './src/app/jobs/schemas/job_shift.schema';
import { JobsShiftPattern } from './src/app/jobs/schemas/job_shift_pattern.schema';
import { JobChart } from './src/app/jobs/schemas/job_chart.schema';
import { JobChartNode } from './src/app/jobs/schemas/job_chart_node.schema';
import { PersonnelShift } from './src/app/personnel/schemas/personnel-shift.schema';
import { PersonnelJobs } from './src/app/personnel/schemas/personnel-jobs.schema';
import { CompanyBoardMember } from './src/app/company/schemas/company-borad-member.schema';
import { Personnel } from './src/app/personnel/schemas/personnel.schema';
import { Task } from 'src/app/tasks/schemas/task.schema';
import { TaskMember } from 'src/app/tasks/schemas/task-member.schema';
import { TableName } from 'src/app/table-name/schemas/table-name.schema';
import { ColumnName } from 'src/app/table-name/schemas/column-name.schema';
import { TaskCondition } from 'src/app/tasks/schemas/task-condition.schema';
import { TestTable } from 'src/app/tasks/schemas/test-table.schema';
import { TasksScheduleDaily } from 'src/app/tasks/schemas/task-schedule-daily.schema';
import { TasksScheduleMonthly } from 'src/app/tasks/schemas/task-schedule-monthly.schema';
import { TasksScheduleYearly } from 'src/app/tasks/schemas/tasks-schedule-yearly.schema';
import { TasksToInform } from 'src/app/tasks/schemas/task-toinform.schema';
import { TasksScheduleWeekly } from 'src/app/tasks/schemas/task-schedule-weekly.schema';
import { TasksSMSNotification } from 'src/app/tasks/schemas/task-sms-notification.schema';
import { TaskApprover } from 'src/app/tasks/schemas/task-approver.schema';
import { TasksNotMyDuty } from 'src/app/tasks/schemas/task-notmyduty.schema';
import { Permission } from 'src/app/permission/schemas/permission.schema';
import { EnvironmentUsageSchema } from 'src/app/environment/schemas/environment-usage.schema';
import { VehicleSystem } from 'src/app/vehicle/schemas/vehicle-system.schema';
import { VehicleStyle } from 'src/app/vehicle/schemas/vehicle-style.schema';
import { ThirdPartyInsurance } from 'src/app/insurance/third-party/schemas/third-party-insurance.schema';
import { EnvironmentSchema } from 'src/app/environment/schemas/environment.schema';
import { FamilySchema } from 'src/app/family/schemas/family.schema';
import { FamilyTreeSchema } from 'src/app/family/schemas/family-tree.schema';
import { AccessSchema } from 'src/app/access/access.schema';
import { AccessPrerequisiteSchema } from 'src/app/access/access-prerequisite.schema';
import { AccessPersonnelSchema } from 'src/app/access/access-personnel.schema';
import { CompanySchema } from 'src/app/company/schemas/company.entity';
import { SurveySchema } from 'src/app/survey/schemas/survey.schema';
import { SurveyWorkgroupPersonnelSchema } from 'src/app/survey/schemas/survey-workgroup-personnel.schema';
import { SurveySettingSchema } from 'src/app/survey/schemas/survey-setting.schema';
import { SurveyExecutionSchema } from 'src/app/survey/schemas/survey-execution.schema';
import { DataSynchronizationSchema } from './src/app/data-synchronization/schemas/data-synchronization.schema';
import { TaskForward } from "./src/app/tasks/schemas/task-forward.schema";

const config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DBADDRESS,
  port: 3306,
  username: process.env.DB_USERNAME, //'bajedb_user',
  password: 'HWFSzN&CFwU^zgq',
  database: process.env.DB_DATABASE, //'bjdb',
  charset: 'UTF8_PERSIAN_CI',
  entities: [
    Personnel,
    PersonnelAccess,
    Subordinate,
    JobTitle,
    DamageService,
    TimeOff,
    PersonnelIncident,
    PersonnelImprest,
    PersonnelMission,
    PersonnelShift,
    PersonnelJobs,
    InsuranceTakmiliPersonnelSchema,
    InsuranceHistoryClaim,
    Insurance,
    Settle,
    InsuranceTaminPersonnel,
    DoctorVisit,
    ContractProgress,
    ContractProductionReport,
    ContractPeymanReport,
    Contract,
    HSEQuestion,
    HSEChecklist,
    HSEChecklistQuestion,
    HSEAllocateQuestion,
    HSEAudit,
    HSEAuditQuestion,
    Job,
    JobPermission,
    JobsTaminCode,
    JobsShift,
    JobsShiftPattern,
    JobChart,
    JobChartNode,
    VehicleType,
    Vehicle,
    VehicleSystem,
    VehicleStyle,
    CompanySchema,
    CompanyBoardMember,
    Task,
    TaskMember,
    TaskCondition,
    TasksScheduleDaily,
    TasksScheduleWeekly,
    TasksScheduleMonthly,
    TasksScheduleYearly,
    TasksToInform,
    TasksSMSNotification,
    TaskApprover,
    TasksNotMyDuty,
    TaskForward,
    TableName,
    ColumnName,
    TestTable,
    Permission,
    EnvironmentUsageSchema,
    EnvironmentSchema,
    ThirdPartyInsurance,
    FamilySchema,
    FamilyTreeSchema,
    AccessSchema,
    AccessPrerequisiteSchema,
    AccessPersonnelSchema,
    SurveySchema,
    SurveyWorkgroupPersonnelSchema,
    SurveySettingSchema,
    SurveyExecutionSchema,
    CompanySchema,
    DataSynchronizationSchema,
  ],
  synchronize: false,
};
export = config;
