import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { JobShiftPatternDTO } from "./create-jobs-shift.dto";

export class UpdateJobsShiftDTO {

    @IsOptional()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsBoolean()
    enabled: boolean;

    @IsOptional()
    @IsNumber()
    numberOfTimeOffDays: number;

    @IsOptional()
    @IsEnum(['day', 'week', 'month', 'year'])
    timespan: string;

    @IsOptional()
    @IsBoolean()
    calculatePublicHolidays: boolean;

    @IsOptional()
    @IsBoolean()
    calculateExtraWork: boolean;

    @IsOptional()
    @IsBoolean()
    calculateOffWork: boolean;

    @IsOptional()
    @IsBoolean()
    calculateNight: boolean;

    @IsOptional()
    @IsBoolean()
    publicHolidaysAreOff: boolean;

    @IsOptional()
    @IsBoolean()
    calculateFriday: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => JobShiftPatternDTO)
    patterns: [JobShiftPatternDTO];
}