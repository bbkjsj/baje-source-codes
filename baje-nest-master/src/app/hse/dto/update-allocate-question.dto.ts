import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { HSERateType } from "src/common/enums/hse-rate-type.enum";

export class HSEUpdateAllocateQuestion { 

    @IsNumber()
    questionId: number;

    @IsOptional()
    @IsNumber()
    personnelId: number;

    @IsOptional()
    @IsNumber()
    vehicleId: number;

    @IsOptional()
    @IsNumber()
    environmentId: number;

    @IsOptional()
    fromDate: Date;

    @IsOptional()
    toDate: Date;


    @IsOptional()
    @Min(1)
    @Max(3)
    weightFactor: number;

    @IsOptional()
    requirements: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsEnum(HSERateType)
    critical: string;
}