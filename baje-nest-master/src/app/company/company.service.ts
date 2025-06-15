import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateBoardMemberDTO } from './dto/create-board-member.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateBoardMemberDTO } from './dto/update-board-member.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyBoardMember } from './schemas/company-borad-member.schema';
import { CompanySchema } from "./schemas/company.entity";
import { DateProvider } from "../../common/helpers/date-provider";
import { CompanyResponse } from "./responses";
import { DeleteCompanyDto } from "./dto/delete-company.dto";

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(CompanySchema)
    private readonly company: Repository<CompanySchema>,


    @InjectRepository(CompanyBoardMember)
    private readonly boardMemberRepo: Repository<CompanyBoardMember>
  ) { }


  async createCompany(args: {
    request: CreateCompanyDto;
    files: Express.Multer.File[];
  }): Promise<void> {

    const {
      request,
      files
    } = args;

    await this.assertCompanyDoesNotExists({
      nationalId: request.nationalId
    });

    let logoUrl: string = null;
    let sealUrl: string = null;

    if(files['logo']) {
      logoUrl = `image/company/${files['logo'][0].filename}`;
    }

    if(files['seal']) {
      sealUrl = `image/company/${files['seal'][0].filename}`;
    }

    await this.company.insert({
      address: request.address,
      description: request.description,
      email: request.email,
      financeCode: request.financeCode,
      isGroup: request.isGroup === 'true',
      logoUrl: logoUrl,
      nationalId: request.nationalId,
      phone: request.phone,
      postalCode: request.postalCode,
      registerDate: request.registerDate,
      registerNumber: request.registerNumber,
      sealUrl: sealUrl,
      name: request.name,
      type: request.type,
    });
  }

  async updateCompany(args: {
    id: number;
    request: UpdateCompanyDto;
    files: Express.Multer.File[]
  }): Promise<void> {

    const {
      id,
      request,
      files
    } = args;

    const company: CompanySchema = await this.company.findOne({
      where: {
        id: id
      }
    });

    company.name = request.name ? request.name : company.name;
    company.registerNumber = request.registerNumber ? request.registerNumber: company.registerNumber;
    company.registerDate = request.registerDate ? new Date(request.registerDate) : company.registerDate;
    company.nationalId = request.nationalId ? request.nationalId : company.nationalId;
    company.financeCode = request.financeCode ? request.financeCode : company.financeCode;
    company.phone = request.phone ? request.phone : company.phone;
    company.address = request.address ? request.address : company.address;
    company.postalCode = request.postalCode ? request.postalCode : company.postalCode;
    company.email = request.email ? request.email : company.email;
    company.description = request.description ? request.description : company.description;
    company.isGroup = request.isGroup ? request.isGroup === 'true' : company.isGroup;
    company.type = request.type ? request.type : company.type;

    if(files['logo']) {
      company.logoUrl = `image/company/${files['logo'][0].filename}`;
    }

    if(files['seal']) {
      company.sealUrl = `images/company/${files['seal'][0].filename}`;
    }

    if(request.removeLogo ) {
      company.logoUrl = null;
    }

    await this.company.update({ id: id }, company);
  }

  async createBoardMember(dto: CreateBoardMemberDTO) {
    try {
      const _dto:any = dto;
      _dto.enabled = dto.enabled == true ? 1:0;

      if (dto.signature_rights) { dto.signature_rights = dto.signature_rights.toString(); }
      return await this.boardMemberRepo.createQueryBuilder()
        .insert()
        .values([_dto])
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async updateBoardMember(id: number, dto: UpdateBoardMemberDTO) {
    const _dto:any = dto;
      _dto.enabled = dto.enabled == true ? 1:0;
    if (dto.signature_rights) { dto.signature_rights = dto.signature_rights.toString(); }
    return await this.boardMemberRepo.createQueryBuilder()
      .update()
      .set({
        ..._dto
      })
      .where('id = :id', { id: id })
      .execute();
  }

  async findBoardMembers(id: number) {
    const list = await this.boardMemberRepo.createQueryBuilder('t1')
      .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
      .where('t1.company_id_fk = :cid', { cid: id })
      .select([
        't1.id as id',
        't1.from_date as from_date',
        't1.to_date as to_date',
        't1.role as role',
        't1.enabled as enabled',
        't1.signature_rights as signature_rights',
        't1.description as description',
        't2.id as personnel_id',
        't2.first_name as first_name',
        't2.last_name as last_name',
        't2.national_number as national_number'
      ])
      .getRawMany();

    return list;
  }

  async deleteBoardMember(id: number) {
    try {
      return await this.boardMemberRepo.createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    }
    catch (err) {
      throw err;
    }
  }

  async boardMemberByPersonnelId(id: number) {
    try {
      return await this.boardMemberRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
        .where('t1.personnel_id_fk = :pid', { pid: id })
        .select([
          't1.id as id',
          't1.from_date as from_date',
          't1.to_date as to_date',
          't1.role as role',
          't1.signature_rights as signature_rights',
          't1.description as description',
          't2.id as personnel_id',
          't2.first_name as first_name',
          't2.last_name as last_name',
          't2.national_number as national_number'
        ])
        .getRawOne();
    }
    catch (err) {
      throw err;
    }
  }

  async boardMemberDetail(id: number) {
    try {
      return await this.boardMemberRepo.createQueryBuilder('t1')
        .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
        .where('t1.id = :id', { id: id })
        .select([
          't1.id as id',
          't1.from_date as from_date',
          't1.to_date as to_date',
          't1.role as role',
          't1.signature_rights as signature_rights',
          't1.description as description',
          't1.enabled as enabled',
          't2.id as personnel_id',
          't2.first_name as first_name',
          't2.last_name as last_name',
          't2.national_number as national_number'
        ])
        .getOne();

    }
    catch (err) {
      throw err;
    }
  }

  async getCompanyDetail(args: { id: number }): Promise<CompanyResponse> {
    const company: CompanySchema = await this.company.findOne({
      where: {
        id: args.id
      }
    });

    if(!company) {
      throw new NotFoundException()
    }

    return new CompanyResponse({
      id: company.id,
      name: company.name,
      registerDate: company.registerDate.toString(),
      registerNumber: company.registerNumber,
      nationalId: company.nationalId,
      financeCode: company.financeCode,
      sealUrl: company.sealUrl,
      logoUrl: company.logoUrl,
      phone: company.phone,
      address: company.address,
      postalCode: company.postalCode,
      email: company.email,
      description: company.description,
      isGroup: company.isGroup,
      type: company.type
    });
  }

  async deleteCompanies(request: DeleteCompanyDto): Promise<void> {
    await this.company.delete(request.ids);
  }

  async listOfCompanies(): Promise<CompanyResponse[]> {
    const list: CompanySchema[] = await this.company.find();

    const result: CompanyResponse[] = [];
    list.map(company => {
      result.push(new CompanyResponse({
        id: company.id,
        name: company.name,
        registerDate: company.registerDate.toString(),
        registerNumber: company.registerNumber,
        nationalId: company.nationalId,
        financeCode: company.financeCode,
        logoUrl: company.logoUrl,
        sealUrl: company.sealUrl,
        phone: company.phone,
        address: company.address,
        postalCode: company.postalCode,
        email: company.email,
        description: company.description,
        isGroup: company.isGroup,
        type: company.type,
      }))
    })

    return result;
  }
  private async assertCompanyDoesNotExists(args: {
    nationalId: string
  }): Promise<void> {
    const company: CompanySchema =
      await this.company.findOne({
        where: {
          nationalId: args.nationalId
        }

      });

    if(company) {
      throw new HttpException(`Company with national Id: ${args.nationalId} already exists`, 403);
    }
  }
}
