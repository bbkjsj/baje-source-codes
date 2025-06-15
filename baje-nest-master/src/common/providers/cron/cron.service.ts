import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';
import { TasksService } from 'src/app/tasks/tasks.service';
import { WeekDays } from 'src/common/enums/week-days.enum';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class CronService {
  private logger: Logger = new Logger(CronService.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly queueService: QueueService,
  ) {}

  //@Cron('*/15 * * * *')
  @Cron(CronExpression.EVERY_MINUTE)
  every15MinutesScheduler() {
    const hour = +moment().utc(true).format('HH');
    const minute = +moment().utc(true).format('mm');
    const dayName = moment().utc(true).format('dddd');
    this.logger.log(`every 15 minutes scheduler ran at: ${hour}:${minute}`);
    this.tasksService.checkDailyScheduleTasks(hour, minute);
    this.tasksService.checkWeeklyScheduleTasks(
      dayName as WeekDays,
      hour,
      minute,
    );
  }

  // @Cron(CronExpression.EVERY_HOUR)
  // every1HourSchedule() {
  //   const hour = +moment().utc(true).format('HH');
  //   const minute = +moment().utc(true).format('mm');
  //   const dayName = moment().utc(true).format('dddd');
  //   this.logger.debug(`every 1hour scheduler ran at: ${hour}:${minute}`);
  //   this.tasksService.checkDailyScheduleTasks(hour, minute);
  //   this.tasksService.checkWeeklyScheduleTasks(
  //     dayName as WeekDays,
  //     hour,
  //     minute,
  //   );
  // }

  @Cron(CronExpression.EVERY_MINUTE)
  every1MinuteSchedule() {
    const date = moment().utc(true).format('YYYY-MM-DD HH:mm');
    this.queueService.checkForTasksSMS({
      date: date,
    });
  }

  @Cron('30 7 * * *')
  everyDayAt730Schedule() {
    const day = +moment().utc(true).format('DD');
    const month = +moment().utc(true).format('MM');
    this.logger.log('every day at 7:30 scheduler ran');
    this.tasksService.checkMonthlyScheduleTasks(day);
  }


}
