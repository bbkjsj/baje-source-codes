import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateColumnNameDTO { 

    @IsNotEmpty()
    columnName: string;

    @IsNumber()
    tableId: number;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    type: string;
}