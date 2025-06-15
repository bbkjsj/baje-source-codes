import { IsArray, ValidateNested } from "class-validator";

export class DeletePersonnelManyDTO { 

    
    @IsArray()
    ids: [number]
}