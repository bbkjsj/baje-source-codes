import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMissionDTO } from "./dtos/create-mission.dto";
import { PersonnelMission } from "./schemas/mission.schema";

@Injectable()
export class MissionService { 

    constructor(@InjectRepository(PersonnelMission) private readonly model: Repository<PersonnelMission>){}


    async create(dto: CreateMissionDTO): Promise<any> {
        try{
            const _dto:any = {
                ...dto
            }
            delete _dto.personnel_id;
            _dto.personnel_id_fk = dto.personnel_id;

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

    async update(id: number, dto: CreateMissionDTO): Promise<any> { 
        try{
            const _dto:any = { 
                ...dto
            };
            _dto.personnel_id_fk = dto.personnel_id;
            delete _dto.personnel_id;

            return await this.model.createQueryBuilder()
            .update()
            .set({
                ..._dto
            })
            .where('id = :id', { id: id})
            .execute();
        }
        catch(err) {
            throw err;
        }
    }

    async updateStatus(id: number, status: string): Promise<any> {
        try{
            return await this.model.createQueryBuilder()
            .update()
            .set({
                status: status
            })
            .where('id = :id', { id: id })
            .execute();
        }
        catch(err) {
            throw err;
        }
    }

    async delete(id: number) : Promise<any> { 
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

    async detail(id: number):Promise<PersonnelMission> { 
        try{
            return await this.model.createQueryBuilder('t1')
            .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
            .select([
                't1.*',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number',
            ])
            .where('t1.id = :id', { id: id })
            .getRawOne();
        }
        catch(err) {
            throw err;
        }
    }

    async list():Promise<PersonnelMission[]> { 
        try{
            return await this.model.createQueryBuilder('t1')
            .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
            .select([
                't1.*',
                't2.first_name as first_name',
                't2.last_name as last_name',
                't2.national_number as national_number',
            ])
            .getRawMany();
        }
        catch(err) {
            throw err;
        }
    }
}