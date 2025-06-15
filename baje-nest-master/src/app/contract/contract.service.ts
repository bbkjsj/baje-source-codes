import { HttpException, Injectable, NotFoundException, Req } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { createQueryBuilder, FindOneOptions, Repository } from "typeorm";
import { ContractProgressService } from "../contractProgress/contractProgress.service";
import { Contract } from "./schemas/contract.schema";
import { CreateContractDTO } from "./dtos/create.dto";
import * as moment from "moment";
import { ContractProductionReportService } from "../contractProductionReport/contractProductionReport.service";
import { ContractPeymanReportService } from "../contractPeymanReport/contractPeymanReport.service";
import { PersonnelService } from "../personnel/personnel.service";
import { Role } from "src/common/enums/roles.enum";
import { UpdateContractDTO } from "./dtos/update.dto";
import { CreateContractProgressDTO } from "../contractProgress/dtos/create-contractProgress.dto";
import { ContractUpdateStatusDTO } from './dtos/update-status.dto';
import { IResponseWithBuffer } from 'src/common/interfaces/response.interface';
import { ExcelService, IExcelHeader } from 'src/common/modules/excel/excel.service';
import { IToken } from "../../common/helpers/jwt";
import { Access } from "../../common/helpers/access";


export interface IPeymanContract {
    readonly contract: Contract;
}
@Injectable()
export class ContractService {
    constructor(@InjectRepository(Contract) private readonly model: Repository<Contract>,
        private readonly contractProgressService: ContractProgressService,
        private readonly contractProductionReportService: ContractProductionReportService,
        private readonly contractPeymanReportService: ContractPeymanReportService,
        private readonly personnelService: PersonnelService,
        private readonly excelService: ExcelService,
    ) { }


