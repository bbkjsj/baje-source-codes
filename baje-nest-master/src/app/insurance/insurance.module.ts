import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelModule } from 'src/common/modules/excel/excel.module';
import { PersonnelModule } from '../personnel/personnel.module';
import { InsuranceTakmiliPersonnelSchema } from './takmili/schemas/takmili.schema';
import { InsuranceTakmiliController } from './takmili/takmili.controller';
import { InsuranceTakmiliService } from './takmili/takmili.service';

@Module({
  imports: [
    PersonnelModule,
    ExcelModule,
    TypeOrmModule.forFeature([
      InsuranceTakmiliPersonnelSchema
    ])
  ],
  controllers: [
    InsuranceTakmiliController
  ],
  providers: [
    InsuranceTakmiliService
  ]
})
export class InsuranceModule { }