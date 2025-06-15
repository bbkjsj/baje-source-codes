import { IsBoolean, IsDateString, IsNumber, IsOptional } from "class-validator";

export class UpdateJobChartDTO { 

    @IsOptional()
    title: string;

    @IsOptional()
    @IsNumber()
    contract_id_fk: number;

    @IsOptional()
    @IsBoolean()
    enable: boolean;

    @IsOptional()
    @IsDateString()
    apply_date: Date;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsNumber()
    company_id_fk: number;
}