import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateContractPeymanReportDTO { 
    
    @IsNotEmpty()
    contract_id_fk: number;

    @IsOptional()
    date: Date;

    @IsOptional()
    status: string;

    @IsNotEmpty()
    disabled_car_no_tier_quantity: number;

    @IsNotEmpty()
    disabled_car_no_part_quantity: number;

    @IsNotEmpty()
    active_car_quantity: number;

    @IsNotEmpty()
    ready_to_work_factor: number;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    ready_to_work_car_quantity: number;

    @IsOptional()
    edit_by_admin: boolean;
}