import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { ExcelService, IExcelHeader } from 'src/common/modules/excel/excel.service';
import { createQueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { CacheService } from '../global';
import { AccessPersonnelSchema } from './access-personnel.schema';
import { AccessPrerequisiteSchema } from './access-prerequisite.schema';
import { AccessSchema } from './access.schema';
import { AssignAccessToPersonnelRequest } from './dto/assign-access-to-personnel.dto';
import { UpdateAccessDTO } from './dto/update-access.dto';
import { UpdateAssignAccessToPersonnel } from './dto/update-assign-access-to-personnel.dto';
import { IAccess } from './interfaces/access.interface';
import { IJobAccess } from './interfaces/job-access.interface';
import { IPersonnelAccess } from './interfaces/personnel-access.interface';
import { PermissionTranslation } from "../../common/translation/permission";
import {
  AccessMinimumRequiredAccessLevelTranslation
} from "../../common/translation/access-minimum-required-access-level";

@Injectable()
export class AccessService {

  constructor(
    @InjectRepository(AccessSchema)
    private readonly accessRepository: Repository<AccessSchema>,

    @InjectRepository(AccessPrerequisiteSchema)
    private readonly accessPrerequisiteRepository: Repository<AccessPrerequisiteSchema>,

    @InjectRepository(AccessPersonnelSchema)
    private readonly accessPersonnelRepository: Repository<AccessPersonnelSchema>,

    private readonly excelService: ExcelService,

    private readonly cacheService: CacheService,
  ) { }

  async getAllAccess(): Promise<IAccess[]> {
    const list: AccessSchema[] =
      await this.accessRepository.find();

    const output: IAccess[] = list.map(access => {
      return {
        id: access.id as number,
        code: access.code,
        name: access.name,
        enable: access.enable,
        minimumRequiredAccessLevel: access.minimumRequiredAccessLevel
      }
    });

    return output;
  }

  async add(access: IAccess) {
    await this.accessRepository.insert({
      ...access
    });
  }

  async addPrerequisite(args: {
    accessCode: number,
    prerequisiteIds: number[],
    addPrerequisiteForUsers: boolean;
    operatorId: number;
  }) {

    const access: AccessSchema = await this.accessRepository.findOne({
      where: {
        code: args.accessCode.toString()
      }
    });

    if (!access) {
      throw new Error('access could not be found');
    }

    await this.accessPrerequisiteRepository.delete({
      requiredAccessId: access.id as number
    });


    for (const item of args.prerequisiteIds) {
      await this.accessPrerequisiteRepository.insert({
        accessId: item,
        requiredAccessId: access.id as number
      });
    }

    if (args.addPrerequisiteForUsers) {
      const personnels: AccessPersonnelSchema[] =
        await this.accessPersonnelRepository.find({
          where: {
            accessId: access.id
          }
        });

      const personnelIds: number[] = personnels.map(personnel => personnel.personnelId);
      const newAccessIds: number[] = [
        ...args.prerequisiteIds
      ];

      for (const personnel of personnelIds) {
        const personnelPreviousAccess: AccessPersonnelSchema =
          await this.accessPersonnelRepository.findOne({
            where: {
              accessId: access.id,
              personnelId: personnel
            }
          });

        for (const accessId of newAccessIds) {
          await this.accessPersonnelRepository
            .insert({
              personnelId: personnel,
              accessId: accessId,
              assignedById: args.operatorId,
              startDate: personnelPreviousAccess.startDate,
              endDate: personnelPreviousAccess.endDate,
              environmentId: personnelPreviousAccess.environmentId,
              accessLevel: personnelPreviousAccess.accessLevel
            });
        }
      }

    }
  }

  async updateAccess(args: {
    accessCode: number;
    request: UpdateAccessDTO;
  }) {
    const access: AccessSchema =
      await this.accessRepository.findOne({
        where: {
          code: args.accessCode.toString()
        }
      });

    if (!access) {
      throw new Error('access could not be found');
    }

    await this.accessRepository.update({
      id: access.id
    }, {
      ...args.request
    });
  }

  async getPrerequisite(args: {
    accessCode: string;
  }): Promise<number[]> {
    const access: AccessSchema =
      await this.accessRepository.findOne({
        where: {
          code: args.accessCode
        }
      });

    if (!access) {
      throw new Error('access code could not be found');
    }

    const prerequisites: AccessPrerequisiteSchema[] =
      await this.accessPrerequisiteRepository.find({
        where: {
          accessId: +access.id
        }
      });

    return prerequisites.map(item => {
      return item.requiredAccessId
    });
  }

  async assignAccessToPersonnel(args: {
    assignedById: number;
    request: AssignAccessToPersonnelRequest
  }): Promise<void> {

    const {
      assignedById,
      request
    } = args;

    const entity: AccessPersonnelSchema =
      await this.accessPersonnelRepository.createQueryBuilder()
        .where('personnel_id_fk = :personnelId', {
          personnelId: request.personnelId
        })
        .andWhere('access_level = :accessLevel', {
          accessLevel: request.accessLevel
        })
        .andWhere('access_id_fk in (:...accessIds)', {
          accessIds: request.accessIds
        })
        .getOne();

    if (entity) {
      throw new HttpException('Access already exists for this personnel', 400);
    }

    for (const accessId of request.accessIds) {
      await this.accessPersonnelRepository.insert({
        personnelId: request.personnelId,
        accessId: accessId,
        accessLevel: request.accessLevel,
        assignedById: assignedById,
        startDate: request.startDate,
        endDate: request.endDate,
        companyId: request.companyId,
        environmentId: request.environmentId
      });
    }

    await this.cacheService.removePersonnelPayload(request.personnelId);
  }

  async getPersonnelAssignedAccess(args: {
    personnelId: number
  }): Promise<IPersonnelAccess[]> {
    const list =
      await this.accessPersonnelRepository.createQueryBuilder( 'personnelAccess')
        .innerJoinAndSelect('personnel', 'personnel', 'personnelAccess.personnel_id_fk = personnel.id')
        .innerJoinAndSelect('personnel', 'operator', 'operator.id = personnelAccess.assigned_by_id_fk')
        .innerJoinAndSelect('access', 'access', 'personnelAccess.access_id_fk = access.id')
        .leftJoinAndSelect('company', 'company', 'personnelAccess.company_id_fk = company.id')
        .leftJoinAndSelect('environment', 'environment', 'environment.id = personnelAccess.environment_id_fk')
        .where('personnelAccess.personnel_id_fk = :personnelId', {
          personnelId: args.personnelId
        })
        .select([
          'personnelAccess.id as id',
          'personnelAccess.access_id_fk as accessId',
          'personnelAccess.assigned_by_id_fk as operatorId',
          'personnelAccess.start_date as startDate',
          'personnelAccess.end_date as endDate',
          'personnelAccess.access_level as accessLevel',
          'operator.first_name as firstName',
          'operator.last_name as lastName',
          'operator.national_number as operatorNationalCode',
          'company.id as companyId',
          'company.name as companyName',
          'environment.id as environmentId',
          'environment.title as environmentName',
          'access.name as access',
          'access.code as accessCode',
          'personnel.first_name as personnelFirstName',
          'personnel.last_name as personnelLastName',
          'personnel.national_number as personnelNationalNumber'
        ])
        .getRawMany();

    const result: IPersonnelAccess[] = [];

    for (const item of list) {
      result.push({
        id: item.id,
        access: item.access,
        accessId: item.accessId,
        accessCode: item.accessCode,
        operatorId: item.operatorId,
        operatorFullName: `${item.firstName} ${item.lastName}`,
        operatorNationalNumber: item.operatorNationalCode,
        startDate: item.startDate,
        endDate: item.endDate,
        accessLevel: item.accessLevel,
        companyId: item.companyId,
        companyName: item.companyName,
        environmentId: item.environmentId,
        environmentName: item.environmentName,
        personnelFirstName: item.first_name,
        personnelLastName: item.last_name,
        personnelNationalNumber: item.personnelNationalNumber
      });
    }

    return result;
  }

  async getAllPersonnelAccess(): Promise<IPersonnelAccess[]> {
    const list =
      await this.accessPersonnelRepository.createQueryBuilder( 'personnelAccess')
        .innerJoinAndSelect('personnel', 'personnel', 'personnelAccess.personnel_id_fk = personnel.id')
        .innerJoinAndSelect('personnel', 'operator', 'operator.id = personnelAccess.assigned_by_id_fk')
        .innerJoinAndSelect('access', 'access', 'personnelAccess.access_id_fk = access.id')
        .leftJoinAndSelect('company', 'company', 'personnelAccess.company_id_fk = company.id')
        .leftJoinAndSelect('environment', 'environment', 'environment.id = personnelAccess.environment_id_fk')
        .select([
          'personnelAccess.id as id',
          'personnelAccess.access_id_fk as accessId',
          'personnelAccess.assigned_by_id_fk as operatorId',
          'personnelAccess.start_date as startDate',
          'personnelAccess.end_date as endDate',
          'personnelAccess.access_level as accessLevel',
          'operator.first_name as firstName',
          'operator.last_name as lastName',
          'operator.national_number as operatorNationalCode',
          'company.id as companyId',
          'company.name as companyName',
          'environment.id as environmentId',
          'environment.title as environmentName',
          'access.name as access',
          'access.code as accessCode',
          'personnel.first_name as personnelFirstName',
          'personnel.last_name as personnelLastName',
          'personnel.national_number as personnelNationalNumber'
        ])
        .getRawMany();

    const result: IPersonnelAccess[] = [];



    for (const item of list) {
      result.push({
        id: item.id,
        access: item.access,
        accessId: item.accessId,
        accessCode: item.accessCode,
        operatorId: item.operatorId,
        operatorFullName: `${item.firstName} ${item.lastName}`,
        operatorNationalNumber: item.operatorNationalCode,
        startDate: item.startDate,
        endDate: item.endDate,
        accessLevel: item.accessLevel,
        companyId: item.companyId,
        companyName: item.companyName,
        environmentId: item.environmentId,
        environmentName: item.environmentName,
        personnelFirstName: item.personnelFirstName,
        personnelLastName: item.personnelLastName,
        personnelNationalNumber: item.personnelNationalNumber
      });
    }

    return result;
  }

  async deleteAssignedAccessToPersonnel(args: {
    operatorId: number;
    personnelId: number;
    accessId: number;
  }): Promise<void> {
    await this.accessPersonnelRepository.delete({
      personnelId: args.personnelId,
      accessId: args.accessId,
    });
  }

  async updateAssignedAccess(args: {
    accessId: number;
    request: UpdateAssignAccessToPersonnel;
  }): Promise<void> {

    const access: AccessPersonnelSchema =
      await this.accessPersonnelRepository.findOne({
        where: {
          id: args.accessId
        }
      });

    if (!access) {
      throw new HttpException('access could not be found', 400);
    }

    access.endDate = args.request.endDate;
    await this.accessPersonnelRepository.save(access);
    await this.cacheService.removePersonnelPayload(access.personnelId);
  }

  async excelReportAccessOfPersonnels(args: {
    accessCode: string;
  }): Promise<IResponseWithBuffer> {

    const query: SelectQueryBuilder<AccessPersonnelSchema> =
      this.accessPersonnelRepository.createQueryBuilder('personnelAccess')
        .innerJoinAndSelect('personnel', 'personnel', 'personnelAccess.personnel_id_fk = personnel.id')
        .innerJoinAndSelect('personnel', 'operator', 'personnelAccess.assigned_by_id_fk = operator.id')
        .innerJoinAndSelect('access', 'access', 'personnelAccess.access_id_fk = access.id')
        .where('access.code = :accessCode', {
          accessCode: args.accessCode
        })
        .select([
          'CONCAT(personnel.first_name, \' \', personnel.last_name) as fullName',
          'personnel.national_number as nationalNumber',
          'CONCAT(operator.first_name, \' \',operator.last_name) as operatorFullName',
          'operator.national_number as operatorNationalNumber',
          'personnelAccess.start_date as startDate',
          'personnelAccess.end_date as endDate',
          'personnelAccess.access_level as accessLevel',
          'personnelAccess.company_id_fk as companyId',
          'personnelAccess.environment_id_fk as environmentId'
        ]);

    const list: any[] = await query.getRawMany();

    const excelHeaders: IExcelHeader[] = [
      {
        "key": "fullName",
        "value": "دارنده"
      },
      {
        "key": "nationalNumber",
        "value": "کد ملی دارنده"
      },
      {
        "key": "operatorFullName",
        "value": "ایجاد کننده"
      },
      {
        "key": "operatorNationalNumber",
        "value": "کد ملی ایجاد کننده"
      },
      {
        "key": "startDate",
        "value": "تاریخ شروع"
      },
      {
        "key": "endDate",
        "value": "تاریخ پایان"
      },
      {
        "key": "accessLevel",
        "value": "حوزه"
      },
      {
        "key": "environmentId",
        "value": "آدرس شاخه"
      },
      {
        "key": "companyId",
        "value": "آدرس شاخه"
      }
    ];

    const excelBuffer: Buffer = await this.excelService.create({
      header: excelHeaders,
      stringJson: JSON.stringify(list)
    });

    return {
      list: list,
      buffer: excelBuffer
    }
  }

  async excelReportAccessPrerequisite(args: {
    accessCode: string;
  }): Promise<IResponseWithBuffer> {

    const query: SelectQueryBuilder<AccessSchema> =
      this.accessRepository.createQueryBuilder('access')
        .innerJoinAndSelect('access_prerequisite', 'accessPre', 'access.id = accessPre.access_id_fk')
        .where('access.code = :code', {
          code: args.accessCode
        })
        .select([
          'access.code as code',
          'access.minimum_required_access_level as minimumRequiredAccessLevel',
          'access.name as access',
        ]);

    const list: any[] = await query.getRawMany();


    const minimumAccessLevelTranslation: AccessMinimumRequiredAccessLevelTranslation =
      new AccessMinimumRequiredAccessLevelTranslation();

    const permissionTranslation: PermissionTranslation = new PermissionTranslation();

    for(let item of list) {
      item.minimumRequiredAccessLevel = minimumAccessLevelTranslation.translate(item.minimumRequiredAccessLevel);
      item.access = permissionTranslation.translate(item.access);
    }

    const excelHeaders: IExcelHeader[] = [
      {
        "key": "code",
        "value": "کد"
      },
      {
        "key": "access",
        "value": "دسترسی"
      },
      {
        "key": "minimumRequiredAccessLevel",
        "value": "کوچک ترین حوزه دسترسی"
      }
    ];


    const excelBuffer: Buffer = await this.excelService.create({
      header: excelHeaders,
      stringJson: JSON.stringify(list)
    });

    return {
      list: list,
      buffer: excelBuffer
    }
  }

  async getJobAccess(args: {
    jobId: number;
  }): Promise<IJobAccess[]> {

    const query: SelectQueryBuilder<AccessSchema> =
      this.accessRepository.createQueryBuilder('access')
        .innerJoinAndSelect('jobs_permission', 'jobPermission', 'access.id = jobPermission.access_id_fk')
        .where('jobPermission.jobs_id_fk = :id', {
          id: args.jobId
        })
        .select([
          'access.id as accessId',
          'access.code as code',
          'access.name as title'
        ]);

    const list: IJobAccess[] = await query.getRawMany();

    return list;
  }
}