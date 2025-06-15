import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilePath } from 'src/common/enums/file-path.enum';
import { createQueryBuilder, FindManyOptions, FindOneOptions, Not, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { HseService } from '../hse/hse.service';
import { CreateStyleDto } from './dto/create-style.dto';
import { CreateSystemDto } from './dto/create-system.dto';
import { CreateTypeDto } from './dto/create-type.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { DeleteSystemDto } from './dto/delete-system.dto';
import { DeleteVehicleDto } from './dto/delete-vehicle.dto';
import { UpdateStyleDto } from './dto/update-style.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleStyle } from './schemas/vehicle-style.schema';
import { VehicleSystem } from './schemas/vehicle-system.schema';
import { VehicleType } from './schemas/vehicle-type.schema';
import { Vehicle } from './schemas/vehicle.schema';
import * as Path from 'path';
import { ExcelService, IExcelHeader } from 'src/common/modules/excel/excel.service';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { SelectQuery } from "typeorm/query-builder/SelectQuery";
import { TestService } from "../test-module/test.service";
import { ThirdPartyInsurance } from "../insurance/third-party/schemas/third-party-insurance.schema";
import { HSEAudit } from "../hse/schemas/hse-audit.schema";
import { HSEChecklist } from "../hse/schemas/checklist.schema";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleType)
    private readonly typeRepo: Repository<VehicleType>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,

    @InjectRepository(VehicleSystem)
    private readonly systemRepo: Repository<VehicleSystem>,

    @InjectRepository(VehicleStyle)
    private readonly styleRepo: Repository<VehicleStyle>,

    @InjectRepository(ThirdPartyInsurance)
    private readonly thirdPartyInsurance: Repository<ThirdPartyInsurance>,

    @InjectRepository(HSEAudit)
    private readonly hseAuditRepo: Repository<HSEAudit>,

    @InjectRepository(HSEChecklist)
    private readonly hseChecklist: Repository<HSEChecklist>,

    private readonly excelService: ExcelService,

    private readonly testService: TestService
  ) { }

  async create(
    createVehicleDto: CreateVehicleDto
  ) {
    const count = await this.vehicleRepo.count({
      where: {
        organizationCode: createVehicleDto.organizationCode
      }
    });

    if (Boolean(count)) {
      throw new HttpException(
        'وسیله نقلیه دیگری با این کد در سامانه ثبت شده است',
        403
      );
    }

    const _dto: any = { ...createVehicleDto };

    return await this.vehicleRepo.createQueryBuilder()
      .insert()
      .values([
        _dto
      ])
      .execute();
  }

  async update(id: number, dto: UpdateVehicleDto, vehicleCardUrl: string,
    vehicleGreenCardUrl: string,
    ownDocUrl: string) {

    const _dto: any = { ...dto };

    if (vehicleGreenCardUrl) {
      _dto.greenCardUrl = `${FilePath.VEHICLE}/${vehicleGreenCardUrl}`;
    }

    if (vehicleCardUrl) {
      _dto.cardUrl = `${FilePath.VEHICLE}/${vehicleCardUrl}`;
    }

    if (ownDocUrl) {
      _dto.ownershipDocumentUrl = `${FilePath.VEHICLE}/${ownDocUrl}`;
    }

    return await this.vehicleRepo.createQueryBuilder()
      .update()
      .set({ ..._dto })
      .where({
        id: id
      })
      .execute();
  }


  async findOne(id: number) {
    const query: SelectQueryBuilder<unknown> = this.vehicleRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('vehicle_system', 't2', 't1.system_id_fk = t2.id')
      .innerJoinAndSelect('vehicle_type', 't3', 't1.type_id_fk = t3.id')
      .innerJoinAndSelect('vehicle_style', 't4', 't1.style_id_fk = t4.id')
      .leftJoinAndSelect('company', 't5', 't1.owner_id_fk = t5.id')
      .leftJoinAndSelect('personnel', 't6', 't5.manager_id_fk = t6.id')
      .where('t1.id = :id', { id: id });

    query.select([
      't1.id as id',
      't1.card_url as cardUrl',
      't1.chassis_number as chassisNumber',
      't1.color as color',
      't1.environment_id_fk as environmentId',
      't1.description as description',
      't1.engine_number as engineNumber',
      't1.gearbox as gearBox',
      't1.green_card_url as greenCardUrl',
      't1.made_year as madeYear',
      't1.organization_code as organizationCode',
      't1.owner_id_fk as ownerId',
      't1.owner_type as ownerType',
      't1.ownership_document_url as ownershipDocumentUrl',
      't1.plaque1 as plaque1',
      't1.plaque2 as plaque2',
      't1.plaque3 as plaque3',
      't1.plaque4 as plaque4',
      't1.price as price',
      't1.serial_number as serialNumber',
      't1.status as status',
      't1.vin_number as vinNumber',
      't1.date_type as dateType',
      't2.title as system',
      't2.id as systemId',
      't3.title as type',
      't3.id as typeId',
      't3.pelak as pelak',
      't4.title as style',
      't4.id as styleId',
      't5.name as ownerCompanyName',
      't5.national_id as nationalId',
      't6.first_name as ownerFirstName',
      't6.last_name as ownerLastName',
      't6.national_number as nationalNumber'
    ]);


    const result: any = await query.getRawMany();

    return result;
  }

  async delete(dto: DeleteVehicleDto) {

    let deletedItems: number = 0;

    for (const id of dto.ids) {
      let count: number = await this.thirdPartyInsurance.createQueryBuilder( 't1')
      .where('t1.vehicle_id_fk = :vid', {
        vid: id
      }).getCount();

      if(count === 0) {
        count = await this.hseAuditRepo.createQueryBuilder('t1')
        .where('t1.vehicle_id_fk = :vid', { vid: id })
        .getCount();
      }

      if (count === 0) {
        const result = await this.vehicleRepo.delete({
          id: +id
        });

        if (result.affected > 0) {
          deletedItems++;
        }
      }
    }

    return deletedItems;
  }

  async findAllTypes(): Promise<any[]> {
    try {
      const query: SelectQueryBuilder<VehicleType> = this.typeRepo.createQueryBuilder('type')
        .leftJoinAndSelect('vehicle', 'vehicle', 'vehicle.type_id_fk = type.id')
        .groupBy('type.id')
        .select([
          'type.id as id',
          'type.title as title',
          'type.code as code',
          'type.pelak as pelak',
          'COUNT(vehicle.id) as vehicleCount'
        ]);

      console.log(this.testService.getParamName());
      return await query.getRawMany();
    }
    catch (err) {
      throw err;
    }
  }

  async findAllTypesForHSE(ids: number[]) {
    try {
      if (ids.length == 0) {
        return await this.typeRepo.createQueryBuilder()
          .getMany();
      }
      else {
        return await this.typeRepo.createQueryBuilder()
          .where('not(id in (:...arr))', { arr: ids })
          .getMany();
      }

    }
    catch (err) {
      throw err;
    }
  }

  async findAllWithSearch(param: any) {
    try {
      if (Object.keys(param).length > 0) {

        return await this.vehicleRepo.createQueryBuilder('t1')
          .leftJoinAndSelect('vehicle_system', 't2', 't1.system_id_fk = t2.id')
          .leftJoinAndSelect('vehicle_type', 't3', 't1.type_id_fk = t3.id')
          .leftJoinAndSelect('vehicle_style', 't4', 't1.style_id_fk = t4.id')
          .select([
            't1.id as id',
            't1.card_url as card_url',
            't1.chassis_number as chassis_number',
            't1.color as color',
            't1.contract_id_fk as contract_id_fk',
            't1.description as description',
            't1.engine_number as engine_number',
            't1.gearbox as gearbox',
            't1.green_card_url as green_card_url',
            't1.made_year as made_year',
            't1.organization_code as organization_code',
            't1.owner_id_fk as owner_id_fk',
            't1.owner_type as owner_type',
            't1.ownership_document_url as ownership_document_url',
            't1.plaque1 as plaque1',
            't1.plaque2 as plaque2',
            't1.plaque3 as plaque3',
            't1.plaque4 as plaque4',
            't1.price as price',
            't1.serial_number as serial_number',
            't1.status as status',
            't1.vin_number as vin_number',
            't2.title as system',
            't2.id as system_id_fk',
            't3.title as type',
            't3.id as type_id_fk',
            't4.title as style',
            't4.id as title_id_fk'
          ])
          .where(`t1.${Object.keys(param)[0]} = :value`, { value: param[Object.keys(param)[0]] })
          .getRawMany();
      }
      else {
        return await this.vehicleRepo.createQueryBuilder( 't1')
          .leftJoinAndSelect('vehicle_system', 't2', 't1.system_id_fk = t2.id')
          .leftJoinAndSelect('vehicle_type', 't3', 't1.type_id_fk = t3.id')
          .leftJoinAndSelect('vehicle_style', 't4', 't1.style_id_fk = t4.id')
          .select([
            't1.id as id',
            't1.card_url as card_url',
            't1.chassis_number as chassis_number',
            't1.color as color',
            't1.contract_id_fk as contract_id_fk',
            't1.description as description',
            't1.engine_number as engine_number',
            't1.gearbox as gearbox',
            't1.green_card_url as green_card_url',
            't1.made_year as made_year',
            't1.organization_code as organization_code',
            't1.owner_id_fk as owner_id_fk',
            't1.owner_type as owner_type',
            't1.ownership_document_url as ownership_document_url',
            't1.plaque1 as plaque1',
            't1.plaque2 as plaque2',
            't1.plaque3 as plaque3',
            't1.plaque4 as plaque4',
            't1.price as price',
            't1.serial_number as serial_number',
            't1.status as status',
            't1.vin_number as vin_number',
            't2.title as system',
            't2.id as system_id_fk',
            't3.title as type',
            't3.id as type_id_fk',
            't4.title as style',
            't4.id as title_id_fk'
          ]).getRawMany();
      }
    }
    catch (err) {
      throw err;
    }
  }

  async getVehiclesOfContract(params: any): Promise<IResponseWithBuffer> {

    const query: SelectQueryBuilder<unknown> = this.vehicleRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('vehicle_system', 't2', 't1.system_id_fk = t2.id')
      .innerJoinAndSelect('vehicle_type', 't3', 't1.type_id_fk = t3.id')
      .innerJoinAndSelect('vehicle_style', 't4', 't1.style_id_fk = t4.id')
      .leftJoinAndSelect('environment', 't5', 't1.environment_id_fk = t5.id')
      .innerJoinAndSelect('company', 't6', 't5.company_id_fk = t6.id')
      .leftJoinAndSelect('personnel', 't7', 't1.owner_id_fk = t7.id')
      .leftJoinAndSelect('company', 't8', 't1.owner_id_fk = t8.id')


    if (params.environmentId && params.environmentId !== '-1') {
      query.andWhere('t1.environment_id_fk = :eid', { eid: params.environmentId });
    }

    if (params.companyId && params.companyId !== '-1' && (params.environmentId === '-1' || !params.environmentId)) {
      query.andWhere('t5.company_id_fk = :cid',
        {
          cid: params.companyId
        });
    }

    query.select([
      't1.id as id',
      't1.card_url as cardUrl',
      't1.chassis_number as chassisNumber',
      't1.color as color',
      't1.environment_id_fk as environmentId',
      't1.description as description',
      't1.engine_number as engineNumber',
      't1.gearbox as gearBox',
      't1.green_card_url as greenCardUrl',
      't1.made_year as madeYear',
      't1.organization_code as organizationCode',
      't1.owner_id_fk as ownerId',
      't1.owner_type as ownerType',
      't1.ownership_document_url as ownershipDocumentUrl',
      't1.plaque1 as plaque1',
      't1.plaque2 as plaque2',
      't1.plaque3 as plaque3',
      't1.plaque4 as plaque4',
      't1.price as price',
      't1.serial_number as serialNumber',
      't1.status as status',
      't1.vin_number as vinNumber',
      't2.title as system',
      't2.id as systemId',
      't3.title as type',
      't3.id as typeId',
      't4.title as style',
      't4.id as titleId',
      't5.title as environmentTitle',
      't6.name as companyName',
      't7.first_name as ownerFirstName',
      't7.last_name as ownerLastName',
      't8.name as ownerCompanyName'
    ]);


    const result: any = await query.getRawMany();

    const excelHeaders: IExcelHeader[] = [
      {
        key: 'id',
        value: 'شناسه'
      },
      {
        key: 'chassisNumber',
        value: 'شماره شاسی'
      },
      {
        key: 'color',
        value: 'رنگ'
      },
      {
        key: 'contractId',
        value: 'شماره قرارداد'
      },
      {
        key: 'engineNumber',
        value: 'شماره موتور'
      },
      {
        key: 'gearBox',
        value: 'نوع دنده'
      },
      {
        key: 'madeYear',
        value: 'سال ساخت'
      },
      {
        key: 'organizationCode',
        value: 'کد سازمانی'
      },
      {
        key: 'نوع مالکیت',
        value: 'ownerType'
      },
      {
        key: 'plaque1',
        value: 'پلاک ۱'
      },
      { key: 'plaque2', value: 'پلاک ۲' },
      { key: 'plaque3', value: 'پلاک ۳' },
      { key: 'plaque4', value: 'پلاک ۴' },
      { key: 'price', value: 'قیمت' },
      { key: 'serialNumber', value: 'شماره سریال' },
      { key: 'vinNumber', value: 'شماره وین' },
      { key: 'system', value: 'سیستم' },
      { key: 'type', value: 'تیپ' },
      { key: 'contractName', value: 'نام قرارداد' },
      { key: 'companyName', value: 'نام شرکت' },
      { key: 'ownerFirstName', value: 'نام مالک' },
      { key: 'ownerLastName', value: 'نام خانوادگی مالک' },
      { key: 'ownerCompanyName', value: 'نام شرکت مالک' }
    ];

    const excelBuffer: Buffer = await this.excelService.create({
      header: excelHeaders,
      stringJson: JSON.stringify(result)
    });

    return {
      list: result,
      buffer: excelBuffer
    };
  }

  async allTypes() {
    return await this.typeRepo.find();
  }

  async allSystems(typeId: number) {
    return await this.systemRepo.find({
      where: {
        typeId: typeId
      }

    });
  }

  async allStyles(systemId: number) {
    return await this.styleRepo.find({
      where: {
        systemId: systemId
      }

    });
  }

  async getAllSystems() {
    const query: SelectQueryBuilder<VehicleSystem> = this.systemRepo.createQueryBuilder('system')
      .leftJoinAndSelect('vehicle', 'vehicle', 'vehicle.system_id_fk = system.id')
      .groupBy('system.id')
      .select([
        'system.id as id',
        'system.title as title',
        'system.logo as logo',
        'COUNT(vehicle.id) as vehicleCount'
      ]);

    return await query.getRawMany();
  }

  async createSystem(
    dto: CreateSystemDto,
    fileName: string
  ) {
    const count: number = await this.systemRepo.count({
      where: {
        title: dto.title,
      }
    });

    if (count > 0) {
      throw new HttpException('system already exists', 400);
    }

    return this.systemRepo.insert({
      title: dto.title,
      logo: fileName != null ? `${FilePath.VEHICLE}/${fileName}` : null,
      enTitle: dto.enTitle
    });
  }

  async updateSystem(
    dto: UpdateSystemDto,
    fileName: string,
    id: number
  ) {
    const count: number = await this.systemRepo.count({
      where: {
        id: Not(id),
        title: dto.title
      }
    });

    if (count > 0) {
      throw new HttpException('system already exists', 400);
    }

    const _dto: any = { ...dto };
    if (_dto.typeId) {
      _dto.typeId = +_dto.typeId;
    }


    if (fileName) {
      _dto.logo = `${FilePath.VEHICLE}/${fileName}`;
    }
    return await this.systemRepo.createQueryBuilder()
      .update()
      .set({
        ..._dto
      })
      .where({
        id: id
      })
      .execute();
  }

  async deleteSystem(dto: DeleteSystemDto): Promise<number> {
    let deletedItems: number = 0;

    for (const id of dto.ids) {
      const count: number = await this.systemRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('vehicle_style', 't2', 't2.system_id_fk = t1.id')
        .where('t1.id = :id', { id: id })
        .getCount();

      if (count === 0) {
        const result = await this.systemRepo.delete({
          id: +id
        });

        if (result.affected > 0) {
          deletedItems++;
        }
      }
    }

    return deletedItems;
  }

  async createStyle(
    dto: CreateStyleDto
  ) {
    const count: number = await this.styleRepo.count({
      where: {
        title: dto.title,
        systemId: dto.systemId,
        typeId: dto.typeId
      }
    });

    if (count > 0) {
      throw new HttpException('style already exists', 400);
    }

    return await this.styleRepo.insert({
      title: dto.title,
      systemId: dto.systemId,
      typeId: dto.typeId
    });
  }

  async updateStyle(
    dto: UpdateStyleDto,
    id: number
  ) {
    const count: number = await this.styleRepo.count({
      where: {
        title: dto.title,
        id: Not(id)
      }
    });

    if (count > 0) {
      return new HttpException('style already exists', 400);
    }

    return await this.styleRepo.createQueryBuilder()
      .update()
      .set({
        ...dto
      })
      .where({
        id: id
      })
      .execute();
  }

  async deleteStyle(dto: DeleteSystemDto): Promise<number> {
    let deletedItems: number = 0;

    for (const id of dto.ids) {
      const count: number = await this.styleRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('vehicle', 't2', 't2.style_id_fk = t1.id')
        .where('t1.id = :id', { id: id })
        .getCount();

      if (count === 0) {
        const result = await this.styleRepo.delete({
          id: +id
        });

        if (result.affected > 0) {
          deletedItems++;
        }
      }
    }

    return deletedItems;
  }

  async getAllStyles() {
    const list =  await this.styleRepo.createQueryBuilder( 't1')
      .leftJoinAndSelect('vehicle_system', 't2', 't1.system_id_fk = t2.id')
      .innerJoinAndSelect('vehicle_type', 't3', 't1.type_id_fk = t3.id')
      .select([
        't1.title as title',
        't1.id as id',
        't2.title as systemTitle',
        't3.title as type',
      ])
      .getRawMany();

    for(const item of list) {
      const query: SelectQueryBuilder<unknown> = this.vehicleRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('vehicle_system', 't2', 't1.system_id_fk = t2.id')
      .innerJoinAndSelect('vehicle_type', 't3', 't1.type_id_fk = t3.id')
      .innerJoinAndSelect('vehicle_style', 't4', 't1.style_id_fk = t4.id')
      .innerJoinAndSelect('environment', 't5', 't1.environment_id_fk = t5.id')
      .innerJoinAndSelect('company', 't6', 't5.company_id_fk = t6.id')
      .leftJoinAndSelect('personnel', 't7', 't1.owner_id_fk = t7.id')
      .leftJoinAndSelect('company', 't8', 't1.owner_id_fk = t8.id')
      .where('t4.id = :id', { id: item.id });

      item.vehicleCount = await query.getCount();
    }

    return list;
  }

  async createType(dto: CreateTypeDto) {
    const count: number = await this.typeRepo.count({
      where: {
        title: dto.title
      }
    });
    if (count > 0) {
      throw new HttpException('type already exists', 400);
    }

    return await this.typeRepo.insert({ ...dto });
  }

  async updateType(id: number, dto: UpdateTypeDto) {
    const count: number = await this.typeRepo.count({
      where: {
        id: Not(id),
        title: dto.title
      }
    })
    if (count > 0) {
      throw new HttpException('type already exists', 400);
    }

    return await this.typeRepo.createQueryBuilder()
      .update()
      .set({
        ...dto
      })
      .where({
        id: id
      })
      .execute();
  }

  async getAllTypes() {
    console.log('here');
    const list: SelectQueryBuilder<VehicleType> = this.typeRepo.createQueryBuilder('type')
      .leftJoinAndSelect('vehicle', 'vehicle', 'vehicle.type_id_fk = type.id')
      .groupBy('type.id')
      .select([
        'type.id as amir',
        'type.title as title',
        'type.code as code',
        'type.pelak as pelak',
        'vehicle.id as vid'
      ]);

    console.log('get all types');
    console.log(this.testService.getParamName());
    return await list.getRawMany();
  }

  async deleteType(dto: DeleteSystemDto): Promise<number> {
    let deletedItems: number = 0;

    for (const id of dto.ids) {
      let count: number = await this.typeRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('vehicle_system', 't2', 't2.type_id_fk = t1.id')
        .where('t1.id = :id', { id: id })
        .getCount();

      if (count > 0) {
        count = await this.hseChecklist.createQueryBuilder('hse_checklist')
          .where('vehicle_type_id_fk = :tid', { tid: id })
          .getCount();
      }


      if (count === 0) {
        const result = await this.typeRepo.delete({
          id: +id
        });

        if (result.affected > 0) {
          deletedItems++;
        }
      }
    }

    return deletedItems;
  }

  async repairImages() {
    const list = await this.systemRepo.find({
      where: {
        logo: Not('')
      }
    });

    for(let item of list) {
      if(item.logo != null) {
        item.logo = `${FilePath.VEHICLE}/${Path.basename(item.logo)}`;
      }

      await this.systemRepo.save(item);
    }
  }
}
