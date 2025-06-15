import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractProductionReport } from "./schemas/contractProductionReport.schema";
import { ContractProductionReportService } from "./contractProductionReport.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ContractProductionReport
        ])
    ],
    providers: [ContractProductionReportService],
    controllers:[],
    exports:[ContractProductionReportService]
})
export class ContractProductionReportModule{}