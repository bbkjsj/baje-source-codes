import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanySchema } from '../company/schemas/company.entity';
import { Contract } from '../contract/schemas/contract.schema';
import { Permission } from '../permission/schemas/permission.schema';
import { PersonnelModule } from '../personnel/personnel.module';
import { PersonnelAccess } from '../personnel/schemas/personnel-access.schema';
import { Personnel } from '../personnel/schemas/personnel.schema';
import { SurveyExecutionSchema } from '../survey/schemas/survey-execution.schema';
import { SurveySettingSchema } from '../survey/schemas/survey-setting.schema';
import { SurveyWorkgroupPersonnelSchema } from '../survey/schemas/survey-workgroup-personnel.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [
    PersonnelModule,
    TypeOrmModule.forFeature([
      Permission,
      Personnel,
      CompanySchema,
      PersonnelAccess,
      Contract,
      SurveyWorkgroupPersonnelSchema,
      SurveySettingSchema,
      SurveyExecutionSchema
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}