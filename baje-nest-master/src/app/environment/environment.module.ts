import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonnelModule } from '../personnel/personnel.module';
import { EnvironmentController } from './environment.controller';
import { EnvironmentService } from './environment.service';
import { EnvironmentUsageSchema } from './schemas/environment-usage.schema';
import { EnvironmentSchema } from './schemas/environment.schema';

@Module({
  imports: [
    PersonnelModule,
    TypeOrmModule.forFeature([
      EnvironmentUsageSchema,
      EnvironmentSchema
    ])
  ],
  controllers: [
    EnvironmentController
  ],
  providers: [
    EnvironmentService
  ]
})
export class EnvironmentModule {}