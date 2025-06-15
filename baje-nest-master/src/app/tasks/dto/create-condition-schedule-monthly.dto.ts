import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateConditionScheduleMonthly {

    @IsDateString()
    startDate: Date;

    @IsString()
    month: string;
}