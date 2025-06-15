import { IsDateString, IsNumber } from "class-validator";

export class CreatePersonnelShiftDTO { 

    @IsNumber()
    jobs_shift_id_fk: number;

    @IsNumber()
    personnel_id_fk: number;

    @IsDateString()
    start_date: Date;

    @IsDateString()
    end_date: Date;
}