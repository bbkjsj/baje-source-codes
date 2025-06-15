import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleType } from './schemas/vehicle-type.schema';
import { PersonnelModule } from '../personnel/personnel.module';
import { Vehicle } from './schemas/vehicle.schema';
import { HseModule } from '../hse/hse.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import { extname } from 'path';
import { VehicleSystem } from './schemas/vehicle-system.schema';
import { VehicleStyle } from './schemas/vehicle-style.schema';
import { ExcelModule } from 'src/common/modules/excel/excel.module';
import { TestModule } from "../test-module/test.module";
import { ThirdPartyInsurance } from "../insurance/third-party/schemas/third-party-insurance.schema";
import { HSEAudit } from "../hse/schemas/hse-audit.schema";
import { HSEChecklist } from "../hse/schemas/checklist.schema";

@Module({
  imports:[
    PersonnelModule,
    ExcelModule,
    TypeOrmModule.forFeature([
      Vehicle,
      VehicleType,
      VehicleSystem,
      VehicleStyle,
      ThirdPartyInsurance,
      HSEAudit,
      HSEChecklist
    ]),
    MulterModule.register({
      storage: diskStorage({
          destination: './uploads/vehicle',
          filename: (req, file, cb)=> {
              cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
          }
      }),
      limits: {
          fileSize: 31457280 //30Mb
      }
  }),
    TestModule.registerWithName('vehicle'),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService]
})
export class VehicleModule {}
