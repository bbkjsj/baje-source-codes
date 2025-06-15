import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobTitle } from "./schemas/job-title.schema";
import { JobTitleService } from "./job-title.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            JobTitle
        ])
    ],
    controllers:[],
    providers: [JobTitleService],
    exports: [JobTitleService]
})
export class JobTitleModule{}