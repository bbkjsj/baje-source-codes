import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class HSEGetQuestionsDTO { 

    @IsOptional()
    @IsNumber()
    personnelId: number;

    @IsOptional()
    @IsNumber()
    vehicleId: number;

    @IsOptional()
    @IsNumber()
    environmentId: number;
}