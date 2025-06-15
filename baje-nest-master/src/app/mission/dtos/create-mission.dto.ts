import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateMissionDTO {

    @IsNumber()
    personnel_id: number;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    subject: string;

    @IsOptional()
    @IsDateString()
    from_date: Date;

    @IsOptional()
    @IsDateString()
    to_date: Date;


    @IsOptional()
    residency: string;

    @IsOptional()
    vehicle: string;

    @IsOptional()
    description: string;

    @IsOptional()
    status: string;
}