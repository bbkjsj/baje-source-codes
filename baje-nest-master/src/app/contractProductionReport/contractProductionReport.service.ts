import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractProductionReportModule } from "./contractProductionReport.module";
import { ContractProductionReport } from "./schemas/contractProductionReport.schema";
import { CreateContractProductionReportDTO } from "./dtos/create-contractProductionReport.dto";

@Injectable()
export class ContractProductionReportService { 

    constructor(@InjectRepository(ContractProductionReport) private readonly model: Repository<ContractProductionReport>){}

    async create(dto: CreateContractProductionReportDTO): Promise<any> { 
        try{
            const _dto:any = dto;
            _dto.edit_by_admin = dto.edit_by_admin == true ? 1 : 0;
            return await this.model.createQueryBuilder()
            .insert()
            .values([
                {..._dto}
            ])
            .execute();
        }
        catch(err){
            throw err;
        }
    }

    async deleteByContractId(id: number) { 
        try{
            return await this.model.createQueryBuilder()
            .delete()
            .where('contract_id_fk = :id', {id: id})
            .execute();
        }
        catch(err){
            throw err;
        }
    }
}