    async create(dto: CreateContractDTO): Promise<any> {
        if (dto.contractorId == dto.employerId) {
            throw new HttpException('پیمانکار و کارفرما نمیتوانند یکی باشند', 400);
        }

        if (dto.workshopCode && dto.contractorId) {
            const duplicates = await this.model.createQueryBuilder()
                .where('workshop_code = :wc and contractor_id != :cid', {
                    wc: dto.workshopCode,
                    cid: dto.contractorId
                })
                .getCount();

            if (duplicates > 0) {
                throw new HttpException('کد کارگاهی وارد شده قبلا برای شرکت دیگری ثبت شده است', 400);
            }
        }


        if (dto.row && dto.contractorId && dto.workshopCode) {
            const duplicate = await this.model.createQueryBuilder()
                .where('contractor_id = :cid and workshop_code = :wc and row= :r', {
                    cid: dto.contractorId,
                    wc: dto.workshopCode,
                    r: dto.row
                })
                .getCount();
            if (duplicate > 0) {
                throw new HttpException('شماره پیمان وارد شده قبلا برای این شرکت ثبت شده است', 400);
            }
        }


        if (dto.contractNumber && dto.contractorId) {
            const duplicate = await this.model.createQueryBuilder()
                .where('contractor_id = :cid && number = :n', {
                    cid: dto.contractorId,
                    n: dto.contractNumber
                })
                .getCount();

            if (duplicate > 0) {
                throw new HttpException('شماره قرارداد وارد شده قبلا در سامانه ثبت شده است', 400);
            }
        }


        const _dto: any = {
            ...dto
        }
        _dto.number = dto.contractNumber;
        if(dto.priceListParts) {
            _dto.priceListParts = dto.priceListParts?.toString();
        }



        const contract = await this.model.createQueryBuilder()
            .insert()
            .values([_dto])
            .execute();


        const fromDate = moment(dto.startDate);
        const toDate = moment(dto.endDate);
        const diff = toDate.diff(fromDate, 'days');

        for (let i = 0; i < diff; i++) {
            const date = moment(dto.startDate).utc(true).add(i, 'day').format('YYYY/MM/DD');

            await this.contractProgressService.create({
                contract_id_fk: Number(contract.identifiers[0].id),
                real_progress: 0,
                program_progress: 0,
                date: new Date(date)
            });


            if (dto.activity == 'mineral') {
                await this.contractProductionReportService.create({
                    stone_tonnage: 0,
                    dust_tonnage: 0,
                    stone_load_quantity: 0,
                    dust_load_quantity: 0,
                    contract_id_fk: Number(contract.identifiers[0].id),
                    date: new Date(date),
                    edit_by_admin: false,
                    description: null,
                    status: null
                });
            }

            if (dto.type == 'main_civil' || dto.type == 'main_non_civil') {
                await this.contractPeymanReportService.create({
                    contract_id_fk: Number(contract.identifiers[0].id),
                    date: new Date(date),
                    disabled_car_no_tier_quantity: 0,
                    disabled_car_no_part_quantity: 0,
                    active_car_quantity: 0,
                    ready_to_work_factor: 0,
                    ready_to_work_car_quantity: 0,
                    status: null,
                    edit_by_admin: null,
                    description: null
                });
            }
        }


        //add permission to manager
        if (dto.managerId) {
            await this.personnelService.insertPersonnelAccess({
                companyId: dto.companyId,
                personnelId: dto.managerId,
                access: Role.contract_progress_add_edit,
                contractId: Number(contract.identifiers[0].id)
            })

            await this.personnelService.insertPersonnelAccess({
                companyId: dto.companyId,
                personnelId: dto.managerId,
                access: Role.contract_progress_approve,
                contractId: Number(contract.identifiers[0].id)
            });

            if (dto.activity == 'mineral') {
                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.managerId,
                    access: Role.contract_production_report_add_edit,
                    contractId: Number(contract.identifiers[0].id)
                });

                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.managerId,
                    access: Role.contract_production_report_approve,
                    contractId: Number(contract.identifiers[0].id)
                })
            }

            if (dto.type == 'main_civil' || dto.type == 'main_non_civil') {
                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.managerId,
                    access: Role.contract_peyman_report_add_edit,
                    contractId: Number(contract.identifiers[0].id)
                })

                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.managerId,
                    access: Role.contract_peyman_report_approve,
                    contractId: Number(contract.identifiers[0].id)
                })

                await this.personnelService.insertPersonnelAccess({
                    companyId: dto.companyId,
                    personnelId: dto.managerId,
                    access: Role.contract_dashboard_report,
                    contractId: Number(contract.identifiers[0].id)
                })

            }
        }


        return {
            contractId: Number(contract.identifiers[0].id)
        };

    }


    async update(id: number, dto: UpdateContractDTO): Promise<any> {
        delete dto.companyId;

        if (dto.contractorId == dto.employerId) {
            throw new HttpException("پیمانکار و کارفرما نمیتوانند یکی باشند", 400);
        }

        if (id == dto.mainContractId) {
            throw new HttpException("قرار داد با قرارداد اصلی مشابه هست", 400);
        }


        //check main contracts
        const mainContracts = await this.model.createQueryBuilder()
            .where('main_contract_id_fk = :mcid', { mcid: id })
            .getCount();

        if (mainContracts > 0) {
            if (dto.contractorId != dto.oldContractorId) {
                throw new HttpException("امکان تغییر پیمانکار در این قرارداد وجود ندارد", 400);
            }
        }

        delete dto.oldContractorId;
        const _dto: any = {
            ...dto
        };

        if(dto.priceListParts) {
            _dto.priceListParts = dto.priceListParts.toString();
        }

        const oldContract = await this.model.createQueryBuilder()
            .where('id = :id', { id: id })
            .getRawOne();

        await this.model.createQueryBuilder()
            .update()
            .set(_dto)
            .where('id = :id', { id: id })
            .execute();


        //remove old progress
        await this.contractProgressService.deleteAllByContractId(id);


        //remove old production report
        await this.contractProductionReportService.deleteByContractId(id);

        //remove old peyman report
        await this.contractPeymanReportService.deleteAllByContractId(id);

        //calculate progress among days
        const fromDate = moment(dto.startDate);
        const toDate = moment(dto.endDate);

        const diff = toDate.diff(fromDate, 'days');

        for (let i = 0; i < diff + 1; i++) {
            const d = moment(dto.startDate).utc(true).add(i, 'day').format('YYYY/MM/DD');

            await this.contractProgressService.create(
                {
                    contract_id_fk: id,
                    date: new Date(d),
                    real_progress: 0,
                    program_progress: 0
                }
            );

            if (dto.activity === 'mineral') {
                await this.contractProductionReportService.create({
                    contract_id_fk: id,
                    stone_tonnage: 0,
                    stone_load_quantity: 0,
                    dust_load_quantity: 0,
                    dust_tonnage: 0,
                    date: new Date(d),
                    edit_by_admin: false,
                    status: null,
                    description: null
                });
            }

            if (dto.type === 'main_non_civil' || dto.type === 'main_civil') {
                await this.contractPeymanReportService.create({
                    contract_id_fk: id,
                    date: new Date(d),
                    disabled_car_no_part_quantity: 0,
                    disabled_car_no_tier_quantity: 0,
                    active_car_quantity: 0,
                    ready_to_work_car_quantity: 0,
                    ready_to_work_factor: 0,
                    edit_by_admin: null,
                    description: null,
                    status: null
                });
            }
        }

        //delete previous manager permission
        await this.personnelService.deletePersonnelAccess(oldContract.manager_id, [
            'contract/progress-add-edit',
            'contract/progress-approve',
            'contract/production-report-add-edit',
            'contract/production-report-approve',
            'contract/peyman-report-add-edit',
            'contract/peyman-report-approve',
            'contract/dashboard-report'
        ]);


        //add permission
        if (dto.managerId) {
            await this.personnelService.insertPersonnelAccess({
                access: 'contract/progress-approve',
                personnelId: dto.managerId,
                contractId: id,
                companyId: dto.contractorId
            });

            await this.personnelService.insertPersonnelAccess({
                access: 'contract/production-report-add-edit',
                personnelId: dto.managerId,
                contractId: id,
                companyId: dto.contractorId
            });

            await this.personnelService.insertPersonnelAccess({
                access: 'contract/production-report-approve',
                personnelId: dto.managerId,
                contractId: id,
                companyId: dto.contractorId
            });

            await this.personnelService.insertPersonnelAccess({
                access: 'contract/peyman-report-add-edit',
                personnelId: dto.managerId,
                contractId: id,
                companyId: dto.contractorId
            });

            await this.personnelService.insertPersonnelAccess({
                access: 'contract/peyman-report-approve',
                personnelId: dto.managerId,
                contractId: id,
                companyId: dto.contractorId
            });

            await this.personnelService.insertPersonnelAccess({
                access: 'contract/dashboard-report',
                personnelId: dto.managerId,
                contractId: id,
                companyId: dto.contractorId
            });

        }


    }


    async getList(type: string, params: any, user: IToken): Promise<IResponseWithBuffer> {

        const query = this.model.createQueryBuilder('contract');
        const accessClass: Access = new Access(user.access);

        if(params.companyId) {
            query.where('contractor_id = :cid', {
                cid: +params.companyId
            })
        }

        if(user.isSuper) {
            if(type === 'main') {
                query.andWhere('(type = :type or type = :type1)', {
                    type: 'main_civil',
                    type1: 'main_non_civil',
                });
            }
            else if(type === 'sub') {
                query.andWhere('(type = :type or type = :type1)', {
                    type: 'sub_civil',
                    type1: 'sub_non_civil'
                });
            }
        }
        else if(accessClass.isInBajeAccessLevel('contract/list')) {
            if(type === 'main') {
                query.andWhere('type = :type or type = :type1 or contractor_id = :cid', {
                    type: 'main_civil',
                    type1: 'main_non_civil',
                    cid: user.id
                });
            }
            else if(type === 'sub') {
                query.andWhere('(type = :type or type = :type1)', {
                    type: 'sub_civil',
                    type1: 'sub_non_civil'
                });
            }
        }
        else if(accessClass.hasAccess('contract/list')) {
            if(type === 'main') {
                query.andWhere('(type = :type or type = :type1) and contractor_id = :cid', {
                    type: 'main_civil',
                    type1: 'main_non_civil',
                    cid: user.id
                });
            }
            else if(type === 'sub') {
                query.andWhere('(type = :type or type = :type1) and contractor_id = :cid', {
                    type: 'sub_civil',
                    type1: 'sub_non_civil',
                    cid: user.id
                });
            }
        }


        const list = await query.getMany();


        const excelHeaders: IExcelHeader[] = [
            {
              "key":"subject",
              "value":"نام پروژه"
            },
            {
              "key":"employer",
              "value":"کارفرما"
            },
            {
              "key":"consultantCompanyId",
              "value":"مشاور"
            },
            {
              "key":"startDate",
              "value":"تاریخ شروع قرارداد"
            },
            {
              "key":"endDate",
              "value":"تاریخ پایان قرارداد"
            },
            {
              "key":"defectsFixedOn",
              "value":"رفع نواقص"
            },
            {
              "key":"temporaryDeliveredOn",
              "value":"تحویل موقت"
            },
            {
              "key":"definitiveStatementOn",
              "value":"صورت وضعیت قطعی"
            },
            {
              "key":"definitiveAdjustmentOn",
              "value":"تعدیل قطعی"
            },
            {
              "key":"definitiveDeliveryOn",
              "value":"تحویل قطعی"
            },
            {
              "key":"accountSettledOn",
              "value":"آزادسازی ضمانتنامه ها"
            },
            {
              "key":"warrantyReleasedOn",
              "value":"تسویه حساب"
            },
            {
              "key":"checkoutOn",
              "value":"نام پروژه"
            },
            {
              "key":"obstacle",
              "value":"موانع و مشکلات"
            }
          ];


        const excelBuffer: Buffer = await this.excelService.create({
            header: excelHeaders,
            stringJson: JSON.stringify(list)
        });

        return {
            list: list,
            buffer: excelBuffer
        };
    }

    async getOneItem(id: number): Promise<any> {
        return await this.model.findOne({
            where: {
                id: id
            }
        });
    }

    async updateStatus(id: number, dto: ContractUpdateStatusDTO): Promise<any> {
        const _dto: any = {
            ...dto
        };

        return await this.model.createQueryBuilder()
        .update()
        .where('id = :id', {
            id: id
        })
        .set({ ..._dto })
        .execute();
    }

    async deleteContracts(ids: number[]) {
        return await this.model.createQueryBuilder()
        .delete()
        .where('id IN (:...ids)', {
            ids: ids
        })
        .execute();
    }


    async peymanReportOfContract(id: number) {
        const contract: Contract = await
            this.model.findOne({
                where: {
                    id: id
                }
            });

        if(contract) {

        }

        throw new NotFoundException(null, `Contract ${id} could not be found`);
    }
}