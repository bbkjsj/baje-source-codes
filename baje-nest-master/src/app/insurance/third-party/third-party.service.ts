import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { identity } from 'rxjs';
import { FilePath } from 'src/common/enums/file-path.enum';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateThirdPartyInsuranceDto } from './dtos/create-third-party-insurance.dto';
import { UpdateThirdPartyInsuranceDto } from './dtos/update-third-party-insurance.dto';
import { ThirdPartyInsurance } from './schemas/third-party-insurance.schema';

@Injectable()
export class ThirdPartyInsuranceService {

  constructor(
    @InjectRepository(ThirdPartyInsurance)
    private readonly repository: Repository<ThirdPartyInsurance>,
  ) { }


  async create(
    dto: CreateThirdPartyInsuranceDto,
    fileName: string
  ) {

    const _dto: any = { ...dto };
    if(fileName !== null) {
      _dto.file = `${FilePath.TP_INSURANCE}/${fileName}`;
    }

    return await this.repository.save({ ..._dto });
  }

  async update(
    id: number,
    dto: UpdateThirdPartyInsuranceDto,
    fileName: string
  ) {
    const _dto: any = { ...dto };

    if(fileName !== null) {
      _dto.file = `${FilePath.TP_INSURANCE}/${fileName}`;
    }

    return await this.repository.createQueryBuilder()
    .update()
    .set({ ..._dto })
    .where('id = :id', { id: id})
    .execute();
  }

  async getAll() {
    const list = await this.repository.createQueryBuilder( 't1')
    .innerJoinAndSelect('vehicle', 't2', 't1.vehicle_id_fk = t2.id')
    .innerJoinAndSelect('company', 't3', 't1.insurance_company_id_fk = t3.id')
    .innerJoinAndSelect('vehicle_type', 't4', 't2.type_id_fk = t4.id')
    .innerJoinAndSelect('vehicle_system', 't5', 't5.type_id_fk = t4.id')
    .innerJoinAndSelect('vehicle_style', 't6', 't6.system_id_fk = t5.id')
    .select([
      't1.id as id',
      't1.machine_organization_code as machineOrganizationCode',
      't1.insurance_number as insuranceNumber',
      't1.to_date as toDate',
      't2.plaque1 as plaque1',
      't2.plaque2 as plaque2',
      't2.plaque3 as plaque3',
      't2.plaque4 as plaque4',
      't2.chassis_number as chassisNumber',
      't2.vin_number as vinNumber',
      't6.title as styleTitle',
      't5.title as systemTitle',
      't4.title as typeTitle',
      't1.status as status',
      't3.name as companyName'
    ])
    .groupBy('t1.id')
    .getRawMany();

    return list;
  }

  async getOneById(id: number) {
    const item = await this.repository.createQueryBuilder( 't1')
    .innerJoinAndSelect('vehicle', 't2', 't1.vehicle_id_fk = t2.id')
    .leftJoinAndSelect('company', 't3', 't1.insurance_company_id_fk = t3.id')
    .innerJoinAndSelect('vehicle_type', 't4', 't2.type_id_fk = t4.id')
    .innerJoinAndSelect('vehicle_system', 't5', 't5.type_id_fk = t4.id')
    .innerJoinAndSelect('vehicle_style', 't6', 't6.system_id_fk = t5.id')
    .leftJoinAndSelect('personnel', 't7', 't1.deliver_to_personnel_id_fk = t7.id')
    .where('t1.id = :id', {
      id: id
    })
    .select([
      't1.id as id',
      't1.machine_organization_code as machineOrganizationCode',
      't1.insurance_identification as insuranceIdentification',
      't1.insurance_number as insuranceNumber',
      't1.vehicle_id_fk as vehicleId',
      't1.insurer_personnel_id_fk as insurerPersonnelId',
      't1.insurer_company_id_fk as insurerCompanyId',
      't1.from_date as fromDate',
      't1.to_date as toDate',
      't1.no_damage_history as noDamageHistory',
      't1.insurance as insurance',
      't1.max_commitment_financial_damages as maxCommitmentFinancialDamages',
      't1.max_commitment_injury as maxCommitmentInjury',
      't1.max_commitment_driver as maxCommitmentDriver',
      't1.deliver_to_personnel_id_fk as deliverToPersonnelId',
      't1.file as file',
      't1.description as description',
      't1.insurance_company_id_fk as insuranceCompanyId',
      't1.status as status',
      't2.plaque1 as plaque1',
      't2.plaque2 as plaque2',
      't2.plaque3 as plaque3',
      't2.plaque4 as plaque4',
      't2.chassis_number as chassisNumber',
      't2.vin_number as vinNumber',
      't6.title as styleTitle',
      't5.title as systemTitle',
      't4.title as typeTitle',
      't3.name as companyName',
      't7.first_name as deliverToFirstName',
      't7.last_name as deliverToLastName'
    ])
    .getRawOne();

    return item;
  }

  async deleteById(id: number) {
    return await this.repository.delete({
      id: id
    });
  }
}