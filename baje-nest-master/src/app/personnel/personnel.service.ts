import { HttpException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as dbffile from "dbffile";
import * as fs from "fs";
import * as jmoment from "jalali-moment";
import * as excelReader from "read-excel-file/node";
import { Gender } from "src/common/enums/gender.enum";
import { MaritalStatus } from "src/common/enums/marital-status.enum";
import { PersonnelStatus } from 'src/common/enums/personnel-status.enum';
import { Role } from "src/common/enums/roles.enum";
import { BirthPlace } from "src/common/helpers/birthplace";
import { DBFHelper } from "src/common/helpers/dbf";
import { Encryption } from "src/common/helpers/encryption";
import { FileClass } from "src/common/helpers/file";
import { IToken } from "src/common/helpers/jwt";
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { ExcelService, IExcelHeader } from 'src/common/modules/excel/excel.service';
import { Repository, SelectQueryBuilder } from "typeorm";
import { JobTitleService } from "../jobTitle/job-title.service";
import { CreatePersonDTO } from "./dtos/create-person.dto";
import { CreatePersonnelAccessDTO } from "./dtos/create-personnel-access.dto";
import { CreatePersonnelJobDTO } from "./dtos/create-personnel-job.dto";
import { CreatePersonnelShiftDTO } from "./dtos/create-personnel-shift.dto";
import { CreateSubordinateDTO } from './dtos/create-subordinate.dto';
import { UpdatePersonDTO } from "./dtos/update-person.dto";
import { UpdatePersonnelAccessDTO } from "./dtos/update-personnel-access.dto";
import { UpdatePersonnelJobDTO } from "./dtos/update-personnel-job.dto";
import { PersonnelAccess } from "./schemas/personnel-access.schema";
import { PersonnelJobs } from "./schemas/personnel-jobs.schema";
import { PersonnelShift } from "./schemas/personnel-shift.schema";
import { Personnel } from "./schemas/personnel.schema";
import { Subordinate } from "./schemas/subordinate.schema";
import { Access } from "../../common/helpers/access";
import { IPersonnelSynchronization } from "./interfaces/personnel-synchronization.response";
import { DateProvider } from "../../common/helpers/date-provider";
import { PersonnelAvailabilityRequest } from "./dtos/personnel-availability.dto";
import { PersonnelAvailabilityResponse } from "./interfaces/personnel-availability.interface";
import { DamageService } from "../damageService/schemas/damageService.schema";
import { TimeOff } from "../timeOff/schemas/timeoff.schema";
import { PersonnelIncident } from "../incident/schemas/incident.schema";
import { PersonnelImprest } from "../imprest/schemas/imprest.schema";
import { PersonnelMission } from "../mission/schemas/mission.schema";
import { InsuranceTakmiliPersonnelSchema } from "../insurance/takmili/schemas/takmili.schema";
import { InsuranceHistoryClaim } from "../insurance/history-claim/schemas/history-claim.schema";
import { Insurance } from "../insurance/schemas/insurance.schema";
import { Settle } from "../settle/schemas/settle.schema";
import { InsuranceTaminPersonnel } from "../insurance/tamin/schemas/tamin-personnel.schema";
import { DoctorVisit } from "../doctorVisit/schemas/visit.schema";

@Injectable()
export class PersonnelService {

    private logger: Logger = new Logger(PersonnelService.name);

    constructor(@InjectRepository(Personnel) private model: Repository<Personnel>,
        @InjectRepository(PersonnelAccess) private accessModel: Repository<PersonnelAccess>,
        @InjectRepository(Subordinate) private subordinateModel: Repository<Subordinate>,
        @InjectRepository(PersonnelShift) private readonly personnelShiftRepo: Repository<PersonnelShift>,
        @InjectRepository(PersonnelJobs) private readonly personnelJobRepo: Repository<PersonnelJobs>,
        @InjectRepository(DamageService)
        private readonly damageServiceRepo: Repository<DamageService>,

        @InjectRepository(TimeOff)
        private readonly timeOffRepo: Repository<TimeOff>,

        @InjectRepository(PersonnelIncident)
        private readonly incidentRepo: Repository<PersonnelIncident>,

        @InjectRepository(PersonnelImprest)
        private readonly imprestRepo: Repository<PersonnelImprest>,

        @InjectRepository(PersonnelMission)
        private readonly missionRepo: Repository<PersonnelMission>,

        @InjectRepository(InsuranceTakmiliPersonnelSchema)
        private readonly insuranceTakmiliRepo: Repository<InsuranceTakmiliPersonnelSchema>,

        @InjectRepository(InsuranceHistoryClaim)
        private readonly insuranceHistoryRepo: Repository<InsuranceHistoryClaim>,

        @InjectRepository(Insurance)
        private readonly insuranceRepo: Repository<Insurance>,

        @InjectRepository(Settle)
        private readonly settleRepo: Repository<Settle>,

        @InjectRepository(InsuranceTaminPersonnel)
        private readonly insuranceTaminRepo: Repository<InsuranceTaminPersonnel>,

        @InjectRepository(DoctorVisit)
        private readonly doctorVisitRepo: Repository<DoctorVisit>,

        private readonly jobTitleService: JobTitleService,
        private readonly excelService: ExcelService,
    ) {
    }


    async findPersonByUserPassword(username: string, password: string): Promise<Personnel> {
        try {
            return await this.model.createQueryBuilder()
                .where('national_number = :national_number and password = :password', {
                    national_number: username,
                    password: password
                }).getOne();
        }
        catch (err) {
            throw err;
        }
    }

    async updateCode(id: number, code: string): Promise<boolean> {
        try {
            await this.model.createQueryBuilder()
                .update()
                .set({
                    code: code
                })
                .where('id = :id', { id: id })
                .execute();
            return true;
        }
        catch (err) {
            throw err;
        }
    }

    async findPersonnelById(id: number): Promise<Personnel> {
        try {
            return await this.model.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();
        }
        catch (err) {
            throw err;
        }
    }

    async getPersonnelAccess(id: number): Promise<PersonnelAccess[]> {
        try {
            const list:PersonnelAccess[] = await this.accessModel.find({
                where: {
                    personnel_id_fk: id
                }
            });

            return list;
        }
        catch (err) {
            throw err;
        }
    }

    async findPersonnel(conditionString: string, fields: any): Promise<any> {
        try {
            return this.model.createQueryBuilder()
                .where(conditionString, fields)
                .getMany()
        }
        catch (err) {
            throw err;
        }
    }

    async insertPersonn(dto: CreatePersonDTO) {

        try {

            if (dto.mobile1) {
                const checkMobile = await this.findPersonnel('mobile1 = :m1 or mobile2 = :m2', {
                    m1: dto.mobile1,
                    m2: dto.mobile1
                });
                if (checkMobile.length > 0) {
                    throw new HttpException('شماره موبایل قبلا در سامانه وارد شده است', 400);
                }
            }

            if (dto.mobile2) {
                const checkMobile = await this.findPersonnel('mobile1 = :m1 or mobile2 = :m2', {
                    m1: dto.mobile2,
                    m2: dto.mobile2
                });
                if (checkMobile.length > 0) {
                    throw new HttpException('شماره موبایل قبلا در سامانه وارد شده است', 400);
                }
            }



            if (dto.national_number) {
                const duplicate = await this.findPersonnel('national_number = :nn or insurance_number = :in', {
                    nn: dto.national_number,
                    in: dto.insurance_number
                });

                if (duplicate.length > 0) {
                    throw new HttpException('پرسنل با این مشخصات قبلا در سامانه وارد شده است', 400);
                }
            }




            //insert personnel
            if (dto.password) {
                dto.password = await new Encryption().encrypt(dto.password);
            }
            else {
                dto.password = await new Encryption().encrypt(dto.national_number);
            }



            //TODO: get job code from job_id
            if (dto.job_title_id) {
                const job = await this.jobTitleService.find('id = :id', { id: dto.job_title_id });
                if (job.length > 0) {
                    dto.job_title = job[0]?.code;
                }
            }

            if (!dto.status) {
                dto.status = PersonnelStatus.NOT_APPROVED;
            }

            const _dto: any = dto;

            _dto.shahid_was_colleague = dto.shahid_was_colleague == true ? 1 : 0;

            const newPersonnel = await this.model.createQueryBuilder()
                .insert()
                .values([
                    {
                        ..._dto,
                        contract_id_fk: dto.contract_id != null ? +dto.contract_id : null,
                        updatedOn: DateProvider.today()
                    }
                ])
                .execute();


            //check subordinates
            if (dto.subordinates) {
                for (let i = 0; i < dto.subordinates.length; i++) {
                    await this.subordinateModel.createQueryBuilder()
                        .insert()
                        .values([
                            {
                                personnel_id_fk: newPersonnel.identifiers[0]?.id,
                                ...dto.subordinates[i]
                            }
                        ])
                        .execute();
                }
            }

            //personnel access
            if (dto.permissions) {
                for (let i = 0; i < dto.permissions.length; i++) {
                    await this.accessModel.createQueryBuilder()
                        .insert()
                        .values([
                            {
                                ...dto.permissions[i],
                                personnel_id_fk: newPersonnel.identifiers[0]?.id
                            }
                        ])
                        .execute();
                }
            }

            return {
                id: newPersonnel.identifiers[0]?.id
            }
        }
        catch (err) {
            throw err;
        }
    }


    async updatePerson(id: number, nationalFrontFile: string, nationalRearFile: string, birthCertFile: string, armyServiceFile: string, personFile: string, signFile: string, dto: UpdatePersonDTO, user: IToken) {
        try {
            const personnel = await this.model.createQueryBuilder()
                .where('id = :id', { id: id })
                .getOne();

            if (!personnel) {
                throw new HttpException('invalid personnel id', 400);
            }

            if (dto.mobile1 || dto.mobile2) {
                if (personnel.mobile1 != dto.mobile1 || personnel.mobile2 != dto.mobile2) {
                    //must check for mobile duplication
                    const mobileDuplicate = await this.model.createQueryBuilder()
                        .where('mobile1 = :m1 or mobile2 = :m2', {
                            m1: dto.mobile1,
                            m2: dto.mobile2
                        })
                        .getOne();

                    if (mobileDuplicate) {
                        throw new HttpException(`mobile number already exists`, 400);
                    }
                }
            }

            if (dto.national_number) {
                if (personnel.national_number != dto.national_number) {
                    const nationalNumberDuplicate = await this.model.createQueryBuilder()
                        .where('national_number = :nn', {
                            nn: dto.national_number
                        })
                        .getOne();
                    if (nationalNumberDuplicate) {
                        throw new HttpException('national number already exists', 400);
                    }
                }
            }

            if (dto.job_title_id) {
                const job = await this.jobTitleService.find('id = :id', { id: dto.job_title_id });
                if (job.length > 0) {
                    dto.job_title = job[0]?.code;
                }
            }




            if (dto.private_description && !user.isSuper) {
                //check if personnel has access
                if (!await this.personnelHasAccess(Role.person_privatedescription, user.id)) {
                    delete dto.private_description;
                }
            }

            if (!user.isSuper) {
                if (!await this.personnelHasAccess(Role.person_editcontact, user.id)) {
                    delete dto.email;
                    delete dto.mobile2;
                    delete dto.mobile1;
                    delete dto.phone;
                    delete dto.address;
                    delete dto.postal_code;
                    delete dto.email;
                }
            }



            if (dto.password) {
                dto.password = await new Encryption().encrypt(dto.password);
            }

            const updateDTO: any = {
                ...dto
            };
            delete updateDTO.subordinates;
            delete updateDTO.permissions;
            delete updateDTO.job_title_id;

            if (nationalFrontFile) {
                updateDTO.national_card_front_url = nationalFrontFile
            }

            if (nationalRearFile) {
                updateDTO.national_card_rear_url = nationalRearFile;
            }

            if (birthCertFile) {
                updateDTO.birth_certificate_url = birthCertFile;
            }

            if (armyServiceFile) {
                updateDTO.army_service_card_url = armyServiceFile;
            }

            if (personFile) {
                updateDTO.image_url = personFile;
            }

            if (signFile) {
                updateDTO.sign_url = signFile;
            }

            updateDTO.updatedOn = DateProvider.today();

            await this.model.createQueryBuilder()
                .update()
                .set({
                    ...updateDTO
                })
                .where('id = :id', { id: id })
                .execute();

            return {
                id: id
            }
        }
        catch (err) {
            throw err;
        }
    }


    private async personnelHasAccess(access: string, userId: number): Promise<Boolean> {
        try {
            // const _access = await this.accessModel.createQueryBuilder()
            //     .where('access = :access and personnel_id_fk = :pid', {
            //         access: access,
            //         pid: userId
            //     })
            //     .getOne();

            // return _access ? true : false;
            return true;
        }
        catch (err) {
            throw err;
        }
    }

    async getPersonnelSubordinates(personnelId: number): Promise<Subordinate[]> {
        try {
            return await this.subordinateModel.createQueryBuilder()
                .where('personnel_id_fk = :pid', { pid: personnelId })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }

    async updateSubordinate(id: number, dto: any) {
        try {

            delete dto.personnel_id_fk;
            return await this.subordinateModel.createQueryBuilder()
                .update()
                .set({
                    ...dto
                })
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }

    async deleteSubordinate(id: number) {
        try {
            return await this.subordinateModel.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }

    async updatePersonnelPermission(personnelId: number, dto: UpdatePersonnelAccessDTO) {
        try {


            //delete previous
            await this.accessModel.createQueryBuilder()
                .delete()
                .where('personnel_id_fk = :pid', { pid: personnelId })
                .execute();



            const newPermission = this.accessModel.create(dto.data);

            newPermission.forEach(item => {
                item.personnel_id_fk = personnelId;
            })

            return await this.accessModel.save(newPermission);

        }
        catch (err) {
            throw err;
        }
    }

    async personnelOfCompanyContract(
        user: IToken,
        companyId: number,
        contractId: number,
        params: any,
    ): Promise<any> {

        const page: number = params.page ? +params.page : 0;
        const size: number = params.size ? +params.size : 0;
        let total: number = 0;

        const selectFields: string[] = [
            't2.subject as contract_subject',
            't3.name as company_name',
            't1.id as id',
            't1.contract_id_fk as contract_id',
            't1.first_name as first_name',
            't1.last_name as last_name',
            't1.mobile1 as mobile1',
            't1.father_name as father_name',
            't1.national_number as national_number',
            't1.status as status',
            't1.insurance_number as insurance_number',
            't1.id_number as id_number',
            't1.image_url as image_url',
            't1.birth_date as birth_date'
        ];


        let query: SelectQueryBuilder<Personnel> =
            await this.model.createQueryBuilder('t1');

        const accessClass: Access = new Access(user.access);

        if (user.isSuper || accessClass.isInBajeAccessLevel('person/list')) {

            query
                .leftJoinAndSelect('contract', 't2', 't1.contract_id_fk = t2.id')
                .leftJoinAndSelect('company', 't3', 't1.company_id_fk = t3.id')
                .select([...selectFields]);

            if (companyId != -1) {
                query.andWhere('t1.company_id_fk = :id', { id: companyId });
            }

            if (contractId != -1) {
                query.andWhere('t1.contract_id_fk = :cid', { cid: contractId });
            }

            if (params.national_number) {
                query.andWhere('t1.national_number like :nationalNumber', {
                    nationalNumber: `%${params.national_number}%`
                })
            }

            if (params.first_name) {
                query.andWhere('t1.first_name like :firstName', {
                    firstName: `%${params.first_name}%`
                });
            }

            if (params.last_name) {
                query.andWhere('t1.last_name like :lastName', {
                    lastName: `%${params.last_name}%`
                })
            }

            if (params.mobile1) {
                query.andWhere('t1.mobile1 like :mobile1', {
                    mobile1: `%${params.mobile1}%`
                })
            }

            if (params.insurance_number) {
                query.andWhere('t1.insurance_number like :insurance', {
                    insurance: `%${params.insurance}%`
                })
            }

            if (params.status) {
                query.andWhere('t1.status like :status', {
                    status: `%${params.status}%`
                })
            }

            if(params.father_name) {
                query.andWhere('t1.father_name like :fatherName', {
                    fatherName: `%${params.father_name}%`
                })
            }

            if(params.id_number) {
                query.andWhere('t1.id_number like :idNumber', {
                    idNumber: `%${params.id_number}%`
                })
            }

            // if(params.filter && params.fvalue) {
            //     query.andWhere(`${params.filter} like :value`, {
            //         value: `%${params.fvalue}%`
            //     });
            // }

            total = await query.getCount();
        }
        else {
            //get user access
            const access = await this.accessModel.createQueryBuilder()
                .where('personnel_id_fk=:pid', {
                    pid: user.id,
                })
                .getMany();

            let companies;
            let contracts;

            if (companyId == -1) {
                companies = access.map(item => {
                    return item.company_id_fk;
                })
            }
            else {
                companies = [companyId];
            }


            if (contractId == -1) {
                contracts = access.map(item => {
                    return item.contract_id_fk;
                })
            }
            else {
                contracts = [contractId];
            }

            query
                .leftJoinAndSelect('contract', 't2', 't1.contract_id_fk = t2.id')
                .leftJoinAndSelect('company', 't3', 't1.company_id_fk = t3.id')
                .where('t1.company_id_fk in (:companies) and t1.contract_id_fk in (:contracts)', {
                    companies: companies.toString(),
                    contracts: contracts.toString()
                })
                .select([...selectFields])
                .getRawMany();

            if (params.national_number) {
                query.andWhere('t1.national_number like :nationalNumber', {
                    nationalNumber: `%${params.national_number}%`
                })
            }

            if (params.first_name) {
                query.andWhere('t1.first_name like :firstName', {
                    firstName: `%${params.first_name}%`
                });
            }

            if (params.last_name) {
                query.andWhere('t1.last_name like :lastName', {
                    lastName: `%${params.last_name}%`
                })
            }

            if (params.mobile1) {
                query.andWhere('t1.mobile1 like :mobile1', {
                    mobile1: `%${params.mobile1}%`
                })
            }

            if (params.insurance_number) {
                query.andWhere('t1.insurance_number like :insurance', {
                    insurance: `%${params.insurance}%`
                })
            }

            if (params.status) {
                query.andWhere('t1.status like :status', {
                    status: `%${params.status}%`
                })
            }

            if(params.father_name) {
                query.andWhere('t1.father_name like :fatherName', {
                    fatherName: `%${params.father_name}%`
                })
            }

            if(params.id_number) {
                query.andWhere('t1.id_number like :idNumber', {
                    idNumber: `%${params.id_number}%`
                })
            }

            // if (params.filter && params.fvalue) {
            //     query.andWhere(`${params.filter} like :value`, {
            //         value: `%${params.fvalue}%`
            //     });
            // }

            total = await query.getCount();
        }


        if (page > 0 && size > 0) {
            query.offset((page - 1) * size);
        }

        if (size > 0) {
            query.limit(size);
        }



        if (params.sort && params.stype) {
            query.addOrderBy(params.sort, params.stype.toString().toUpperCase());
        }

        const list: any[] = await query.getRawMany();

        return {
            list: list,
            total: total
        }
    }

    async personnelOfCompanyContractWithBuffer(
        user: IToken,
        companyId: number,
        contractId: number,
        params: any
    ): Promise<IResponseWithBuffer> {

        const list: any = await this.personnelOfCompanyContract(
            user,
            companyId,
            contractId,
            params
        );

        const headers: IExcelHeader[] = [
            {
                "key":"national_number",
                "value":"کد ملی"
              },
              {
                "key":"first_name",
                "value":"نام"
              },
              {
                "key":"last_name",
                "value":"نام خانوادگی"
              },
              {
                "key":"father_name",
                "value":"نام پدر"
              },
              {
                "key":"id_number",
                "value":"شماره شناسنامه"
              },
              {
                "key":"mobile1",
                "value":"موبایل"
              },
              {
                "key":"insurance_number",
                "value":"شماره بیمه"
              },
        ];

        const excelBuffer: Buffer = await this.excelService.create({
            header: headers,
            stringJson: JSON.stringify(list.list)
        });

        return {
            list: list,
            buffer: excelBuffer
        };
    }

    async importPersonnelFromDBF(file: string, companyId: number, contractId: number) {
        try {
            const dbfFile = await dbffile.DBFFile.open(file);
            const records = await dbfFile.readRecords();

            if (records.length) {
                let successCounter = 0;
                let totalRecords = 0;

                const dbfHelper = new DBFHelper();

                for (let record of records) {
                    const firstName = await dbfHelper.convert(record.DSW_FNAME);

                    const lastName = await dbfHelper.convert(record.DSW_LNAME);

                    const fatherName = await dbfHelper.convert(record.DSW_DNAME);

                    const idNumber = await dbfHelper.convert(record.DSW_ID1).toString().split('').reverse().join('');


                    const birthDate = jmoment(record.DSW_BDATE, 'jYYYY/jMM/jDD').utc(true).format('YYYY/MM/DD 00:00:00');

                    const sex = await dbfHelper.convert(record.DSW_SEX);

                    const origin = await dbfHelper.convert(record.DSW_NAT);

                    const nationalCode = record.PER_NATCOD.toString();

                    const password = await new Encryption().encrypt(nationalCode);

                    const jobCode = record.DSW_JOB;

                    const birthPlace = await new BirthPlace().findPlace(nationalCode);

                    const insuranceNumber = record.DSW_ID1;

                    //check for duplicate
                    const duplicate = await this.model.createQueryBuilder()
                        .where('national_number = :nn', { nn: nationalCode })
                        .getOne();


                    if (duplicate == undefined) {
                        //must insert
                        await this.model.createQueryBuilder()
                            .insert()
                            .values([
                                {
                                    first_name: firstName.toString(),
                                    last_name: lastName.toString(),
                                    father_name: fatherName.toString(),
                                    id_number: idNumber,
                                    sex: sex == 'مرد' ? Gender.MALE : Gender.FEMALE,
                                    password: password,
                                    nation: origin.toString() == 'ایرانی' ? 'iranian' : 'non_iranian',
                                    national_number: nationalCode.toString(),
                                    company_id_fk: companyId,
                                    isargar: 'none',
                                    birth_date: birthDate,
                                    marital_status: MaritalStatus.SINGLE,
                                    insurance_number: insuranceNumber.toString(),
                                    job_title: jobCode.toString(),
                                    birth_place: birthPlace.toString(),
                                    id_issue_place: birthPlace.toString(),
                                    contract_id_fk: Number(contractId),
                                    insurance_share_employee: 1,
                                    insurance_share_employer: 1,
                                    insurance_share_unemployment: 1,
                                    insurance_share_harmful: 0
                                }
                            ])
                            .execute();
                        successCounter++;
                    }

                    totalRecords++;
                }


                return {
                    success: successCounter,
                    total: totalRecords
                }
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            //delete file
            if (file) {
                fs.unlink(file, (err) => {
                    if (!err) {
                        this.logger.error('db file deleted');
                    }
                })
            }
        }
    }



    async importPersonnelFromExcel(file: string, companyId?: number, contractId?: number): Promise<any> {
        try {
            const rows = await excelReader.default(file, { sheet: 1 });

            let total = 0;
            let successCounter = 0;

            for (let i = 0; i < rows.length; i++) {
                const nationalCode = rows[i][0]?.toString();
                const firstName = rows[i][1]?.toString();
                const lastName = rows[i][2]?.toString();
                const fatherName = rows[i][3]?.toString();
                let idNumber = rows[i][4]?.toString();
                const birthDate = rows[i][5]?.toString();
                const gender = rows[i][6] == '1' ? Gender.MALE : Gender.FEMALE;
                const origin = rows[i][7] == '1' ? 'iranian' : 'non_iranian';
                const publicDescription = rows[i][8]?.toString();
                const privateDescription = rows[i][9]?.toString();
                const insuranceNumber = rows[i][10]?.toString();
                const jobCode = rows[i][11]?.toString();
                const maritalStatus = rows[i][12] == null ? '0' : rows[i][12]?.toString();
                const armyServiceCode = rows[i][13] == null ? '0' : rows[i][13]?.toString();
                const personnelNumber = rows[i][14]?.toString();
                const statusCode = rows[i][15] == '1' ? 'active' : 'inactive';
                const mobile = rows[i][16]?.toString();
                const address = rows[i][17]?.toString();
                const postalCode = rows[i][18]?.toString();
                const telephone = rows[i][19]?.toString();
                const email = rows[i][20]?.toString();
                const bankAccount = rows[i][21]?.toString();
                const bankName = rows[i][22]?.toString();
                const placeOfBirth = await new BirthPlace().findPlace(nationalCode);
                const password = await new Encryption().encrypt(nationalCode);
                const year = birthDate?.toString().substr(0, 4);
                const month = birthDate?.toString().substr(4, 2);
                const day = birthDate?.toString().substr(6, 2);
                const gBirthDate = jmoment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY/MM/DD 00:00:00');

                //validations
                if (nationalCode?.length != 10) {
                    console.log('National code length is not valid');
                    continue;
                }

                const dup = await this.model.createQueryBuilder()
                    .where('national_number = :nn', { nn: nationalCode })
                    .getOne();


                if (dup != undefined) {//exists
                    console.log('Duplicated item found');
                    continue;
                }

                if (Number(year) > 1368) {
                    idNumber = nationalCode;
                }

                if (insuranceNumber?.length > 8) {
                    console.log('Insurance number length is not valid.');
                    continue;
                }
                if (insuranceNumber?.startsWith('00')) {
                    console.log('Insurance number starts with 00 which is not valid');
                    continue;
                }


                if (mobile) {
                    const mobDup = await this.model.createQueryBuilder()
                        .where('mobile1 = :mm or mobile2 = :mm', { mm: mobile })
                        .getOne();

                    if (mobDup != undefined) {
                        console.log('Mobile is existing.');
                        continue;
                    }
                }


                if (firstName == '' || firstName == null || firstName == undefined) {
                    console.log('First name could not be null');
                    continue;
                }

                if (lastName == '' || lastName == null || lastName == undefined) {
                    console.log('Last name could not be null.');
                    continue;
                }


                if (postalCode?.length != 10) {
                    console.log('Postal code is not valid');
                    continue;
                }

                let army = '';
                switch (armyServiceCode) {
                    case '0': army = 'unknown'; break;
                    case '1': army = 'army_done'; break;
                    case '2': army = 'medical'; break;
                    case '3': army = 'sponsorship'; break;
                    case '4': army = 'educational'; break;
                    case '5': army = 'none'; break;
                    case '6': army = 'purchased'; break;
                    case '7': army = 'in_progress'; break;
                    default: army = 'error'; break;
                }


                //insert
                const result = await this.model.createQueryBuilder()
                    .insert()
                    .values([
                        {
                            birth_date: birthDate,
                            national_number: nationalCode,
                            first_name: firstName,
                            last_name: lastName,
                            father_name: fatherName,
                            id_number: idNumber,
                            sex: gender,
                            nation: origin,
                            public_description: publicDescription,
                            private_description: privateDescription,
                            password: password,
                            marital_status: maritalStatus == '1' ? 'married' : 'single',
                            army_service: army,
                            job_title: jobCode,
                            insurance_number: insuranceNumber,
                            personnel_id: personnelNumber,
                            job_status: statusCode,
                            mobile1: mobile,
                            phone: telephone,
                            email: email,
                            bank_account1: bankAccount,
                            bank_name1: bankName,
                            address: address,
                            postal_code: postalCode,
                            company_id_fk: companyId !== null ? companyId : null,
                            birth_place: placeOfBirth?.toString(),
                            id_issue_place: placeOfBirth?.toString(),
                            contract_id_fk: contractId !== null ? contractId : null,
                            isargar: 'none'
                        }
                    ])
                    .execute();

                successCounter++;
            }

            return {
                success: successCounter,
                total: rows.length
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
        finally {
            fs.unlink(file, (err) => {
                if (!err) {
                    this.logger.error('excel file deleted');
                }
            })
        }
    }

    async importSubordinateFromExcel(file: string): Promise<any> {
        try {
            const rows = await excelReader.default(file, { sheet: 1 });

            let successCounter = 0;


            for (let i = 1; i < rows.length; i++) {

                const natioanlCode = rows[i][0];
                const firstName = rows[i][1];
                const lastName = rows[i][2];
                const fatherName = rows[i][3];
                const shenasname = rows[i][4];
                const birthDateFarsi = rows[i][5];
                const parentNationalCode = rows[i][8];
                const sponsershipStatus = rows[i][11] != undefined ? rows[i][11]?.toString : 'non_dependent';
                const issuePlace = await new BirthPlace().findPlace(natioanlCode.toString())

                let relation = '';
                let married = false;
                let updateFatherName = false;
                const year = birthDateFarsi.toString().substr(0, 4);
                const month = birthDateFarsi.toString().substr(4, 2);
                const day = birthDateFarsi.toString().substr(6, 2);
                const jBirthDate = jmoment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD').format('YYYY/MM/DD 00:00:00');



                switch (rows[i][10]) {
                    case '2':
                        relation = 'wife';
                        married = true;
                        break;
                    case '3':
                        relation = 'brother';
                        break;
                    case '4':
                        relation = 'sister';
                        break;
                    case '5':
                        relation = 'father';
                        updateFatherName = true;
                        break;
                    case '6':
                        relation = 'mother';
                        break;
                    case '7':
                        relation = 'son';
                        married = true;
                        break;
                    case '8':
                        relation = 'daughter';
                        married = true;
                        break;
                    default:
                        relation = 'unknown';
                        break;
                }



                //check if parent is available
                const parent = await this.model.createQueryBuilder()
                    .where('national_number = :nn', { nn: parentNationalCode })
                    .getOne();

                if (parent == undefined) {
                    continue;
                }


                if (updateFatherName) {
                    await this.model.createQueryBuilder()
                        .update()
                        .set({
                            father_name: firstName.toString()
                        })
                        .where('id = :id', { id: parent.id })
                        .execute();
                }

                if (married) {
                    await this.model.createQueryBuilder()
                        .update()
                        .set({
                            marital_status: 'married'
                        })
                        .where('id = :id', { id: parent.id })
                        .execute();
                }


                //check subordinate
                const subDup = await this.subordinateModel.createQueryBuilder()
                    .where('national_code = :nc', { nc: natioanlCode })
                    .getOne();

                if (subDup != undefined) {
                    continue;
                }

                //insert subordinate
                await this.subordinateModel.createQueryBuilder()
                    .insert()
                    .values([{
                        personnel_id_fk: parent.id,
                        first_name: firstName.toString(),
                        last_name: lastName.toString(),
                        relation: relation,
                        national_code: natioanlCode.toString(),
                        sponsorship_status: sponsershipStatus,
                        father_name: fatherName.toString(),
                        id_number: shenasname.toString(),
                        birth_date: jBirthDate,
                        issue_place: issuePlace.toString()
                    }])
                    .execute();

                successCounter++;
            }

            return {
                success: successCounter
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            fs.unlink(file, (err) => {
                if (!err) {
                    this.logger.error('dbf file deleted');
                }
            })
        }
    }


    async globalSearch(firstName: string, lastName: string, nationalCode: string, insuranceNumber: string, fatherName: string, mobile: string): Promise<Personnel[]> {
        try {
            return await this.model.createQueryBuilder()
                .where('first_name = IFNULL(:firstName, first_name) and last_name = IFNULL(:lastName, last_name) and father_name = IFNULL(:fatherName, father_name) and national_number = IFNULL(:nationalNumber, national_number) and insurance_number = IFNULL(:insuranceNumber, insurance_number) and mobile1 = IFNULL(:mobile, mobile1)', {
                    firstName: firstName,
                    lastName: lastName,
                    fatherName: fatherName,
                    nationalNumber: nationalCode,
                    insuranceNumber: insuranceNumber,
                    mobile: mobile
                })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }

    async deletePersonnels(ids: number[]): Promise<any> {
        try {
            const output = []

            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];

                let dup = await this.damageServiceRepo.createQueryBuilder('damage_service')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'خدمات خسارت'
                    });
                    continue;
                }


                dup = await this.timeOffRepo.createQueryBuilder('personnel_timeoff')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'مرخصی'
                    });
                    continue;
                }


                dup = await this.incidentRepo.createQueryBuilder('incident')
                    .where('personnel_id_fk = :pid', {
                        pid: id
                    }).getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'حوادث'
                    })
                    continue;
                }


                dup = await this.imprestRepo.createQueryBuilder('imprest')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'مساعده'
                    })
                    continue;
                }


                dup = await this.missionRepo.createQueryBuilder('personnel_mission')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'ماموریت'
                    })
                    continue;
                }



                dup = await this.insuranceTakmiliRepo.createQueryBuilder('insurance_takmili_personnel')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'بیمه تکمیلی'
                    });
                    continue;
                }


                dup = await this.insuranceHistoryRepo.createQueryBuilder('insurance_history_claim')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'ادعای سابقه'
                    });
                    continue;
                }

                dup = await this.insuranceRepo.createQueryBuilder('insurance')
                    .where('personnel_id_fk = :pid and type= :type', {
                        pid: id,
                        type: 'عمر و حادثه'
                    })
                    .getCount();
                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'بیمه عمر و حوادث'
                    });
                    continue;
                }

                dup = await this.settleRepo.createQueryBuilder('settle')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'تقاضای تسویه حساب'
                    });
                    continue;
                }

                dup = await this.insuranceTaminRepo.createQueryBuilder('insurance_tamin_personnel')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'بیمه تامین اجتماعی'
                    });
                    continue;
                }

                dup = await this.doctorVisitRepo.createQueryBuilder('doctor_visit')
                    .where('personnel_id_fk = :pid', { pid: id })
                    .getCount();

                if (dup > 0) {
                    output.push({
                        id: id,
                        dependency: 'معاینات پزشکی'
                    });
                    continue;
                }


                //delete personnel
                await this.model.createQueryBuilder()
                    .delete()
                    .where('id = :id', { id: id })
                    .execute();
            }



            return output;
        }
        catch (err) {
            throw err;
        }
    }


    async deleteSubordinates(ids: number[]) {
        try {
            ids.forEach(async item => {
                await this.subordinateModel.createQueryBuilder()
                    .delete()
                    .where('id = :id', { id: item })
                    .execute();
            });
        }
        catch (err) {
            throw err;
        }
    }

    async insertPersonnelAccess(dto: CreatePersonnelAccessDTO): Promise<any> {
        try {
            return await this.accessModel.createQueryBuilder()
                .insert()
                .values([{ ...dto }])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }


    async deletePersonnelAccess(id: number, access: string[]) {
        try {
            await this.accessModel.createQueryBuilder()
                .delete()
                .where('personnel_id_fk = :pid', { pid: id })
                .andWhere('access IN (:...a)', { a: access })
                .execute();


        }
        catch (err) {
            throw err;
        }
    }

    async createPersonnelShift(dto: CreatePersonnelShiftDTO) {
        try {
            const duplicate = await this.personnelShiftRepo.createQueryBuilder()
                .where('personnel_id_fk = :pid and jobs_shift_id_fk = :sid', {
                    pid: dto.personnel_id_fk,
                    sid: dto.jobs_shift_id_fk
                })
                .getOne();

            if (duplicate) {
                throw new HttpException('job shift already exists', 400);
            }
            else {
                return await this.personnelShiftRepo.createQueryBuilder()
                    .insert()
                    .values([
                        dto
                    ])
                    .execute();
            }
        }
        catch (err) {
            throw err;
        }
    }

    async createPersonnelJob(dto: CreatePersonnelJobDTO) {
        try {
            const duplicate = await this.personnelJobRepo.createQueryBuilder()
                .where('personnel_id_fk = :pid && chart_id_fk = :prid and jobs_id_fk=:jid', {
                    pid: dto.personnel_id_fk,
                    prid: dto.chart_id_fk,
                    jid: dto.jobs_id_fk
                })
                .getOne();

            if (duplicate) {
                throw new HttpException(`${dto.personnel_id_fk} already has ${dto.jobs_id_fk} on project #${dto.chart_id_fk}`, 400);
            }

            const _dto: any = dto;
            _dto.approved = dto.approved == true ? 1 : 0;
            return await this.personnelJobRepo.createQueryBuilder()
                .insert()
                .values([_dto])
                .execute();
        }
        catch (err) {
            throw err;
        }
    }

    async updatePersonnelJob(id: number, dto: UpdatePersonnelJobDTO) {
        const _dto: any = dto;
        _dto.approved = dto.approved == true ? 1 : 0;
        return await this.personnelJobRepo.createQueryBuilder()
            .update()
            .set({ ..._dto })
            .where('id = :id', { id: id })
            .execute();
    }

    async findAllPersonnelJobList(page: number, size: number) {
        const list = await this.personnelJobRepo.createQueryBuilder( 't1')
            .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
            .innerJoinAndSelect('jobs_chart', 't3', 't1.chart_id_fk = t3.id')
            .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
            .leftJoinAndSelect('company', 't4', 't3.company_id_fk = t4.id')
            .select([
                't1.from_date as from_date',
                't1.to_date as to_date',
                't1.id as id',
                't4.name as company_name',
                't4.id as company_id',
                't3.title as chart_title',
                't3.id as chart_id',
                't2.title as job_title',
                't2.id as job_id',
                't1.approved as approved',
                't5.first_name as first_name',
                't5.last_name as last_name',
                't5.national_number as national_number',
                't5.id as personnel_id',
                't3.title as chart_title'
            ])
            .limit(size)
            .offset(page - 1)
            .getRawMany();


        const count = await this.personnelJobRepo.createQueryBuilder( 't1')
            .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
            .innerJoinAndSelect('jobs_chart', 't3', 't1.chart_id_fk = t3.id')
            .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
            .leftJoinAndSelect('company', 't4', 't3.company_id_fk = t4.id')
            .select([
                't1.id as id'
            ])
            .getCount();

        return {
            list: list,
            total: count
        }
    }

    async findOnePersonJobs(id: number, page: number, size: number) {
        try {
            const list = await this.personnelJobRepo.createQueryBuilder( 't1')
                .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
                .innerJoinAndSelect('jobs_chart', 't3', 't1.chart_id_fk = t3.id')
                .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
                .leftJoinAndSelect('company', 't4', 't3.company_id_fk = t4.id')
                .where('t1.personnel_id_fk = :pid', { pid: id })
                .select([
                    't1.from_date as from_date',
                    't1.to_date as to_date',
                    't1.id as id',
                    't4.name as company_name',
                    't4.id as company_id',
                    't3.title as chart_title',
                    't3.id as chart_id',
                    't2.title as job_title',
                    't2.id as job_id',
                    't1.approved as approved',
                    't5.first_name as first_name',
                    't5.last_name as last_name',
                    't5.national_number as national_number',
                    't5.id as personnel_id'
                ])
                .limit(size)
                .offset(page - 1)
                .getRawMany();


            const count = await this.personnelJobRepo.createQueryBuilder( 't1')
                .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
                .innerJoinAndSelect('jobs_chart', 't3', 't1.chart_id_fk = t3.id')
                .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
                .leftJoinAndSelect('company', 't4', 't3.company_id_fk = t4.id')
                .where('t1.personnel_id_fk = :pid', { pid: id })
                .select([
                    't1.id as id'
                ])
                .getCount();

            return {
                list: list,
                total: count
            }
        }
        catch (err) {
            throw err;
        }
    }

    async personnelJobDetail(id: number) {
        return await this.personnelJobRepo.createQueryBuilder( 't1')
            .innerJoinAndSelect('jobs', 't2', 't1.jobs_id_fk = t2.id')
            .innerJoinAndSelect('jobs_chart', 't3', 't1.chart_id_fk = t3.id')
            .innerJoinAndSelect('personnel', 't5', 't1.personnel_id_fk = t5.id')
            .leftJoinAndSelect('company', 't4', 't3.company_id_fk = t4.id')
            .select([
                't1.from_date as from_date',
                't1.to_date as to_date',
                't1.id as id',
                't4.name as company_name',
                't4.id as company_id',
                't3.title as chart_title',
                't3.id as chart_id',
                't2.title as job_title',
                't2.id as job_id',
                't1.approved as approved',
                't5.first_name as first_name',
                't5.last_name as last_name',
                't5.national_number as national_number',
                't5.id as personnel_id'
            ])
            .where('t1.id = :id', { id: id })
            .getRawOne();
    }

    async deletePresonnelJob(id: number) {
        try {
            await this.personnelJobRepo.createQueryBuilder()
                .delete()
                .where('id = :id', { id: id })
                .execute();
        }
        catch (err) {
            throw err;
        }
    }

    async findPersonnelOfJob(jobId: number) {
        try {
            return await this.personnelJobRepo.createQueryBuilder()
                .where('jobs_id_fk = :jid', { jid: jobId })
                .getMany();
        }
        catch (err) {
            throw err;
        }
    }

    async findPersonnelofJobs(jobs: number[]) {
        return this.personnelJobRepo.createQueryBuilder()
            .where('jobs_id_fk in (:...jobs) and approved = :approved', { jobs: jobs, approved: 1 })
            .getMany();
    }

    async findPersonnelJob(id: number) {
        return await this.personnelJobRepo.findOne({ where: { personnel_id_fk: id } });
    }

    async getSuperAdmins() {
        return this.model.find({
            where: {
                is_super_user: 1
            }
        });
    }

    async updatePersonnel(id: number, dto: UpdatePersonDTO) {
        const personnel = await this.model.findOne({
            where: {
                id: id
            }
        });
        const _dto: any = dto;


        if (dto.shahid_was_colleague) {
            _dto.shahid_was_colleague = dto.shahid_was_colleague == true ? 1 : 0;
        }

        if (_dto.password) {
            _dto.password = await new Encryption().encrypt(dto.password);
        }


        if (personnel) {
            return await this.model.createQueryBuilder()
                .update()
                .set(_dto)
                .where('id = :id', { id: id })
                .execute();
        }
        else {
            throw new NotFoundException('personnel could not be found');
        }
    }

    async updateDocuments(dto: any, id: number) {
        const personnel = await this.model.findOne({
            where: {
                id: id
            }
        });

        for (let key in dto) {
            dto[key] = new FileClass('personnel', dto[key]).generateFileName();
        }

        if (personnel) {
            return await this.model
                .update({
                    id: id
                }, { ...dto });
        }
        else {
            throw new NotFoundException('personnel could not be found');
        }

    }

    async addSubordinateToPersonnel(args: {
        personnelId: number;
        dto: CreateSubordinateDTO
    }) {
        const {
            personnelId,
            dto
        } = args;

        const personnel = await this.model.findOne({
            where: {
                id: personnelId
            }
        });

        if (!personnel) {
            throw new HttpException(
                `Personnel with ID: ${personnelId} could not be found`,
                404
            );
        }

        const subOrdinate = await this.model.findOne({
            where: {
                national_number: dto.national_code
            }
        });

        if (subOrdinate) {
            throw new HttpException(
                `Subordinate already exists for personnel ID: ${personnelId}`,
                400
            );
        }

        const newPersonnel = await this.model.createQueryBuilder()
            .insert()
            .values([
                {
                    national_number: dto.national_code,
                    first_name: dto.first_name,
                    last_name: dto.last_name,
                    id_number: dto.id_number,
                    father_name: dto.father_name,
                    birth_date: dto.birth_date,
                    birth_place: dto.issue_place
                }
            ])
            .execute();



        return newPersonnel;
    }

    async validateNationalCode(code: string): Promise<any> {
        const personnel = await this.model.findOne({
            where: {
                national_number: code
            }
        });

        if (personnel) {
            return {
                id: personnel.id
            }
        }
        else {
            throw new HttpException('national code could not be found', 404);
        }
    }


    async synchronizationData(): Promise<IPersonnelSynchronization[]> {
        return null;
    }

    async checkPersonnelAvailability(request: PersonnelAvailabilityRequest): Promise<PersonnelAvailabilityResponse[]> {
        const query: SelectQueryBuilder<Personnel> =
          this.model.createQueryBuilder()
            .where('national_number IN (:...codes)', {
                codes: request.codes
            })
            .select([
              'id as id',
              'national_number as nationalCode'
            ]);

        return await query.getRawMany();
    }

    private data = [
        {
            code: '2992320250',
            id: 1,
            fatherId: -1,
            motherId: -1,
        },
        {
            code: '2300754029',
            id: 2,
            fatherId: 1,
            motherId: 4,
        },
        {
            code: '2992280704',
            id: 3,
            fatherId: 1,
            motherId: 4,
        },
        {
            code: '2992280705',
            id: 4,
            fatherId: -1,
            motherId: -1,
        }
    ];




    private async findMother(code: string): Promise<any> {
        const person = this.data.find(item => item.code === code);
        return this.data.find(item => item.id === person.motherId);
    }

    private async findBrother(code: string): Promise<any[]> {
        const person = this.data.find(item => item.code === code);
        return this.data.filter(item => item.id !== person.id && (item.fatherId === person.fatherId || item.motherId === person.motherId));
    }
}
