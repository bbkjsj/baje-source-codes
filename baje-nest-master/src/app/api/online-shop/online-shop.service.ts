import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanySchema } from 'src/app/company/schemas/company.entity';
import { Personnel } from 'src/app/personnel/schemas/personnel.schema';
import { Repository } from 'typeorm';
import { IPersonnelDetailResponse } from './responses/personnel-detail.response';
import { IValidatePersonByNationalCode } from './responses/validate-person.response';

@Injectable()
export class OnlineShopService {

  constructor(
    @InjectRepository(Personnel)
    private readonly personnelRepository: Repository<Personnel>,

    @InjectRepository(CompanySchema)
    private readonly companyRepository: Repository<CompanySchema>,
  ) {}

  async validatePersonnelByNationalCode(nationalCode: string): Promise<IValidatePersonByNationalCode> {
    const personnel: Personnel = await this.personnelRepository
    .findOne({
      where: {
        national_number: nationalCode
      }
    });

    if(!personnel) {
      throw new NotFoundException(
        Personnel
      );
    }

    const company: CompanySchema = await this.companyRepository.findOne({
      where: {
        id: personnel.company_id_fk
      }
    });

    const result: IValidatePersonByNationalCode = {
      id: personnel.id,
      firstName: personnel.first_name,
      lastName: personnel.last_name,
      mobile: personnel.mobile1 ?? personnel.mobile2,
      address: personnel.address,
      companyId: personnel.company_id_fk,
      companyName: company?.name
    };

    return result;
  }

  async getPersonnelDetailByNationalCode(nationalCode: string): Promise<IPersonnelDetailResponse> {
    const personnelDetail: IPersonnelDetailResponse =
      await this.personnelRepository.createQueryBuilder('personnel')
      .leftJoinAndSelect('company', 'company', 'personnel.company_id_fk = company.id')
      .where('personnel.national_number = :code', {
        code: nationalCode
      })
      .select([
        'personnel.id as id',
        'personnel.first_name as firstName',
        'personnel.last_name as lastName',
        'personnel.postal_code as postalCode',
        'personnel.mobile1 as mobile',
        'personnel.email as email',
        'company.name as companyName'
      ])
      .getRawOne();

      if(!personnelDetail) {
        throw new NotFoundException();
      }

      return personnelDetail;
  }
}