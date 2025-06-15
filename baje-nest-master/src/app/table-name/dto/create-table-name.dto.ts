import { IsNotEmpty } from "class-validator";

export class CreateTableNameDto {

    @IsNotEmpty()
    table_name: string;

    @IsNotEmpty()
    title: string;
}
