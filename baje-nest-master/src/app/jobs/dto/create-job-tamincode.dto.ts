import { IsArray, IsNumber } from "class-validator";

export class CreateJobTaminCodeDTO { 

    @IsArray()
    codes: [string]

    @IsNumber()
    jobId: number;
}