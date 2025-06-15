import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelModule } from 'src/common/modules/excel/excel.module';
import { PersonnelModule } from '../personnel/personnel.module';
import { AccessPersonnelSchema } from './access-personnel.schema';
import { AccessPrerequisiteSchema } from './access-prerequisite.schema';
import { AccessController } from './access.controller';
import { AccessSchema } from './access.schema';
import { AccessService } from './access.service';

@Module({
  imports: [
    PersonnelModule,
    ExcelModule,
    TypeOrmModule.forFeature([
      AccessSchema,
      AccessPrerequisiteSchema,
      AccessPersonnelSchema
    ])
  ],
  providers: [
    AccessService
  ],
  exports: [
    AccessService
  ],
  controllers: [
    AccessController
  ]
})
export class AccessModule {}