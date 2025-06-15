import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateContractProgressDTO { 

    @IsNumber()
    contract_id_fk: number;

    @IsDateString()
    date: Date;


    @IsNumber()
    real_progress: number;

    @IsNumber()
    program_progress: number;
}