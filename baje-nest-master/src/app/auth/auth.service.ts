import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CompanySchema } from '../company/schemas/company.entity';
import { Contract } from '../contract/schemas/contract.schema';
import { PersonnelAccess } from '../personnel/schemas/personnel-access.schema';
import { Personnel } from '../personnel/schemas/personnel.schema';
import { SurveyWorkgroupPersonnelSchema } from '../survey/schemas/survey-workgroup-personnel.schema';
import { IAuthAccess, IAuthCompany, IAuthContract, IAuthWhoAmI } from './interfaces';
import * as moment from 'moment';
import { SurveySettingSchema } from '../survey/schemas/survey-setting.schema';
import { SurveyExecutionSchema } from '../survey/schemas/survey-execution.schema';
import { CacheService } from '../global';
import { IIdentifyPersonnelByNationalNumber } from './interfaces/identify-person-by-national-code.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(CompanySchema)
    private readonly companyRepository: Repository<CompanySchema>,

    @InjectRepository(PersonnelAccess)
    private readonly personnelAccessRepository: Repository<PersonnelAccess>,

    @InjectRepository(Personnel)
    private readonly personnelRepository: Repository<Personnel>,

    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,

    @InjectRepository(SurveyWorkgroupPersonnelSchema)
    private readonly surveyWorkgroupPersonnelRepository: Repository<SurveyWorkgroupPersonnelSchema>,

    @InjectRepository(SurveySettingSchema)
    private readonly surveySettingRepository: Repository<SurveySettingSchema>,

    @InjectRepository(SurveyExecutionSchema)
    private readonly surveyExecutionRepository: Repository<SurveyExecutionSchema>,

    private readonly cacheService: CacheService
  ) { }

  async whoAmI(personnelId: number): Promise<IAuthWhoAmI> {

    const personnel: Personnel = await this.personnelRepository.findOne({
      where: {
        id: personnelId
      }
    });

    if(!personnel) {
      throw new Error('user could not be found');
    }

    const whoAmIinCache: IAuthWhoAmI = await this.cacheService.get(`person-${personnel.id}`) as IAuthWhoAmI;

    if(whoAmIinCache) {
      return whoAmIinCache;
    }

    const company: IAuthCompany[] = await this.getCompany(personnelId, personnel.is_super_user === 1);
    const access: IAuthAccess[] = await this.getAccess(personnelId);
    const contract: IAuthContract = await this.getContract(personnelId);
    const surveyAccess: string[] = await this.getSurveyAccess(personnelId);

    const result: IAuthWhoAmI = {
      personnelId: personnel.id,
      firstName: personnel.first_name,
      lastName: personnel.last_name,
      nationalCode: personnel.national_number,
      isSuper: personnel.is_super_user === null ? false : personnel.is_super_user === 1 ? true : false,
      isDoctor: personnel.user_type === 'doctor',
      gender: personnel.sex,
      imageUrl: personnel.image_url,
      company: company,
      access: access,
      contract: contract,
      surveyAccess: surveyAccess
    };

    await this.cacheService.set({
      key: `person-${personnel.id}`,
      value: result
    });

    return result;
  }

  async identifyByNationalCode(nationalCode: string): Promise<IIdentifyPersonnelByNationalNumber> {
    const result: IIdentifyPersonnelByNationalNumber =
      await this.personnelRepository.createQueryBuilder('personnel')
      .leftJoinAndSelect('company', 'company', 'personnel.company_id_fk = company.id')
      .where('personnel.national_number = :nationalNumber', {
        nationalNumber: nationalCode
      })
      .select([
        'personnel.id as id',
        'personnel.first_name as firstName',
        'personnel.last_name as lastName',
        'personnel.mobile1 as mobile',
        'personnel.address as address',
        'company.id as companyId',
        'company.name as companyName'
      ])
      .getRawOne();

      if(!result) {
        throw new NotFoundException();
      }

      return result;
  }


  private async getCompany(personnelId: number, isSuper: boolean): Promise<IAuthCompany[]> {

    if(!isSuper) {
      const query: SelectQueryBuilder<PersonnelAccess> =
      this.personnelAccessRepository.createQueryBuilder('personnelAccess')
        .innerJoinAndSelect('personnel', 'personnel', 'personnel.id = personnelAccess.personnel_id_fk')
        .innerJoinAndSelect('company', 'company', 'personnel.company_id_fk = company.id')
        .groupBy('personnel.company_id_fk')
        .where('personnelAccess.personnel_id_fk = :pid', {
          pid: personnelId
        })
        .select([
          'company.id as id',
          'company.name as name',
          'company.logo_url as logoUrl'
        ]);

        return await query.getRawMany();
    }
    else {
      const list: CompanySchema[] = await this.companyRepository.createQueryBuilder()
      .select([
        'id as id',
        'name as name',
        'logo_url as logoUrl'
      ])
      .getRawMany();

      return list;
    }
  }

  private async getAccess(personnelId: number): Promise<IAuthAccess[]> {
    const query: SelectQueryBuilder<PersonnelAccess> = this.personnelAccessRepository.createQueryBuilder('personnelAccess')
      .innerJoinAndSelect('access', 'access', 'personnelAccess.access_id_fk = access.id')
      .where('personnelAccess.personnel_id_fk = :pid', {
        pid: personnelId
      })
      .select([
        'access.id as id',
        'access.name as access',
        'access.minimum_required_access_level as minimumLevel',
        'access.code as code',
        'personnelAccess.company_id_fk as companyId',
        'personnelAccess.environment_id_fk as environmentId',
        'personnelAccess.access_level as accessLevel'
      ]);

    return await query.getRawMany();
  }

  private async getContract(personnelId: number): Promise<IAuthContract> {
    const query: SelectQueryBuilder<Contract> = this.contractRepository.createQueryBuilder('contract')
      .innerJoinAndSelect('personnel', 'personnel', 'personnel.contract_id_fk = contract.id')
      .where('personnel.id = :pid', {
        pid: personnelId
      })
      .select([
        'contract.id as id',
        'contract.subject as subject',
        'contract.type as type',
        'contract.employer as employer'
      ]);

    return await query.getRawOne();
  }

  private async getSurveyAccess(personnelId: number): Promise<string[]> {

    const today: string = moment().utc(true).format('YYYY/MM/DD');

    const output: string[] = [];


    const manager: any = await this.surveySettingRepository.findOne({
      where: {
        managerId: personnelId,
      }
    });

    if(manager) {
      output.push('SURVEY_MANAGER');
    }

    const ceo: any = await this.companyRepository.findOne({
      where: {
        id: 118,
        managerId: personnelId
      }
    });

    if(ceo) {
      output.push('HOLDING_CEO');
    }

    const executor: SurveyExecutionSchema = await this.surveyExecutionRepository.findOne({
      where: {
        personnelId: personnelId
      }
    });

    if(executor) {
      output.push('EXECUTOR');
    }


    const query: SelectQueryBuilder<SurveyWorkgroupPersonnelSchema> =
      this.surveyWorkgroupPersonnelRepository.createQueryBuilder('surveyWorkgroupPersonnel')
        .innerJoinAndSelect('survey_workgroup', 'surveyWorkgroup', 'surveyWorkgroupPersonnel.workgroup_id_fk = surveyWorkgroup.id')
        .where('surveyWorkgroupPersonnel.personnel_id_fk = :pid', {
          pid: personnelId
        })
        .andWhere('DATE(surveyWorkgroupPersonnel.member_from) >= :from', {
          from: today
        })
        .andWhere('DATE(surveyWorkgroupPersonnel.member_to) <= :to', {
          to: today
        })
        .select([
          'surveyWorkgroupPersonnel.position as position',
          'surveyWorkgroup.id as wid',
        ]);

    const list: string[] = await query.getRawMany();

    for(const item of list) {
      if(item['wid'] === '11') {
        if(item['position'] === 'دبیر') {
          output.push('SECRETARIAT_HEAD');
        }
        else if(item['position'] === 'عضو') {
          output.push('SECRETARIAT_MEMBER');
        }
      }

      if(item['wid'] === '12') {
        if(item['position'] === 'دبیر') {
          output.push('EXCELLENT_HEAD');
        }
        else if(item['position'] === 'عضو') {
          output.push('EXCELLENT_MEMBER')
        }
      }

      if(item['wid'] !== '11' && item['wid'] !== '12') {
        if(item['position'] === 'دبیر') {
          output.push('WORKGROUP_HEAD');
        }
        else if(item['position'] === 'عضو') {
          output.push('WORKGROUP_MEMBER');
        }
      }
    }

    return output;
  }
}