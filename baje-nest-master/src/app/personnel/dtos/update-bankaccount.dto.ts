import { IsOptional } from "class-validator";

export class UpdateBankAccountInfoDTO {  
    @IsOptional()
    bank_account1: string;

    @IsOptional()
    sheba1:string;

    @IsOptional()
    bank_name1:string;

    @IsOptional()
    bank_account2: string;

    @IsOptional()
    sheba2:string;

    @IsOptional()
    bank_name2:string;

    @IsOptional()
    bank_account3: string;

    @IsOptional()
    sheba3:string;

    @IsOptional()
    bank_name3:string;

    @IsOptional()
    bank_account4: string;

    @IsOptional()
    sheba4:string;

    @IsOptional()
    bank_name4:string;

    @IsOptional()
    bank_account5: string;

    @IsOptional()
    sheba5:string;

    @IsOptional()
    bank_name5:string;
}