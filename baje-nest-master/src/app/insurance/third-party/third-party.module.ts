import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as moment from 'moment';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ThirdPartyInsurance } from './schemas/third-party-insurance.schema';
import { ThirdPartyInsuranceController } from './third-party.controller';
import { ThirdPartyInsuranceService } from './third-party.service';
import { PersonnelModule } from 'src/app/personnel/personnel.module';

@Module({
  imports: [
    PersonnelModule,
    TypeOrmModule.forFeature([
      ThirdPartyInsurance
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/tp-insurance',
        filename: (req, file, cb) => {
          cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 31457280 //30Mb
      }
    })
  ],
  controllers: [ThirdPartyInsuranceController],
  providers: [ThirdPartyInsuranceService],
  exports: []
})
export class ThirdPartyInsuranceModule { }