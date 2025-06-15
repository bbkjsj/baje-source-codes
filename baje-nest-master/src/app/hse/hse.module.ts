import { Module } from '@nestjs/common';
import { HseService } from './hse.service';
import { HseController } from './hse.controller';
import { PersonnelModule } from '../personnel/personnel.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HSEQuestion } from './schemas/question.schema';
import { HSEChecklist } from './schemas/checklist.schema';
import { HSEChecklistQuestion } from './schemas/checklist-questions.schema';
import { HSEAllocateQuestion } from './schemas/allocate-question.schema';
import { VehicleModule } from '../vehicle/vehicle.module';
import { HSEAudit } from './schemas/hse-audit.schema';
import { HSEAuditQuestion } from './schemas/audit-question.schema';
import { JobsModule } from '../jobs/jobs.module';

const connectionName: string = 'Connection-Name';


@Module({
  imports: [
    PersonnelModule,
    VehicleModule,
    JobsModule,
    TypeOrmModule.forFeature([
      HSEQuestion,
      HSEChecklist,
      HSEChecklistQuestion,
      HSEAllocateQuestion,
      HSEAudit,
      HSEAuditQuestion
    ])
  ],
  controllers: [
    HseController
  ],
  providers: [
    HseService
  ],
  exports: [HseService]
})
export class HseModule {}
