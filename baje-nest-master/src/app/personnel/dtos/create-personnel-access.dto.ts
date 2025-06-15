import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { Role } from "src/common/enums/roles.enum";

export class CreatePersonnelAccessDTO { 

    @IsNotEmpty()
    personnelId: number;

    @IsNotEmpty()
    companyId: number;

    @IsNotEmpty()
    contractId: number;

    @IsEnum(Role)
    access: string;
}