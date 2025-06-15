import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";
import { CompanyBoardMemberRole } from "src/common/enums/company-board-member.enum";
import { SignatureRight } from "src/common/enums/signature-rights.enum";

export class CreateBoardMemberDTO { 

    @IsNumber()
    company_id_fk: number;

    @IsNumber()
    personnel_id_fk: number;

    @IsEnum(CompanyBoardMemberRole)
    role: CompanyBoardMemberRole;

    @IsDateString()
    from_date: string;

    @IsDateString()
    to_date: string;

    @IsEnum(SignatureRight, { each: true})
    signature_rights: string;

    @IsOptional()
    description: string;

    @IsBoolean()
    enabled: boolean;
}