import { IsNotEmpty, IsOptional } from "class-validator";

export class ImportDBFDTO { 


    @IsOptional()
    company_id: string;

    @IsOptional()
    contract_id: string;
    
}
