import {IsNotEmpty } from "class-validator";

export class SignDTO { 

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}