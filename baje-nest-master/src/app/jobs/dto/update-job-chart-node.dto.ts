import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class UpdateJobChartNodeDTO { 
    @IsOptional()
    @IsNumber()
    count: number;

    @IsOptional()
    @IsNumber()
    jobs_tamin_code_id_fk: number;

    @IsOptional()
    title: string;
}