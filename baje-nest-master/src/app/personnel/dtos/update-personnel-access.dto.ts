import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CreatePersonnelAccessDTO } from "./create-personnel-access.dto";

export class UpdatePersonnelAccessDTO { 

    @IsArray()
    @ValidateNested({each: true })
    @Type(() => CreatePersonnelAccessDTO)
    data: CreatePersonnelAccessDTO[];
}