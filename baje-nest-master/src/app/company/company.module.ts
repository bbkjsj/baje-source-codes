import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyBoardMember } from './schemas/company-borad-member.schema';
import { PersonnelModule } from '../personnel/personnel.module';
import { CompanySchema } from './schemas/company.entity';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as moment from "moment";
import { extname } from "path";

@Module({
  imports: [
    PersonnelModule,
    TypeOrmModule.forFeature([
      CompanySchema,
      CompanyBoardMember
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/company',
        filename: (req, file, callback) => {
          callback(null, `${moment().utc(true).format('YYMMDDHHMMSSSS')}${extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 31457280
      }
    })
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService]
})
export class CompanyModule {}
