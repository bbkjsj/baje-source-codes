import { IsNumber, IsNotEmpty } from "class-validator";

export class VerifyDTO { 

    @IsNumber()
    id:number;

    @IsNotEmpty()
    code: string;
}