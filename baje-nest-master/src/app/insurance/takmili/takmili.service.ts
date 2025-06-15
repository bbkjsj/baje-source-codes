import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IListPaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { IPagination } from 'src/common/interfaces/pagination.interface';
import { ExcelService, IExcelHeader } from 'src/common/modules/excel/excel.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IInsuranceTakmiliPersonnel } from './interfaces/insurance-takmili-personnel.interface';
import { InsuranceTakmiliPersonnelSchema } from './schemas/takmili.schema';

@Injectable()
export class InsuranceTakmiliService {

  constructor(
    @InjectRepository(InsuranceTakmiliPersonnelSchema)
    private readonly insuranceTakmiliPersonnelRepository: Repository<InsuranceTakmiliPersonnelSchema>,

    private readonly excelService: ExcelService
  ) { }


  async getPersonnelOfInsurance(args: {
    insuranceId: number,
    pagination: IPagination,
  }): Promise<IListPaginationResponse> {

    let query: SelectQueryBuilder<InsuranceTakmiliPersonnelSchema> =
      await this.insuranceTakmiliPersonnelRepository.createQueryBuilder('takmiliPersonnel')
        .leftJoinAndSelect('personnel', 'personnel', 'takmiliPersonnel.main_insurer_personnel_id_fk = personnel.id')
        .innerJoinAndSelect('personnel_subordinate', 'subordinate', 'personnel.id = subordinate.personnel_id_fk')
        .innerJoinAndSelect('insurance_takmili_subordinate', 'insuranceSubordinate', 'subordinate.id = insuranceSubordinate.subordinate_id_fk')
        .where('takmiliPersonnel.insurance_id_fk = :insuranceId', {
          insuranceId: args.insuranceId
        })
        .andWhere('takmiliPersonnel.is_deleted is null')
        .orWhere('takmiliPersonnel.is_deleted = :isDeleted', {
          isDeleted: '0'
        })
        .select([
          'insuranceSubordinate.id as id',
          'takmiliPersonnel.insurance_id_fk as insuranceId',
          'subordinate.first_name as personnelFirstName',
          'subordinate.last_name as personnelLastName',
          'subordinate.national_code as personnelNationalNumber',
          'personnel.id as mainPersonnelId',
          'personnel.national_number as mainPersonnelNationalNumber',
          'personnel.first_name as mainPersonnelFirstName',
          'personnel.last_name as mainPersonnelLastName',
          'takmiliPersonnel.start_date as fromDate',
          'takmiliPersonnel.end_date as toDate',
          'subordinate.relation as relation',
          'takmiliPersonnel.is_approved as isApproved'
        ]);

    const total: number = (await query.getRawMany()).length;

    query = query
      .offset((+args.pagination.page - 1) * +args.pagination.size)
      .limit(+args.pagination.size);

    const list = await query.getRawMany();

    return {
      list: list,
      total: total,
    };
  }

  async getPersonnelOfInsuranceExcelBuffer(args: {
    insuranceId: number;
  }): Promise<Buffer> {

    let query: SelectQueryBuilder<InsuranceTakmiliPersonnelSchema> =
      await this.insuranceTakmiliPersonnelRepository.createQueryBuilder('takmiliPersonnel')
        .leftJoinAndSelect('personnel', 'personnel', 'takmiliPersonnel.main_insurer_personnel_id_fk = personnel.id')
        .innerJoinAndSelect('personnel_subordinate', 'subordinate', 'personnel.id = subordinate.personnel_id_fk')
        .innerJoinAndSelect('insurance_takmili_subordinate', 'insuranceSubordinate', 'subordinate.id = insuranceSubordinate.subordinate_id_fk')
        .where('takmiliPersonnel.insurance_id_fk = :insuranceId', {
          insuranceId: args.insuranceId
        })
        .andWhere('takmiliPersonnel.is_deleted is null')
        .orWhere('takmiliPersonnel.is_deleted = :isDeleted', {
          isDeleted: '0'
        })
        .select([
          'insuranceSubordinate.id as id',
          'takmiliPersonnel.insurance_id_fk as insuranceId',
          'subordinate.first_name as personnelFirstName',
          'subordinate.last_name as personnelLastName',
          'subordinate.national_code as personnelNationalNumber',
          'personnel.id as mainPersonnelId',
          'personnel.national_number as mainPersonnelNationalNumber',
          'personnel.first_name as mainPersonnelFirstName',
          'personnel.last_name as mainPersonnelLastName',
          'takmiliPersonnel.start_date as fromDate',
          'takmiliPersonnel.end_date as toDate',
          'subordinate.relation as relation',
          'takmiliPersonnel.is_approved as isApproved'
        ]);

    const list = await query.getRawMany();

    const excelHeaders: IExcelHeader[] = [
      {
        key: "personnelFirstName",
        value: "نام"
      },
      {
        key: "personnelLastName",
        value: "نام خانوادگی"
      },
      {
        key: "personnelNationalNumber",
        value: "کد ملی"
      },
      {
        key: "mainPersonnelFirstName",
        value: "نام بیمه شده اصلی"
      },
      {
        key: "mainPersonnelLastName",
        value: "نام خانوادگی بیمه شده اصلی"
      },
      {
        key: "mainPersonnelNationalNumber",
        value: "کد ملی بیمه شده اصلی"
      },
      {
        key: "relation",
        value: "رابطه"
      },
      {
        key: "fromDate",
        value: "از تاریخ"
      },
      {
        key: "toDate",
        value: "تا تاریخ"
      },
      {
        key: "isApproved",
        value: "وضعیت"
      }
    ];

    const excelBuffer: Buffer = await this.excelService.create({
      header: excelHeaders,
      stringJson: JSON.stringify(list)
    });

    return excelBuffer;
  }
}