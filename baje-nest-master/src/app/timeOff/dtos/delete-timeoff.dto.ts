import { IsArray, IsNumber } from "class-validator";

export class DeleteTimeOffDTO  { 

    @IsNumber({}, {each: true })
    ids: number[]
}

