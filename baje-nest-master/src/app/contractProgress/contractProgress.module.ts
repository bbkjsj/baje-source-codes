import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractProductionReportModule } from "../contractProductionReport/contractProductionReport.module";
import { ContractProgress } from "./schemas/contractProgress.schema";
import { ContractProgressService } from "./contractProgress.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ContractProgress
        ])
        ,
        ContractProductionReportModule
    ],
    controllers: [],
    providers: [ContractProgressService],
    exports: [ ContractProgressService]
})
export class ContractProgressModule{}