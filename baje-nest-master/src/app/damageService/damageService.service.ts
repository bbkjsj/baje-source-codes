import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DamageService } from "./schemas/damageService.schema";
import { CreateDamageServiceDTO } from "./dtos/create.dto";

@Injectable()
export class DamageServiceService { 

    constructor(@InjectRepository(DamageService) private readonly model: Repository<DamageService>){}


    
    async create(dto: CreateDamageServiceDTO):Promise<any> {
        try{
           const _dto:any = dto;
           _dto.hr_approved = dto.hr_approved == true ? 1 : 0;
            const entity = await this.model.createQueryBuilder()
            .insert()
            .values([
                {
                    personnel_id_fk: Number(dto.personnel_id),
                    ..._dto
                }
            ])
            .execute();
            return { 
                id: entity.identifiers[0].id
            }
        }
        catch(err) {
            throw err;
        }
    }

    async detail(id: number): Promise<DamageService> { 
        try{
            return await this.model.createQueryBuilder()
            .where('id=:id', { id: id})
            .getOne();
        }
        catch(err) {
            throw err;
        }
    }

    async list(type: string, companyId: number, contractId: number): Promise<any[]> { 
        try{
            const query =  this.model.createQueryBuilder('t1')
            .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
            .select([
                't1.id as id',
                'concat(t2.first_name, " ", t2.last_name) as name',
                't2.national_number as national_number',
                't1.type_service_damage as type_service_damage',
                't1.date as date',
                `IF(t1.manager_approved = 1 , 'تایید نهایی', IF(t1.hr_admin_approved = 1, 'تایید مدیر منابع انسانی', IF(t1.project_admin_approved = 1, 'تایید مدیر پروژه', IF(hr_approved = 1, 'تایید منابع انسانی', 'هنوز به تایید هیچ بخشی نرسیده')))) as status`
            ])
            .where('t1.type = :type', {type: type});

            if(companyId != -1) { 
                query.andWhere('t2.company_id_fk = :cid', {
                    cid: companyId
                });
            }

            if(contractId != -1) { 
                query.andWhere('t2.contract_id_fk=:cid',{
                    cid: contractId
                })
            }

            return await query.getRawMany();
        }
        catch(err) {
            throw err;
        }
    }

    async edit(id: Number, dto:CreateDamageServiceDTO): Promise<any> { 
        try{
            const _dto:any = {
                ...dto
            };

            _dto.personnel_id_fk = Number(dto.personnel_id);
            delete _dto.personnel_id;

            return await this.model.createQueryBuilder()
            .update()
            .set({
                ..._dto
            })
            .execute();
        }
        catch(err) {
            throw err;
        }
    }

    async delete(id:number): Promise<any>{ 
        try{
            return await this.model.createQueryBuilder()
            .delete()
            .where('id = :id', { id: id})
            .execute();
        }
        catch(err) {
            throw err;
        }
    }
}