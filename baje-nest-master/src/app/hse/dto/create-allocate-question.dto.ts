import { IsArray, IsEnum, IsNotEmpty, IsNotIn, IsNumber, IsOptional, Max, Min } from "class-validator";
import { HSERateType } from "src/common/enums/hse-rate-type.enum";

export class HSECreateAllocateQuestion { 

    @IsArray()
    questionIds: number[];

    @IsOptional()
    @IsNumber()
    personnelId: number;

    @IsOptional()
    @IsNumber()
    vehicleId: number;

    @IsOptional()
    @IsNumber()
    environmentId: number;

    @IsNotEmpty()
    fromDate: Date;

    @IsOptional()
    toDate: Date;


    @Min(1)
    @Max(3)
    weightFactor: number;

    @IsOptional()
    requirements: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    critical: string;
}