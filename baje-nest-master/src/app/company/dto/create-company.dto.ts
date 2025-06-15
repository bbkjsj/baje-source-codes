import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    registerNumber: string;


    @IsNotEmpty()
    @IsString()
    nationalId: string;


    @IsNotEmpty()
    @IsString()
    registerDate: string;

    @IsOptional()
    @IsString()
    financeCode: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    postalCode: string;

    @IsOptional()
    email: string;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsEnum([ 'true', 'false'])
    isGroup: string

    @IsNotEmpty()
    @IsEnum([ 'company', 'organization', 'public'])
    type: string;
}
