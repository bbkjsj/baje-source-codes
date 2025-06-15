import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { diskStorage } from "multer";
import { SignModule } from "../sign/sign.module";
import { PersonnelController } from "./personnel.controller";
import { PersonnelService } from "./personnel.service";
import { PersonnelAccess } from "./schemas/personnel-access.schema";
import { Personnel } from "./schemas/personnel.schema";
import * as moment from "moment";
import { extname } from "path";
import { Subordinate } from "./schemas/subordinate.schema";
import { JobTitleModule } from "../jobTitle/job-title.module";
import { PersonnelShift } from "./schemas/personnel-shift.schema";
import { PersonnelJobs } from "./schemas/personnel-jobs.schema";
import { Permission } from '../permission/schemas/permission.schema';
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
import { JobTitle } from "../jobTitle/schemas/job-title.schema";

@Module({
    imports: [
        JobTitleModule,
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads/personnel',
                filename: (req, file, cb)=> {
                    cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
                }
            }),
            limits: {
                fileSize: 31457280 //30Mb
            }
        }),
        TypeOrmModule.forFeature([
            Permission,
            Personnel,
            PersonnelAccess,
            Subordinate,
            PersonnelShift,
            PersonnelJobs,
          DamageService,
          TimeOff,
          PersonnelIncident,
          PersonnelImprest,
          PersonnelMission,
          InsuranceTakmiliPersonnelSchema,
          InsuranceHistoryClaim,
          Insurance,
          Settle,
          InsuranceTaminPersonnel,
          DoctorVisit,
          JobTitle
        ])
    ],
    controllers: [PersonnelController],
    providers: [PersonnelService],
    exports: [PersonnelService]
})
export class PersonnelModule{}