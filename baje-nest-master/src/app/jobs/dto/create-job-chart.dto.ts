import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { CreateJobChartNodeDTO } from "./create-job-chart-node.dto";

export class CreateJobChartDTO {

    @IsNotEmpty()
    title: string;

    @IsNumber()
    environment_id_fk: number;

    @IsBoolean()
    enable: boolean;

    @IsDateString()
    apply_date: Date;

    @IsOptional()
    description: string;

    @IsNumber()
    company_id_fk: number;


    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateJobChartNodeDTO)
    nodes: CreateJobChartNodeDTO[];
}
