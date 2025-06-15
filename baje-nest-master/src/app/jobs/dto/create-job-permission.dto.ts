import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateJobPermissionDTO {

    @IsNumber()
    jobId: number;

    @IsArray()
    @IsNumber({}, { each: true })
    accessIds: [number];

}