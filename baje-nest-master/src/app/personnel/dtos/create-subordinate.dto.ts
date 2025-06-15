import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Relation } from "src/common/enums/relation.enum";

export class CreateSubordinateDTO {


    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name:string;

    @IsNotEmpty()
    national_code: string;

    @IsEnum(Relation)
    relation: string;

    @IsNotEmpty()
    father_name: string;

    @IsOptional()
    @IsString()
    id_number: string;

    @IsOptional()
    @IsString()
    issue_place: string;

    @IsOptional()
    @IsString()
    dependency_status: string;

    @IsOptional()
    @IsString()
    birth_date: string;

    @IsOptional()
    @IsBoolean()
    reverse_dependency: boolean;

    @IsOptional()
    @IsString()
    dependency_quit_reason: string;
}