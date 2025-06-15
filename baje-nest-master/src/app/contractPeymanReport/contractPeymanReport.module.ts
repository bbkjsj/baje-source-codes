import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractPeymanReport } from "./schemas/contractPeymanReport.schema";
import { ContractPeymanReportService } from "./contractPeymanReport.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            ContractPeymanReport
        ])
    ],
    controllers:[],
    providers:[ContractPeymanReportService],
    exports: [ContractPeymanReportService]
})
export class ContractPeymanReportModule{}