import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateContractProductionReportDTO { 
    
    @IsNotEmpty()
    stone_tonnage: number;

    @IsNotEmpty()
    dust_tonnage: number;

    @IsNotEmpty()
    stone_load_quantity: number;

    @IsNotEmpty()
    dust_load_quantity: number;

    @IsNotEmpty()
    contract_id_fk: number;

    @IsOptional()
    edit_by_admin: boolean;

    @IsOptional()
    date: Date;

    @IsOptional()
    status: string;

    @IsOptional()
    description: string;
}