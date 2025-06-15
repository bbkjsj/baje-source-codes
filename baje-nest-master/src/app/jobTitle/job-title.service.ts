import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JobTitle } from "./schemas/job-title.schema";

@Injectable()
export class JobTitleService { 

    constructor(@InjectRepository(JobTitle) private readonly model: Repository<JobTitle>){}

    async find(where: string, fields: any): Promise<JobTitle[]> {
        try{
            return await this.model.createQueryBuilder()
            .where(where, fields)
            .getMany();
        }
        catch(err) {
            throw err;
        }
    }
}