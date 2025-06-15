import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './schemas/task.schema';
import { PersonnelModule } from '../personnel/personnel.module';
import { TaskMember } from './schemas/task-member.schema';
import { TaskCondition } from './schemas/task-condition.schema';
import { TaskSubscriber } from './subscribers/task-subscriber.subscriber';
import { TestTable } from './schemas/test-table.schema';
import { QueueModule } from 'src/common/providers/queue/queue.module';
import { TasksScheduleDaily } from './schemas/task-schedule-daily.schema';
import { TasksScheduleMonthly } from './schemas/task-schedule-monthly.schema';
import { TasksScheduleYearly } from './schemas/tasks-schedule-yearly.schema';
import { TasksToInform } from './schemas/task-toinform.schema';
import { TasksScheduleWeekly } from './schemas/task-schedule-weekly.schema';
import { TasksSMSNotification } from './schemas/task-sms-notification.schema';
import { TaskApprover } from './schemas/task-approver.schema';
import { JobsModule } from '../jobs/jobs.module';
import { TasksNotMyDuty } from './schemas/task-notmyduty.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TasksEventListener } from './events/task-event-listener';
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import e from "express";
import { Error } from "read-excel-file/types";
import * as moment from "moment/moment";
import { extname } from "path";
import { TaskForward } from "./schemas/task-forward.schema";

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Task,
      TaskMember,
      TaskCondition,
      TestTable,
      TasksScheduleDaily,
      TasksScheduleWeekly,
      TasksScheduleMonthly,
      TasksScheduleYearly,
      TasksToInform,
      TasksSMSNotification,
      TaskApprover,
      TasksNotMyDuty,
      TaskForward
    ]),
    PersonnelModule,
    JobsModule,
    forwardRef(() => QueueModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/tasks',
        filename: (req, file, cb)=> {
          cb(null, `${moment().utc(true).format('YYMMDDHHMMSSS')}${extname(file.originalname)}`);
        }
      }),
      limits: {
        fileSize: 31457280 //30Mb
      }
    })
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskSubscriber, TasksEventListener],
  exports: [TasksService]
})
export class TasksModule {}
