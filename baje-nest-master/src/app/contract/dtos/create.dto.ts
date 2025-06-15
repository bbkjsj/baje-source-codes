import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class CreateContractDTO {

    @IsNotEmpty()
    companyId: number;


    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    subject: string;

    @IsOptional()
    @IsDateString()
    contractDate: string;

    @IsOptional()
    employer: string;

    @IsOptional()
    contractNumber: string;

    @IsOptional()
    contractor: string;

    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsNumber()
    initialAmount: number;

    @IsOptional()
    workshopCode: string;

    @IsOptional()
    row: string;

    @IsOptional()
    @IsNumber()
    consultantCompanyId: number;

    @IsOptional()
    @IsNumber()
    managerId: number;


    @IsOptional()
    @IsNumber()
    employerId: number;

    @IsOptional()
    @IsNumber()
    bossId: number;

    @IsOptional()
    contractorType: string;

    @IsOptional()
    @IsNumber()
    contractorId: number;

    @IsOptional()
    @IsNumber()
    mainContractId: number;

    @IsOptional()
    activity: string;


    @IsEnum(['EPC', 'EP', 'threeOperators', 'twoOperators'])
    contractType: string;

    @IsOptional()
    @IsNumber()
    environmentId: number;

    @IsOptional()
    @IsNumber()
    priceList: number;

    @IsOptional()
    @IsNumber()
    adjustmentBaseIndex: number;

    @IsOptional()
    @IsNumber({}, { each: true })
    priceListParts: number[];

    @IsOptional()
    @IsNumber()
    timeWeight: number;

    @IsOptional()
    @IsNumber()
    rialWeight: number;
}