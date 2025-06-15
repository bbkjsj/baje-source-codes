import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateContactInfoDTO { 

    @IsOptional()
    address: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(11,11)
    mobile1: string;

    @IsOptional()
    @IsString()
    @Length(11,11)
    mobile2: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    postal_code: string;
}