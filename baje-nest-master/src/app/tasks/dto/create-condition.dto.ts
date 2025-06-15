import { Type } from "class-transformer";
import {
    IsArray,
    IsDate, IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateNested
} from "class-validator";
import { TaskApproveSequence } from "src/common/enums/task-approve-sequence.enum";
import { TaskDoneCondition } from "src/common/enums/task-done-condition.enum";
import { FailedTaskType } from "src/common/enums/task-failed.enum";
import { TaskPriority } from "src/common/enums/task-priority.enum";
import { TaskPunishment } from "src/common/enums/task-punishment.enum";
import { TasksSMSNotificationType } from "src/common/enums/tasks-sms-notification.enum";
import { CreateConditionScheduleDaily } from "./create-condition-schedule-daily.dto";
import { CreateConditionScheduleMonthly } from "./create-condition-schedule-monthly.dto";
import { CreateConditionScheduleWeekly } from "./create-condition-schedule-weekly.dto";
import { CreateConditionScheduleYearly } from "./create-condition-schedule-yearly.dto";

export class CreateTaskConditionDTO { 

    @IsOptional()
    tableId: string;

    @IsOptional()
    condition: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsString()
    secondsAfterCreate: string;

    @IsEnum(FailedTaskType)
    ifTaskFailed: string;

    @IsString()
    point: string;

    @IsString()
    negativePoint: string;

    @IsOptional()
    @IsString({each: true})
    personnelMembers: string[];

    @IsOptional()
    @IsString({ each: true })
    personnelToInform: string[];

    @IsOptional()
    @IsString({each: true})
    jobs: string[];


    @IsEnum(['0', '1'])
    enable: string;

    @IsEnum(TaskPriority)
    priority: string;

    @IsEnum(TaskPunishment)
    punishment: string;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => CreateConditionScheduleDaily)
    dailySchedule: CreateConditionScheduleDaily[];

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => CreateConditionScheduleWeekly)
    weeklySchedule: CreateConditionScheduleWeekly[];

    @IsOptional()
    @IsArray()
    @IsDateString({}, { each: true })
    monthlySchedule: CreateConditionScheduleMonthly[];

    @IsOptional()
    @IsArray()
    @IsDateString({}, { each: true })
    yearlySchedule: CreateConditionScheduleYearly[];

    @IsOptional()
    @IsEnum(TasksSMSNotificationType, {each:true})
    smsNotification: TasksSMSNotificationType;

    @IsOptional()
    pageUrl: string;

    @IsOptional()
    @IsString()
    approverJobsId: string[];

    @IsOptional()
    @IsEnum(TaskApproveSequence)
    approveJobsSequence: string;

    @IsOptional()
    @IsEnum(TaskDoneCondition)
    approveCondition: string;

    @IsOptional()
    @IsString()
    approvePersonnelId: string;

    @IsOptional()
    @IsEnum(['0', '1'])
    referable: string;
}