import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractPeymanReport } from "./schemas/contractPeymanReport.schema";
import { CreateContractPeymanReportDTO } from "./dtos/create-contractPeymanReport.dto";

@Injectable()
export class ContractPeymanReportService { 

    constructor(@InjectRepository(ContractPeymanReport) private readonly model: Repository<ContractPeymanReport>){}

    async create(dto: CreateContractPeymanReportDTO): Promise<any>{ 
        try{
            const _dto:any = dto;
            _dto.edit_by_admin = dto.edit_by_admin == true ? 1: 0;

            return await this.model.createQueryBuilder()
            .insert()
            .values([
                {
                    ..._dto
                }
            ])
            .execute();
        }
        catch(err) { 
            throw err;
        }
    }

    async deleteAllByContractId(id: number) { 
        try{ 
            return await this.model.createQueryBuilder()
            .delete()
            .where('contract_id_fk = :id', { id: id})
            .execute();
        }
        catch(err) 
        {
            throw err;
        }
    }
}