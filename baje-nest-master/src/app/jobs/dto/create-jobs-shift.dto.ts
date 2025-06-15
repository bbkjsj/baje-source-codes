import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class CreateJobsShiftDTO { 

    @IsNotEmpty()
    title: string;

    @IsBoolean()
    enabled: boolean;

    @IsNumber()
    numberOfTimeOffDays: number;

    @IsEnum(['day', 'week', 'month', 'year'])
    timespan: string;

    @IsBoolean()
    calculatePublicHolidays: boolean;

    @IsBoolean()
    calculateExtraWork: boolean;

    @IsBoolean()
    calculateOffWork: boolean;

    @IsBoolean()
    calculateNight: boolean;

    @IsBoolean()
    calculateFriday: boolean;

    @IsBoolean()
    publicHolidaysAreOff: boolean;

    @IsArray()
    @ValidateNested({ each: true})
    @Type(() => JobShiftPatternDTO)
    patterns: [JobShiftPatternDTO];
}


export class JobShiftPatternDTO { 

    @IsEnum(['work', 'rest'])
    status: string;

    @IsNumber()
    days: number;

    @IsOptional()
    from: string;

    @IsOptional()
    to: string;
}