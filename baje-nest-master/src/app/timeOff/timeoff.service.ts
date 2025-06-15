import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IToken } from "src/common/helpers/jwt";
import { Repository } from "typeorm";
import { CreateTimeOffDTO } from "./dtos/create-timeoff.dto";
import { DeleteTimeOffDTO } from "./dtos/delete-timeoff.dto";
import { TimeOff } from "./schemas/timeoff.schema";

@Injectable()
export class TimeOffService {


    constructor(@InjectRepository(TimeOff) private readonly model:Repository<TimeOff>){}


    async create(dto: CreateTimeOffDTO, fileUrl: string, operatorId: number):Promise<any> {
        try{
            const _dto: any = {
                ...dto
            }

            _dto.personnel_id_fk = Number(dto.personnel_id);
            _dto.operator_id_fk = operatorId;

            delete _dto.personnel_id;

            if(fileUrl) {
                _dto.file_url = fileUrl;
            }

            const timeOff =  await this.model.createQueryBuilder()
            .insert()
            .values([
                _dto
            ])
            .execute();

            return timeOff.identifiers[0];
        }
        catch(err) {
            throw err;
        }
    }

    async update(id: number, userId: number, dto: CreateTimeOffDTO, fileUrl: string): Promise<any> {
        try{
            const timeOff = await this.model.createQueryBuilder()
            .select()
            .where('id = :id and personnel_id_fk = :pid', {
                id: id,
                pid: userId
            })
            .getOne();

            if(timeOff) {
                const _dto:any = {
                    ...dto
                }

                delete _dto.personnel_id;

                if(fileUrl) {
                    _dto.file_url = fileUrl;
                }

                return await this.model.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id})
                .execute();
            }
            else {
                throw new HttpException('time off could not be found', 400);
            }
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
            .where('id = :id', { id: id})
            .execute();
        }
        catch(err) {
            throw err;
        }
    }

    async deleteMany(dto: DeleteTimeOffDTO, user: IToken) {
        try{
            if(user.isSuper) {
                dto.ids.forEach(async id => {
                    await this.model.createQueryBuilder()
                    .delete()
                    .where('id = :id and status is null', {id: id})
                    .execute();
                });
            }
            else {
                dto.ids.forEach(async id => {
                    await this.model.createQueryBuilder()
                    .delete()
                    .where('id = :id and status is null and personnel_id_fk= :pid', {id: id, pid: user.id})
                    .execute();
                });
            }
        }
        catch(err) {
            throw err;
        }
    }

    async detail(id:number, userId: number):Promise<any> {
        try{
            return await this.model.createQueryBuilder('t1')
              .innerJoinAndSelect('personnel', 't2', 't1.operator_id_fk = t2.id')
            .where('t1.id = :id and t1.personnel_id_fk = :pid', {
                id: id,
                pid: userId
            })
            .getOne();
        }
        catch(err) {
            throw err;
        }
    }

    async list(user: IToken): Promise<any[]>  {
        try{
            if(user.isSuper){
                return await this.model.createQueryBuilder('t1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                  .innerJoinAndSelect('personnel', 't3', 't1.operator_id_fk = t3.id')
                .select([
                    't1.*',
                    'TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date)) as seconds',
                    't2.first_name as first_name',
                    't2.last_name as last_name',
                    't2.national_number as national_number',
                    't3.first_name as operator_first_name',
                  't3.last_name as operator_last_name'
                ])
                .orderBy('t1.status', 'ASC')
                .getRawMany();
            }
            else {
                return await this.model.createQueryBuilder('t1')
                .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
                  .innerJoinAndSelect('personnel', 't3', 't1.operator_id_fk = t3.id')
                .where('t1.personnel_id_fk = :pid', {
                    pid: user.id
                })
                .select([
                    't1.*',
                    'TIME_TO_SEC(TIMEDIFF(t1.to_date, t1.from_date)) as seconds',
                    't2.first_name as first_name',
                    't2.last_name as last_name',
                    't2.national_number as national_number',
                    't3.first_name as operator_first_name',
                    't3.last_name as operator_last_name'
                ])
                .orderBy('t1.status', 'ASC')
                .getRawMany();
            }
        }
        catch(err) {
            throw err;
        }
    }
}
