import { InjectRepository } from "@nestjs/typeorm";
import { Personnel } from "../../personnel/schemas/personnel.schema";
import { Repository, SelectQueryBuilder } from "typeorm";
import { IDataSyncPersonnelDetailResponse } from "./responses/data-sync-personnel-detail-response.interface";
import { FamilySchema } from "../../family/schemas/family.schema";
import { read } from "dbffile/dist/utils";
import { DataSyncPersonnelUpdateRequest } from "./requests/data-sync-personnel-update.request";
import { NotFoundException } from "@nestjs/common";
import moment from "moment";
import { DateProvider } from "../../../common/helpers/date-provider";

export class DataSyncPersonnelService {

  constructor(
    @InjectRepository(Personnel)
    private readonly personnelRepository: Repository<Personnel>,

    @InjectRepository(FamilySchema)
    private readonly familyRepository: Repository<FamilySchema>,
  ) {
  }


  async getPersonnelDetail(args: {
    nationalCode: string
  }): Promise<IDataSyncPersonnelDetailResponse> {
    const personnel: Personnel =
      await this.personnelRepository.findOne({
        where: {
          national_number: args.nationalCode
        }
      });

    if(personnel) {
      const familyQuery: SelectQueryBuilder<FamilySchema> = this.familyRepository.createQueryBuilder('family')
        .where('family.personnel_id_fk = :pid and (family.relation = :r1 or family.relation = :r2 or family.relation = :r3)', {
          pid: personnel.id,
          r1: 'mother',
          r2: 'father',
          r3: 'spouse'
        })
        .leftJoinAndSelect('personnel', 'personnel', 'family.relative_id_fk = personnel.id')
        .select([
          'personnel.national_number as nationalCode',
          'family.relation as relation'
        ]);

      const familyList: any[] = await familyQuery.getRawMany();

      let fatherNationalCode: string = null;
      let motherNationalCode: string = null;
      let spouseNationalCode: string = null;

      for(const family of familyList) {
        if(family.relation === 'father') {
          fatherNationalCode = family.nationalCode;
        }
        else if(family.relation === 'mother') {
          motherNationalCode = family.nationalCode;
        }
        else if(family.relation === 'spouse') {
          spouseNationalCode = family.nationalCode;
        }
      }

      return {
        firstName: personnel.first_name,
        lastName: personnel.last_name,
        nationalCode: personnel.national_number,
        fatherName: personnel.father_name,
        birthDate: new Date(personnel.birth_date),
        idNumber: personnel.id_number,
        gender: personnel.sex,
        fatherNationalCode: fatherNationalCode,
        motherNationalCode: motherNationalCode,
        spouseNationalCode: spouseNationalCode,
        mobile: personnel.mobile1,
        address: null,
        postalCode: personnel.postal_code,
        insuranceNumber: personnel.insurance_number,
        updatedOn: personnel.updatedOn,
      };
    }

    return null;
  }

  async updatePersonnelDetail(args: {
    request: DataSyncPersonnelUpdateRequest;
  }): Promise<void> {

    const {
      request
    } = args;

    const personnel: Personnel =
      await this.personnelRepository.findOne({
        where: {
          national_number: args.request.nationalCode
        }
      });

    if(!personnel) {
      await this.personnelRepository.insert({
        first_name: args.request.firstName,
        last_name: args.request.lastName,
        father_name: args.request.fatherName,
        birth_date: args.request.birthDate.toDateString(),
        id_number: args.request.idNumber,
        sex: args.request.gender,
        mobile1: args.request.mobile,
        insurance_number: args.request.insuranceNumber,
        address: args.request.address,
        postal_code: args.request.postalCode,
        updatedOn: DateProvider.todayDate()
      });
    }
    else {
      personnel.first_name = args.request.firstName ? request.firstName : personnel.first_name;
      personnel.last_name = request.lastName ? request.lastName : personnel.last_name;
      personnel.father_name = request.fatherName ? request.fatherName : personnel.father_name;
      personnel.birth_date = request.birthDate ? DateProvider.dateToString(request.birthDate) : personnel.birth_date;
      personnel.id_number = request.idNumber ? request.idNumber : personnel.id_number;
      personnel.sex = request.gender ? request.gender : personnel.sex;
      personnel.mobile1 = request.mobile ? request.mobile : personnel.mobile1;
      personnel.insurance_number = request.insuranceNumber ? request.insuranceNumber : personnel.insurance_number;
      personnel.address = request.address ? request.address : personnel.address;
      personnel.postal_code = request.postalCode ? request.postalCode : personnel.postal_code;
      personnel.updatedOn = DateProvider.todayDate();


      await this.personnelRepository.update({
        id: personnel.id
      }, personnel);
    }
  }
}
