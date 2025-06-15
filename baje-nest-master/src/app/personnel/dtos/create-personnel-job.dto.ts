import { IsBoolean, IsDateString, IsNumber, IsOptional } from "class-validator";

export class CreatePersonnelJobDTO {

    @IsNumber()
    personnel_id_fk: number;

    @IsNumber()
    jobs_id_fk: number;

    @IsDateString()
    from_date: Date;

    @IsDateString()
    to_date: Date;

    @IsNumber()
    chart_id_fk: number;

    @IsOptional()
    @IsBoolean()
    approved: boolean;
}