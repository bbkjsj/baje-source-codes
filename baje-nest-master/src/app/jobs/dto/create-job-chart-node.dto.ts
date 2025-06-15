import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class CreateJobChartNodeDTO { 

    @IsNumber()
    count: number;

    @IsNumber()
    jobs_tamin_code_id_fk: number;

    @IsNotEmpty()
    title: string;

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => CreateJobChartNodeDTO)
    nodes: CreateJobChartNodeDTO[];
}