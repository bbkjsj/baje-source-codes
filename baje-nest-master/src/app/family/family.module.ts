import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonnelModule } from '../personnel/personnel.module';
import { Personnel } from '../personnel/schemas/personnel.schema';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { FamilyTreeSchema } from './schemas/family-tree.schema';
import { FamilySchema } from './schemas/family.schema';

@Module({
  imports: [
    PersonnelModule,
    TypeOrmModule.forFeature([
      FamilySchema,
      FamilyTreeSchema,
      Personnel
    ])
  ],
  providers: [
    FamilyService
  ],
  controllers: [
    FamilyController
  ]
})
export class FamilyModule{}