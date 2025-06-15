import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Max, Min, ValidateNested } from "class-validator";

export class CreateHSEAuditDTO { 

    @IsNotEmpty()
    date: Date;

    @IsOptional()
    @IsNumber()
    personnel_id_fk: number;

    @IsOptional()
    @IsNumber()
    vehicle_id_fk: number;

    @IsOptional()
    @IsNumber()
    environment_id_fk: number;

    @IsOptional()
    @IsNumber()
    troubleshooter_id_fk: number;

    @IsOptional()
    description: string;

    @IsOptional()
    @ValidateNested({ each: true})
    @Type(() => HSEAuditQuestionDTO)
    questions: HSEAuditQuestionDTO[];

    @IsOptional()
    @IsBoolean()
    draft: boolean;

    @IsNumber()
    minimumPoint: number;
}

export class HSEAuditQuestionDTO {  

    @IsNumber()
    questionId: number;

    @IsNotEmpty()
    question: string;

    @IsOptional()
    answer: string;

    @Min(1)
    @Max(3)
    weight_factor:number;

    @IsOptional()
    critical: string;

    @IsOptional()
    requirements: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    group: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    code: string;

    @IsOptional()
    isNotRelated: boolean;

    @IsOptional()
    operatorDescription: string;

    @IsBoolean()
    isReverse:boolean;
}