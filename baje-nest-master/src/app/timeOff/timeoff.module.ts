import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { diskStorage } from "multer";
import { TimeOff } from "./schemas/timeoff.schema";
import * as moment from "moment";
import {extname} from "path";
import { TimeOffController } from "./timeoff.controller";
import { TimeOffService } from "./timeoff.service";
import { PersonnelModule } from "../personnel/personnel.module";
import { TestModule } from "../test-module/test.module";


@Module({
    imports: [
        PersonnelModule,
      TestModule.registerWithName('vehicle'),
        TypeOrmModule.forFeature([
            TimeOff
        ]),
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads/timeoff',
                filename: (req, file, cb)=> {
                    cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
                }
            }),
            limits: {
                fileSize: 31457280 //30Mb
            }
        })
    ],
    controllers: [TimeOffController],
    providers:[TimeOffService]
})
export class TimeOffModule{}
