import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min, ValidateIf, ValidateNested } from "class-validator";
import { HSEGroup } from "src/common/enums/hse-group.enum";
import { HSEChecklistType } from "src/common/enums/hse-checklist-type.enum";

export class HSECreateChecklistDTO { 

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
    questions: [HSECheckListQuestionDTO];

    @IsEnum(HSEChecklistType)
    type: string;

    @IsNumber()
    minimumPoint: number;
}


export class HSECheckListQuestionDTO {  

    @Min(1)
    @Max(3)
    weight_factor: number;

    @IsNumber()
    questionId: number;

    @IsOptional()
    critical: string;

    @IsOptional()
    requirements: string;

    @IsOptional()
    description: string;
}