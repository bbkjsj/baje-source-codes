import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonnelModule } from './app/personnel/personnel.module';
import { ConfigModule } from '@nestjs/config';
import { SignModule } from './app/sign/sign.module';
import * as ormconfig from "ormconfig";
import { DamageServiceModule } from './app/damageService/damageService.module';
import { MissionModule } from './app/mission/mission.module';
import { TimeOffModule } from './app/timeOff/timeoff.module';
import { ContractProgressModule } from './app/contractProgress/contractProgress.module';
import { ContractModule } from './app/contract/contract.module';
import { HseModule } from './app/hse/hse.module';
import { JobsModule } from './app/jobs/jobs.module';
import { VehicleModule } from './app/vehicle/vehicle.module';
import { CompanyModule } from './app/company/company.module';
import { TableNameModule } from './app/table-name/table-name.module';
import { TasksModule } from './app/tasks/tasks.module';
import { CronModule } from './common/providers/cron/cron.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PermissionModule } from './app/permission/permission.module';
import { EnvironmentModule } from './app/environment/environment.module';
import { FilesModule } from './app/files/files.module';
import { ThirdPartyInsurance } from './app/insurance/third-party/schemas/third-party-insurance.schema';
import { ThirdPartyInsuranceModule } from './app/insurance/third-party/third-party.module';
import { FamilyModule } from './app/family/family.module';
import { InsuranceModule } from './app/insurance/insurance.module';
import { AccessModule } from './app/access/access.module';
import { AuthModule } from './app/auth/auth.module';
import { JahadCacheModule } from './app/global';
import { ApiModile } from './app/api/api.module';
import { AuthorizationModule } from './shared/authorization/authorization.module';
import { DataSynchronizationModule } from "./app/data-synchronization/data-synchronization.module";
import { ImageModule } from "./app/images/image.module";


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    SignModule,
    PersonnelModule,
    DamageServiceModule,
    MissionModule,
    TimeOffModule,
    ContractProgressModule,
    ContractModule,
    JobsModule,
    CompanyModule,
    TableNameModule,
    HseModule,
    TasksModule,
    CronModule,
    PermissionModule,
    EventEmitterModule.forRoot(),
    EnvironmentModule,
    VehicleModule,
    FilesModule,
    ThirdPartyInsuranceModule,
    FamilyModule,
    InsuranceModule,
    AccessModule,
    AuthModule,
    JahadCacheModule,
    ApiModile,
    AuthorizationModule,
    DataSynchronizationModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
