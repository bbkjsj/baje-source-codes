import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvironmentDTO } from './dtos/create-environment.dto';
import { AddEnvironmentUsageDTO } from './dtos/environment-usage.dto';
import { UpdateEnvironmentUsageDTO } from './dtos/update-environment-usage.dto';
import { UpdateEnvironmentDTO } from './dtos/update-environment.dto';
import { EnvironmentUsageSchema } from './schemas/environment-usage.schema';
import { EnvironmentSchema } from './schemas/environment.schema';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(EnvironmentUsageSchema)
    private readonly environmentUsageRepo: Repository<EnvironmentUsageSchema>,

    @InjectRepository(EnvironmentSchema)
    private readonly environmentRepo: Repository<EnvironmentSchema>,
  ) {}

  async createEnvironment(args: {
    dto: CreateEnvironmentDTO
  }) {
    const {
      dto
    } = args;

    return await this.environmentRepo
    .insert({ ...dto });
  }

  async updateEnvironment(args: {
    dto: UpdateEnvironmentDTO,
    id: number
  }) {
    const {
      dto,
      id
    } = args;

    return await this.environmentRepo
    .update({
      id: id
    }, {
      ...dto
    });
  }

  async deleteEnvironment(args: {
    id: number
  }) {
    return await this.environmentRepo
    .delete({
      id: args.id
    });
  }

  async listEnvironment() {
    return await this.environmentRepo
    .createQueryBuilder('environment')
    .leftJoinAndSelect('environment_usage', 'usage', 'environment.environment_usage_id = usage.id')
    .leftJoinAndSelect('company', 'company', 'environment.company_id_fk = company.id')
    .select([
      'environment.id as id',
      'environment.code as code',
      'environment.title as title',
      'company.name as companyName',
      'company_id_fk as companyId',
      'parent_id_fk as parentId',
      'usage.id as usageId',
      'usage.title as usageTitle',
      'environment.occupied_status as occupiedStatus',
      'environment.independent_chart as independentChart',
      'environment.independent_vehicle as independentVehicle',
      'environment.parent_id_fk as parentId'
    ])
    .getRawMany();
  }

  async environmentFlow(id: number) {

    const details = await this.environmentRepo
    .createQueryBuilder('environment')
    .leftJoinAndSelect('environment_usage', 'usage', 'environment.environment_usage_id = usage.id')
    .leftJoinAndSelect('company', 'company', 'environment.company_id_fk = company.id')
    .andWhere('environment.id = :id', {
      id: id
    })
    .select([
      'environment.id as id',
      'environment.title as title',
      'environment.code as code',
      'company.name as companyName',
      'company_id_fk as companyId',
      'parent_id_fk as parentId',
      'usage.id as usageId',
      'usage.title as usageTitle',
      'environment.occupied_status as occupiedStatus',
      'environment.independent_chart as independentChart',
      'environment.independent_vehicle as independentVehicle',
    ])
    .getRawOne();

    details.nodes = [];

    const childs = await this.environmentRepo.find({
      where: {
        parentId: details.id
      }
    });

    for(const child of childs) {
      const chartItem = {
        id: child.id,
        title: child.title,
        companyId: child.companyId,
        nodes: await this.chartCreator(child)
      };
      details.nodes.push(chartItem);
    }

    return details;
  }


  async addUsage(args: {
    dto: AddEnvironmentUsageDTO
  }) {

    const {
      dto
    } = args;

    const duplicateCount: number =
      await this.environmentUsageRepo.count({
        where: {
          title: dto.title
        }
      });

    if(duplicateCount > 0) {
      throw new NotFoundException('duplicate title');
    }

    return await this.environmentUsageRepo
    .insert({
      title: dto.title,
      description: dto.description,
      jobId: dto.jobId,
      isEnable: dto.isEnable
    });
  }

  async updateUsage(args: {
    id: number;
    dto: UpdateEnvironmentUsageDTO;
  }) {

    const {
      id,
      dto
    } = args;

    const countDuplicates: number = await
      this.environmentUsageRepo.count({
        where: {
          title: dto.title
        }
      });

    if(countDuplicates > 0) {
      throw new NotFoundException('duplicate title');
    }

    return await this.environmentUsageRepo
    .update({
      id: id
    }, {
      ...dto
    });
  }

  async deleteUsage(args: {
    id: number
  }) {
    return await this.environmentUsageRepo
    .delete({
      id: args.id
    });
  }

  async getUsage(args: {
    id: number
  }): Promise<EnvironmentUsageSchema> {
    return await this.environmentUsageRepo
    .findOne({
      where: {
        id: args.id
      }
    });
  }

  async getUsages(): Promise<EnvironmentUsageSchema[]> {
    return this.environmentUsageRepo
    .find();
  }

  private async chartCreator(node: EnvironmentSchema) {
    const nodes = [];

    const childs = await this.environmentRepo
    .find({
      where: {
        parentId: node.id
      }
    });

    for(const child of childs) {
      const _child = {
        id: child.id,
        title: child.title,
        companyId: child.companyId,
        nodes: await this.chartCreator(child)
      }

      nodes.push(_child);
    }

    return nodes.length > 0 ? nodes : [];
  }

}