import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { TaskApproveSequence } from "src/common/enums/task-approve-sequence.enum";
import { TaskDoneCondition } from "src/common/enums/task-done-condition.enum";
import { FailedTaskType } from "src/common/enums/task-failed.enum";
import { TaskPriority } from "src/common/enums/task-priority.enum";
import { TaskPunishment } from "src/common/enums/task-punishment.enum";
import { TaskStatus } from "src/common/enums/task-status.enum";
import { TaskType } from "src/common/enums/task-type.enum";
import { TasksSMSNotificationType } from "src/common/enums/tasks-sms-notification.enum";

export class CreateTaskDTO {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description:  string;

    @IsEnum(TaskType)
    taskType: string;

    @IsNumber()
    @IsOptional()
    relatedTask: number;

    @IsOptional()
    @IsDateString()
    dueDate: Date;

    @IsOptional()
    @IsEnum(FailedTaskType)
    ifTaskFailed: string;

    @IsNumber()
    point: number;

    @IsNumber()
    negativePoint: number;

    @IsOptional()
    @IsEnum(TaskStatus)
    status: string;

    @IsNumber({}, {each: true})
    members: number[];

    @IsOptional()
    @IsEnum(TaskPriority)
    priority: string;

    @IsOptional()
    @IsEnum(TaskPunishment)
    punishment: string;

    @IsOptional()
    pageUrl: string;

    @IsOptional()
    @IsEnum(TaskDoneCondition)
    approveCondition: string;

    @IsOptional()
    @IsNumber({}, {each: true})
    approverJobsId: number[];

    @IsOptional()
    @IsEnum(TaskApproveSequence)
    approveJobsSequence: string;

    @IsOptional()
    @IsNumber()
    approverPersonnelId: number;

    @IsOptional()
    @IsNumber({}, {each: true})
    personnelToInform: number[]|null;

    @IsOptional()
    @IsEnum(TasksSMSNotificationType, {each: true})
    smsNotification: TasksSMSNotificationType[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    referable:number;

    @IsOptional()
    @IsString()
    attachmentDescription?: string;

    @IsOptional()
    @IsString()
    fileUrl?: string;
}
