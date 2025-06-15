import { IsArray } from "class-validator";

export class JobTitleDTO { 

    @IsArray()
    codes: string[]
}