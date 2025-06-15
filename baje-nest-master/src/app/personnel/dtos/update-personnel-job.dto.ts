import { IsBoolean, IsDateString, IsNumber, IsOptional } from "class-validator";

export class UpdatePersonnelJobDTO {

    @IsOptional()
    @IsNumber()
    personnel_id_fk: number;

    @IsOptional()
    @IsNumber()
    jobs_id_fk: number;

    @IsOptional()
    @IsDateString()
    from_date: Date;

    @IsOptional()
    @IsDateString()
    to_date: Date;

    @IsOptional()
    @IsNumber()
    chart_id_fk: number;

    @IsOptional()
    @IsBoolean()
    approved: boolean;
}