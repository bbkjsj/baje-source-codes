import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractPeymanReportModule } from "../contractPeymanReport/contractPeymanReport.module";
import { ContractProductionReportModule } from "../contractProductionReport/contractProductionReport.module";
import { ContractProgressModule } from "../contractProgress/contractProgress.module";
import { PersonnelModule } from "../personnel/personnel.module";
import { ContractController } from "./contract.controller";
import { Contract } from "./schemas/contract.schema";
import { ContractService } from "./contract.service";
import { ExcelModule } from 'src/common/modules/excel/excel.module';

@Module({
    imports:[
        PersonnelModule,
        ContractProgressModule,
        ContractProductionReportModule,
        ContractPeymanReportModule,
        TypeOrmModule.forFeature([
            Contract
        ]),
        ExcelModule
    ],
    controllers:[ContractController],
    providers: [ContractService]
})
export class ContractModule{}