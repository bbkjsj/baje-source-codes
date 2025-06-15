import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractProgress } from "./schemas/contractProgress.schema";
import { CreateContractProgressDTO } from "./dtos/create-contractProgress.dto";

@Injectable()
export class ContractProgressService { 
    constructor(@InjectRepository(ContractProgress) private readonly model:Repository<ContractProgress>){}


    async create(dto: CreateContractProgressDTO): Promise<any> { 
        try{
            return await this.model.createQueryBuilder()
            .insert()
            .values([
                {
                    ...dto,
                    status: null, 
                    edit_by_admin: 0
                }
            ])
            .execute();
        }
        catch(err) {
            throw err;
        }
    }

    async deleteAllByContractId(id:number) { 
        try{
            await this.model.createQueryBuilder()
            .delete()
            .where('contract_id_fk = :id', {id: id})
            .execute();
        }
        catch(err) 
        {
            throw err;
        }
    }
}