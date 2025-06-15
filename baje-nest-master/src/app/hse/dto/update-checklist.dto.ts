import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { HSEChecklistType } from "src/common/enums/hse-checklist-type.enum";
import { HSEGroup } from "src/common/enums/hse-group.enum";
import { HSECheckListQuestionDTO } from "./create-checklist.dto";



export class HSEUpdateChecklistDTO { 
    @IsOptional()
    @IsEnum(HSEGroup)
    group: string;

    @IsOptional()
    @IsNumber()
    environmentId: number;

    @IsOptional()
    @IsNumber()
    jobsId: number;

    @IsOptional()
    @IsNumber()
    vehicleTypeId: number;

    @IsOptional()
    comment: string;

    @ValidateNested({ each: true})
    @Type(() => HSECheckListQuestionDTO)
    questions: HSECheckListQuestionDTO[];

    @IsEnum(HSEChecklistType)
    type: string;
}