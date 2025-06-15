import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './schemas/job.schema';
import { PersonnelModule } from '../personnel/personnel.module';
import { JobPermission } from './schemas/job_permission.schema';
import { JobsTaminCode } from './schemas/job_tamin_code.schema';
import { JobsShift } from './schemas/job_shift.schema';
import { JobsShiftPattern } from './schemas/job_shift_pattern.schema';
import { JobChart } from './schemas/job_chart.schema';
import { JobChartNode } from './schemas/job_chart_node.schema';
import { PersonnelShift } from "../personnel/schemas/personnel-shift.schema";

@Module({
  imports:[
    PersonnelModule,
    TypeOrmModule.forFeature([
      Job,
      JobPermission,
      JobsTaminCode,
      JobsShift,
      JobsShiftPattern,
      JobChart,
      JobChartNode,
      PersonnelShift
    ])
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports:[JobsService]
})
export class JobsModule {}
