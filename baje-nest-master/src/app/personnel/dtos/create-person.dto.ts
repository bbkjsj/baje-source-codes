import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ArmyService } from "src/common/enums/army-service.enum";
import { Gender } from "src/common/enums/gender.enum";
import { JobStatus } from "src/common/enums/job-status.enum";
import { JobType } from "src/common/enums/job-type.enum";
import { MaritalStatus } from "src/common/enums/marital-status.enum";
import { PersonnelStatus } from 'src/common/enums/personnel-status.enum';
import { CreatePersonnelAccessDTO } from "./create-personnel-access.dto";
import { CreateSubordinateDTO } from "./create-subordinate.dto";

export class CreatePersonDTO {

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    father_name: string;

    @IsNotEmpty()
    id_number: string;

    @IsEnum(Gender)
    sex: string;

    @IsNotEmpty()
    birth_place: string;

    @IsNotEmpty()
    nation: string;

    @IsNotEmpty()
    national_number: string;

    @IsOptional()
    password: string;


    @IsOptional()
    contract_id: string;


    @IsOptional()
    mobile1: string;

    mobile2:string;

    id_issue_place:string;
    public_description: string;
    private_description: string;

    @IsEnum(MaritalStatus)
    @IsOptional()
    marital_status: string;


    @IsOptional()
    @IsString()
    army_service: string;

    education_name: string;
    job_code:string;
    insurance_number:string;
    personnel_id: string;

    @IsEnum(JobType)
    @IsOptional()
    job_type: string;

    @IsEnum(JobStatus)
    @IsOptional()
    job_status: string;

    phone: string;
    email: string;

    bank_account1: string;
    sheba1: string;
    bank_name1: string;

    bank_account2: string;
    sheba2: string;
    bank_name2: string;

    bank_account3: string;
    sheba3: string;
    bank_name3: string;

    bank_account4: string;
    sheba4: string;
    bank_name4: string;

    bank_account5: string;
    sheba5: string;
    bank_name5: string;

    company_id: number;
    address: string;
    expire_reason: string;
    expire_time: string;
    study_field: string;
    postal_code: string;


    @IsOptional()
    isargar: string;


    shahid_name: string;
    veteran_percentage: number;
    frontline_year: number;
    frontline_month: number;
    frontline_day: number;

    @IsEnum(['true', 'false'])
    @IsOptional()
    shahid_was_colleague: boolean;

    captivity_year: number;
    captivity_month: number;
    captivity_day: number;

    history_total_day: number;
    insurance_share_employee: number;
    insurance_share_employer: number;
    insurance_share_unemployment: number;
    insurance_share_harmful: number;
    employeement_date: string;
    contract_start_date: string;
    contract_end_date: string;
    employeement_type: string;

    @IsArray()
    @ValidateNested({ each: true})
    @Type(()=> CreateSubordinateDTO)
    @IsOptional()
    subordinates: CreateSubordinateDTO[];


    @IsOptional()
    @ValidateNested({ each: true })
    @IsArray()
    @Type(()=> CreatePersonnelAccessDTO)
    permissions: CreatePersonnelAccessDTO[];

    job_title_id: number;
    job_title: string;

    @IsOptional()
    @IsEnum(PersonnelStatus)
    status: PersonnelStatus;
}