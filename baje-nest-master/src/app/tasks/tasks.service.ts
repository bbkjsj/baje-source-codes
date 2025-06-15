import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository, SelectQueryBuilder } from "typeorm";
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { Task } from './schemas/task.schema';
import * as moment from 'moment';
import { TaskType } from 'src/common/enums/task-type.enum';
import { TaskStatus } from 'src/common/enums/task-status.enum';
import { TaskMember } from './schemas/task-member.schema';
import { FailedTaskType } from 'src/common/enums/task-failed.enum';
import { CreateTaskConditionDTO } from './dto/create-condition.dto';
import { TaskCondition } from './schemas/task-condition.schema';
import { UpdateTaskConditionDTO } from './dto/update-condition.dto';
import { KartablTastStatus } from 'src/common/enums/task-kartabl-status.enum';
import { TasksScheduleDaily } from './schemas/task-schedule-daily.schema';
import { TasksScheduleMonthly } from './schemas/task-schedule-monthly.schema';
import { TasksScheduleYearly } from './schemas/tasks-schedule-yearly.schema';
import { TasksToInform } from './schemas/task-toinform.schema';
import { TasksScheduleWeekly } from './schemas/task-schedule-weekly.schema';
import { TaskPriority } from 'src/common/enums/task-priority.enum';
import { TaskPunishment } from 'src/common/enums/task-punishment.enum';
import { TaskDoneCondition } from 'src/common/enums/task-done-condition.enum';
import { WeekDays } from 'src/common/enums/week-days.enum';
import { TasksSMSNotificationType } from 'src/common/enums/tasks-sms-notification.enum';
import { QueueService } from 'src/common/providers/queue/queue.service';
import { TasksSMSNotification } from './schemas/task-sms-notification.schema';
import { PersonnelService } from '../personnel/personnel.service';
import { TaskApproveSequence } from 'src/common/enums/task-approve-sequence.enum';
import { TaskApprover } from './schemas/task-approver.schema';
import { JobsService } from '../jobs/jobs.service';
import { CreateTaskNotMyDutyDTO } from './dto/create-not-my-duty.dto';
import { TasksNotMyDuty } from './schemas/task-notmyduty.schema';
import * as ormconfig from "ormconfig";
import { ITaskCounter } from "./interfaces/task-counter.interface";
import { KavenegarSMS } from "../../common/providers/sms/kavenegar";
import { TaskForward } from "./schemas/task-forward.schema";
import { IS_STRING } from "class-validator";

@Injectable()
export class TasksService {
  private logger: Logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(TaskMember)
    private readonly taskMemberRepo: Repository<TaskMember>,
    @InjectRepository(TaskCondition)
    private readonly taskConditionRepo: Repository<TaskCondition>,
    @InjectRepository(TasksScheduleDaily)
    private readonly tasksScheduleDailyRepo: Repository<TasksScheduleDaily>,
    @InjectRepository(TasksScheduleWeekly)
    private readonly tasksScheduleWeeklyRepo: Repository<TasksScheduleWeekly>,
    @InjectRepository(TasksScheduleMonthly)
    private readonly tasksScheduleMonthlyRepo: Repository<TasksScheduleMonthly>,
    @InjectRepository(TasksScheduleYearly)
    private readonly tasksScheduleYearlyRepo: Repository<TasksScheduleYearly>,
    @InjectRepository(TasksToInform)
    private readonly tasksToInformRepo: Repository<TasksToInform>,
    @InjectRepository(TasksSMSNotification)
    private readonly tasksSMSNotificationRepo: Repository<TasksSMSNotification>,
    @InjectRepository(TaskApprover)
    private readonly taskApproverRepo: Repository<TaskApprover>,
    @InjectRepository(TasksNotMyDuty)
    private readonly taskNotMyDutyRepo: Repository<TasksNotMyDuty>,
    @InjectRepository(TaskForward)
    private readonly taskForwardRepo: Repository<TaskForward>,
    private readonly queueService: QueueService,
    private readonly personnelService: PersonnelService,
    private readonly jobsService: JobsService,
  ) { }

  async create(
    dto: CreateTaskDTO,
    userId: number,
    destinationRecordId?: number,
    conditionId?: number,
  ) {
    try {

      console.log('creating task', dto);

      if (!dto.status) dto.status = TaskStatus.NEW;

      if (!dto.ifTaskFailed) dto.ifTaskFailed = FailedTaskType.DELAYED;

      const _dto: any = {
        ...dto,
      };

      let sms = [];
      if (dto.smsNotification && dto.smsNotification.length > 0) {
        sms = dto.smsNotification;
        delete dto.smsNotification;
      }

      if (dto.approverJobsId) {
        _dto.approverJobsId = dto.approverJobsId.toString();
      }


      const newTask = await this.taskRepo
        .insert({
          ..._dto,
          created_at: new Date(moment().utc(true).format('YYYY/MM/DD HH:mm:ss')),
          created_by: userId,
          destinationRecordId: destinationRecordId || null,
          conditionId: conditionId,
        });

      for(const member of dto.members) {
        await this.taskMemberRepo
          .createQueryBuilder()
          .insert()
          .values([
            {
              taskId: newTask.identifiers[0].id,
              userId: member,
            },
          ])
          .execute();
      }

      if (dto.personnelToInform) {
        const insertToInform = [];

        dto.personnelToInform.forEach((toInform) => {
          insertToInform.push({
            taskId: newTask.identifiers[0].id,
            personnelId: toInform,
          });
        });

        if (insertToInform.length > 0) {
          await this.tasksToInformRepo
            .createQueryBuilder()
            .insert()
            .values(insertToInform)
            .execute();
        }
      }

      await this.handleSms(sms, dto.members, newTask.identifiers[0].id);

      const condition = await this.taskConditionRepo.findOne({
        where: {
          id: conditionId
        }
      });

      if(condition) {
        await this.handleCreatorSMS(condition.creatorId, newTask.identifiers[0].id);
      }

      return newTask;
    } catch (err) {
      throw err;
    }
  }

  async createTaskToInformPersonnel(taskId: number, personnel: number[]) {
    try {

      const tasksToInform: TasksToInform[] = await this.tasksToInformRepo.find({
        where: {
          taskId: taskId
        }
      });

      const currentMembers: number[] = tasksToInform.map(item => item.personnelId);

      const members = personnel.filter(val => !currentMembers.includes(val));

      for(const item of members) {
        await this.tasksToInformRepo
          .createQueryBuilder()
          .insert()
          .values({
            personnelId: item,
            taskId: taskId
          })
          .execute();
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async updateTask(id: number, dto: UpdateTaskDTO, userId: number, file?: Express.Multer.File, attachmentDescription?: string) {
    try {
      const task = await this.taskRepo.findOne({ where: { id: id } });

      const _dto: any = {
        ...dto,
      };

      delete _dto.approved;

      await this.taskRepo
        .createQueryBuilder()
        .update()
        .set({
          ..._dto,
          status: task.conditionId ? TaskStatus.NEW : dto.status,
        })
        .where('id = :id', { id: id })
        .execute();

      if (_dto.status === TaskStatus.DONE) {
        if (task.conditionId) {
          //need to check with condition of task
          await this.checkTaskWithCondition(task, file, attachmentDescription);
        }


        switch (task.approveCondition) {
          case TaskDoneCondition.SPECIFIC_JOB:
            this.updateTaskBasedOnSpecificJobs(task);
            break;
          case TaskDoneCondition.BY_REFERRAL:
            this.updateTaskBasedOnCreator(task);
            break;
          case TaskDoneCondition.SPECIFIC_PERSON:
            this.updateTaskBasedOnSpecificPerson(task);
            break;
          case TaskDoneCondition.NONE:
            await this.taskRepo
              .createQueryBuilder()
              .update()
              .set({
                approved: 1,
                status: TaskStatus.DONE,
              })
              .where('id = :id', { id: id })
              .execute();
            break;
          case TaskDoneCondition.SUPER_ADMIN:
            this.updateTaskBasedOnSuperAdmin(task);
            break;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  async myOpenTasks(userId: number) {
    try {
      return await this.taskRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
        .where('t2.personnel_id_fk = :id and t1.status <> :status', {
          id: userId,
          status: TaskStatus.DONE,
        })
        .select([
          't1.id as id',
          't1.title as title',
          't1.task_type as taskType',
          't1.related_task as relatedTask',
          't1.due_date as dueDate',
          't1.if_task_failed as ifTaskFailed',
          't1.point as point',
          't1.negative_point as negativePoint',
          't1.status as status',
          't1.created_at as created_at',
          't1.description as description',
        ])
        .getRawMany();
    } catch (err) {
      throw err;
    }
  }

  async  createTaskCondition(userId: number, dto: CreateTaskConditionDTO, file?: Express.Multer.File) {
    try {
      const dup = await this.taskConditionRepo
        .createQueryBuilder()
        .where('table_name_id_fk = :id and _condition = :condition', {
          id: dto.tableId,
          condition: dto.condition,
        })
        .getCount();

      if (dup > 0) {
        throw new HttpException('condition already exists', 400);
      }

      const _dto: any = {
        ...dto,
        creatorId: userId,
      };

      if (dto.personnelMembers) {
        _dto.personnelMembers = dto.personnelMembers.toString();
        delete _dto.jobs;
      }
      if (dto.jobs) {
        delete _dto.personnelMembers;
        _dto.jobs = dto.jobs.toString();
      }

      if (dto.personnelToInform) {
        _dto.personnelToInform = dto.personnelToInform.toString();
      }

      if (dto.smsNotification) {
        _dto.smsNotification = dto.smsNotification.toString();
      }

      if (dto.approverJobsId) {
        _dto.approverJobsId = dto.approverJobsId.toString();
      }

      if(file) {
        _dto.file = `tasks/${file.filename}`;
      }

      if(_dto.tableId === 'undefined') {
        delete _dto.tableId;
      }

      const newCondition = await this.taskConditionRepo
        .createQueryBuilder()
        .insert()
        .values([_dto])
        .execute();

      if (dto.dailySchedule) {
        for (let i = 0; i < dto.dailySchedule.length; i++) {
          const item = dto.dailySchedule[i];
          await this.tasksScheduleDailyRepo
            .createQueryBuilder()
            .insert()
            .values([
              {
                conditionId: newCondition.identifiers[0].id,
                hour: +item.hour,
                minute: +item.minute,
                fromDate: item.fromDate
                  ? moment(item.fromDate).utc(false).toDate()
                  : null,
                toDate: item.toDate
                  ? moment(item.toDate).utc(false).toDate()
                  : null,
              },
            ])
            .execute();
        }
      }

      if (dto.weeklySchedule) {
        delete _dto.weeklySchedule;
        const ws = [];
        dto.weeklySchedule.forEach((item) => {
          ws.push({
            conditionId: newCondition.identifiers[0].id,
            dayName: item.dayName,
            hour: item.hour,
            minute: item.minute,
            fromDate: item.fromDate
              ? moment(item.fromDate).utc(false).toDate()
              : null,
            toDate: item.toDate
              ? moment(item.toDate).utc(false).toDate()
              : null,
          });
        });
        await this.tasksScheduleWeeklyRepo
          .createQueryBuilder()
          .insert()
          .values(ws)
          .execute();
      }

      if (dto.monthlySchedule) {
        const ms = [];

        for(const date of dto.monthlySchedule) {
          ms.push({
            conditionId: newCondition.identifiers[0].id,
            date: date
          });
        }
        await this.tasksScheduleMonthlyRepo
          .createQueryBuilder()
          .insert()
          .values(ms)
          .execute();
      }

      if (dto.yearlySchedule) {
        const ys = [];
        for(const date of dto.yearlySchedule) {
          ys.push({
            conditionId: newCondition.identifiers[0].id,
            date: date
          });
        }

        await this.tasksScheduleYearlyRepo
          .createQueryBuilder()
          .insert()
          .values(ys)
          .execute();
      }

      if(dto.enable === '1') {
        this.queueService.taskConditionForOldData({
          conditionId: newCondition.identifiers[0].id
        });
      }

      return newCondition;
    } catch (err) {
      throw err;
    }
  }

  async updateTaskCondition(id: number, dto: UpdateTaskConditionDTO, file?: Express.Multer.File) {
    try {
      const _dto: any = {
        ...dto,
      };

      if (dto.personnelMembers) {
        _dto.personnelMembers = dto.personnelMembers.toString();
        delete _dto.jobs;
      }

      if (dto.jobs) {
        delete _dto.personnelMembers;
        _dto.jobs = dto.jobs.toString();
      }

      if (dto.personnelToInform) {
        _dto.personnelToInform = dto.personnelToInform.toString();
        delete dto.personnelToInform;
      }

      if (dto.personnelToInform) {
        _dto.personnelToInform = dto.personnelToInform.toString();
      }

      if (dto.dailySchedule) {
        delete _dto.dailySchedule;

        //delete previous
        await this.tasksScheduleDailyRepo
          .createQueryBuilder()
          .delete()
          .where('tasks_condition_id_fk = :tid', { tid: id })
          .execute();

        for (let i = 0; i < dto.dailySchedule.length; i++) {
          const item = dto.dailySchedule[i];
          await this.tasksScheduleDailyRepo
            .createQueryBuilder()
            .insert()
            .values([
              {
                conditionId: id,
                hour: +item.hour,
                minute: +item.minute,
                fromDate: item.fromDate
                  ? moment(item.fromDate).utc(false).toDate()
                  : null,
                toDate: item.toDate
                  ? moment(item.toDate).utc(false).toDate()
                  : null,
              },
            ])
            .execute();
        }
      }

      if (dto.weeklySchedule) {
        delete _dto.weeklySchedule;
        //delete previous
        await this.tasksScheduleWeeklyRepo
          .createQueryBuilder()
          .delete()
          .where('tasks_condition_id_fk = :id', { id: id })
          .execute();

        const ws = [];
        dto.weeklySchedule.forEach((item) => {
          ws.push({
            conditionId: id,
            dayName: item.dayName,
            hour: item.hour,
            minute: item.minute,
            fromDate: item.fromDate
              ? moment(item.fromDate).utc(false).toDate()
              : null,
            toDate: item.toDate
              ? moment(item.toDate).utc(false).toDate()
              : null,
          });
        });
        await this.tasksScheduleWeeklyRepo
          .createQueryBuilder()
          .insert()
          .values(ws)
          .execute();
      }

      if (dto.monthlySchedule) {
        //delete previous
        await this.tasksScheduleMonthlyRepo
          .createQueryBuilder()
          .delete()
          .where('tasks_condition_id_fk = :id', { id: id })
          .execute();

        const ms = [];
        for(const date of dto.monthlySchedule) {
          ms.push({
            conditionId: id,
            date: date
          })
        }

        await this.tasksScheduleMonthlyRepo
          .createQueryBuilder()
          .insert()
          .values(ms)
          .execute();
      }

      if (dto.yearlySchedule) {
        //delete previous
        await this.tasksScheduleYearlyRepo
          .createQueryBuilder()
          .delete()
          .where('tasks_condition_id_fk = :id', { id: id })
          .execute();

        const ys = [];
        for(const date of dto.yearlySchedule) {
          ys.push({
            conditionId: id,
            date: date
          })
        }

        await this.tasksScheduleYearlyRepo
          .createQueryBuilder()
          .insert()
          .values(ys)
          .execute();
      }

      if (dto.smsNotification) {
        _dto.smsNotification = dto.smsNotification.toString();
      }

      if(file) {
        _dto.file = `tasks/${file.filename}`;
      }

      const response = await this.taskConditionRepo
        .createQueryBuilder()
        .update()
        .set(_dto)
        .where('id = :id', { id: id })
        .execute();

      this.queueService.taskConditionForOldData({
        conditionId: id
      });

      return response;
    } catch (err) {
      throw err;
    }
  }

  async deleteTaskCondition(id: number) {
    try {
      return await this.taskConditionRepo
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: id })
        .execute();
    } catch (err) {
      throw err;
    }
  }

  async getTaskConditions() {
    try {
      const list = await this.taskConditionRepo.createQueryBuilder( 't1')
        .leftJoinAndSelect('table_name', 't2', 't1.table_name_id_fk = t2.id')
        .select([
          't1.id as id',
          't1.table_name_id_fk as tableId',
          't1._condition as _condition',
          't1.title as title',
          't1.description as description',
          't1.if_task_failed as ifTaskFailed',
          't1.point as point',
          't1.negativePoint as negativePoint',
          't1.personnel_members as personnelMembers',
          't2.table_name as tableName',
          't2.title as tableTitle',
          't1.seconds_after_create as secondsAfterCreate',
          't1.enable as enable',
          't1.jobs as jobs',
        ])
        .orderBy('id', 'DESC')
        .getRawMany();
      return list;
    } catch (err) {
      throw err;
    }
  }

  async getTaskConditionDetail(id: number) {
    //const condition =  await this.taskConditionRepo.createQueryBuilder()
    // .innerJoinAndSelect('table_name', 'table_name', 'table_id_fk')
    // .where('id = :id', { id: id})
    // .getOne();
    const condition = await this.taskConditionRepo.findOne({
      where: {
        id: id,
      },
      relations: ['tableInfo'],
    });

    const dailySchedule = await this.tasksScheduleDailyRepo
      .createQueryBuilder()
      .where('tasks_condition_id_fk = :cid', { cid: id })
      .getMany();
    dailySchedule.forEach((item) => {
      if (item.fromDate) {
        item.fromDate = moment(item.fromDate).utc(true).toDate();
      }
      if (item.toDate) {
        item.toDate = moment(item.toDate).utc(true).toDate();
      }
    });

    const weeklySchedule = await this.tasksScheduleWeeklyRepo
      .createQueryBuilder()
      .where('tasks_condition_id_fk = :id', { id: id })
      .getMany();
    weeklySchedule.forEach((item) => {
      if (item.fromDate) {
        item.fromDate = moment(item.fromDate).utc(true).toDate();
      }
      if (item.toDate) {
        item.toDate = moment(item.toDate).utc(true).toDate();
      }
    });

    const monthlySchedule = await this.tasksScheduleMonthlyRepo
      .createQueryBuilder()
      .where('tasks_condition_id_fk = :id', { id: id })
      .getMany();
    monthlySchedule.forEach((item) => {
      if (item.date) {
        item.date = moment(item.date).utc(true).toDate();
      }
    });

    const yearlySchedule = await this.tasksScheduleYearlyRepo
      .createQueryBuilder()
      .where('tasks_condition_id_fk = :id', { id: id })
      .getMany();
    yearlySchedule.forEach((item) => {
      if (item.date) {
        item.date = moment(item.date).utc(true).toDate();
      }
    });

    return {
      condition: condition,
      daily: dailySchedule,
      weekly: weeklySchedule,
      monthly: monthlySchedule,
      yearly: yearlySchedule,
    };
  }

  async getTableConditionsByTableId(tableId: number) {
    try {
      return this.taskConditionRepo
        .createQueryBuilder()
        .where('table_name_id_fk = :tid', { tid: tableId })
        .andWhere('enable = 1')
        .getMany();
    } catch (err) {
      throw err;
    }
  }

  async kartabl(userId: number, status: KartablTastStatus) {
    try {
      switch (status) {
        case KartablTastStatus.MYTASKS:
          return await this.myTasks(userId);
        case KartablTastStatus.TOAPPROVE:
          return await this.toApproveTasks(userId);
        case KartablTastStatus.DONE:
          return await this.myDoneTasks(userId);
        case KartablTastStatus.NOTDONE:
          return await this.myNotDoneTasks(userId);
        case KartablTastStatus.REDIRECTED:
          return await this.myRedirectedTasks(userId);
        case KartablTastStatus.TOINFO:
          return await this.toInfoTasks(userId);
        case KartablTastStatus.INPROGRESS:
          return await this.inProgress(userId);
        case KartablTastStatus.NOTMYDUTY:
          return await this.notMyDuty(userId);
      }
    } catch (err) {
      throw err;
    }
  }

  private myTasks = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const selectQuery = await this.taskRepo.createQueryBuilder('t1')
          .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
          .leftJoinAndSelect(
            'tasks_condition',
            't3',
            't1.task_condition_id_fk = t3.id',
          )
          .leftJoinAndSelect(
            'personnel',
            'personnel',
            't1.created_by = personnel.id')
          .where('t2.personnel_id_fk = :id and t1.status <> :status', {
            id: userId,
            status: TaskStatus.DONE,
          })
          .select([
            't1.id as id',
            't1.title as title',
            't1.task_type as taskType',
            't1.related_task as relatedTask',
            't1.due_date as dueDate',
            't1.if_task_failed as ifTaskFailed',
            't1.point as point',
            't1.negative_point as negativePoint',
            't1.status as status',
            't1.created_at as created_at',
            't1.description as description',
            't1.status as status',
            't1.priority as priority',
            't1.punishment as punishment',
            't3.referable as referable',
            't1.page_url as pageurl',
            'personnel.first_name as creatorFirstName',
            'personnel.last_name as creatorLastName',
            't2.read_on as readOn'
          ])
          .getRawMany();

        resolve(selectQuery);
      } catch (err) {
        reject(err);
      }
    });
  };

  private toApproveTasks = (userId: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.taskRepo.createQueryBuilder('t1')
          .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
          .innerJoinAndSelect('tasks_approver', 't3', 't3.task_id_fk = t1.id')
          .leftJoinAndSelect(
            'tasks_condition',
            't4',
            't1.task_condition_id_fk = t4.id',
          )
          .leftJoinAndSelect(
            'personnel',
            'personnel',
            't1.created_by = personnel.id')
          .where(
            't1.status = :status and (t1.approved is null or t1.approved = 0) and t3.personnel_id_fk = :pid and t3.approved=0',
            {
              status: TaskStatus.DONE,
              pid: userId,
            },
          )
          .groupBy('t1.id')
          .select([
            't1.id as id',
            't1.title as title',
            't1.task_type as taskType',
            't1.related_task as relatedTask',
            't1.due_date as dueDate',
            't1.if_task_failed as ifTaskFailed',
            't1.point as point',
            't1.negative_point as negativePoint',
            't1.status as status',
            't1.created_at as created_at',
            't1.description as description',
            't1.status as status',
            't1.priority as priority',
            't1.punishment as punishment',
            't4.referable as referable',
            't1.page_url as pageurl',
            'personnel.first_name as creatorFirstName',
            'personnel.last_name as creatorLastName',
            't3.read_on as readOn'
          ])
          .getRawMany();
        resolve(list);
      } catch (err) {
        reject(err);
      }
    });
  };

  private myDoneTasks = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.taskRepo.createQueryBuilder( 't1')
          .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
          .leftJoinAndSelect(
            'tasks_condition',
            't3',
            't1.task_condition_id_fk = t3.id',
          )
          .leftJoinAndSelect(
            'personnel',
            'personnel',
            't1.created_by = personnel.id')
          .where(
            't2.personnel_id_fk = :id and t1.status = :status and t1.approved = 1',
            {
              id: userId,
              status: TaskStatus.DONE,
            },
          )
          .select([
            't1.id as id',
            't1.title as title',
            't1.task_type as taskType',
            't1.related_task as relatedTask',
            't1.due_date as dueDate',
            't1.if_task_failed as ifTaskFailed',
            't1.point as point',
            't1.negative_point as negativePoint',
            't1.status as status',
            't1.created_at as created_at',
            't1.description as description',
            't1.status as status',
            't1.priority as priority',
            't1.punishment as punishment',
            't3.referable as referable',
            't1.page_url as pageurl',
            'personnel.first_name as creatorFirstName',
            'personnel.last_name as creatorLastName'
          ])
          .getRawMany();
        resolve(list);
      } catch (err) {
        reject(err);
      }
    });
  };

  private myNotDoneTasks = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.taskRepo.createQueryBuilder( 't1')
          .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
          .leftJoinAndSelect(
            'tasks_condition',
            't3',
            't1.task_condition_id_fk = t3.id',
          )
          .leftJoinAndSelect(
            'personnel',
            'personnel',
            't1.created_by = personnel.id')
          .where(
            't2.personnel_id_fk = :id and t1.status <> :status and (t1.approved = 0 or t1.approved is null) and t1.if_task_failed = :failed',
            {
              id: userId,
              status: TaskStatus.DONE,
              failed: FailedTaskType.KILL,
            },
          )
          .select([
            't1.id as id',
            't1.title as title',
            't1.task_type as taskType',
            't1.related_task as relatedTask',
            't1.due_date as dueDate',
            't1.if_task_failed as ifTaskFailed',
            't1.point as point',
            't1.negative_point as negativePoint',
            't1.status as status',
            't1.created_at as created_at',
            't1.description as description',
            't1.status as status',
            't1.priority as priority',
            't1.punishment as punishment',
            't3.referable as referable',
            't1.page_url as pageurl',
            'personnel.first_name as creatorFirstName',
            'personnel.last_name as creatorLastName'
          ])
          .getRawMany();
        resolve(list);
      } catch (err) {
        reject(err);
      }
    });
  };

  private myRedirectedTasks = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const list = await this.taskRepo.createQueryBuilder( 't1')
          .innerJoinAndSelect('tasks_forward', 't2', 't1.id = t2.task_id_fk')
          .leftJoinAndSelect(
            'tasks_condition',
            't3',
            't1.task_condition_id_fk = t3.id',
          )
          .leftJoinAndSelect(
            'personnel',
            'personnel',
            't1.created_by = personnel.id')
          .where(
            't2.personnel_id_fk = :id and t1.status <> :status and (t1.approved = 0 or t1.approved is null)',
            {
              id: userId,
              status: TaskStatus.DONE,
            },
          )
          .select([
            't1.id as id',
            't1.title as title',
            't1.task_type as taskType',
            't1.related_task as relatedTask',
            't1.due_date as dueDate',
            't1.if_task_failed as ifTaskFailed',
            't1.point as point',
            't1.negative_point as negativePoint',
            't1.status as status',
            't1.created_at as created_at',
            't1.description as description',
            't1.status as status',
            't1.priority as priority',
            't1.punishment as punishment',
            't3.referable as referable',
            't1.page_url as pageurl',
            'personnel.first_name as creatorFirstName',
            'personnel.last_name as creatorLastName',
            't2.read_on as readOn'
          ])
          .getRawMany();
        resolve(list);
      } catch (err) {
        reject(err);
      }
    });
  };

  private toInfoTasks = (userId: number) => {
    return new Promise(async (resolve, reject) => {
      try {
        // .andWhere(`FIND_IN_SET('${userId.toString()}', t3.personnel_to_inform) > 0`)
        const list = await this.taskRepo.createQueryBuilder( 't1')
          .innerJoinAndSelect('tasks_toinform', 't2', 't1.id = t2.tasks_id_fk')
          .leftJoinAndSelect(
            'tasks_condition',
            't3',
            't1.task_condition_id_fk = t3.id',
          )
          .leftJoinAndSelect(
            'personnel',
            'personnel',
            't1.created_by = personnel.id')
          .andWhere('t2.personnel_id_fk = :userId', {
            userId: userId.toString()
          })
          .select([
            't1.id as id',
            't1.title as title',
            't1.task_type as taskType',
            't1.related_task as relatedTask',
            't1.due_date as dueDate',
            't1.if_task_failed as ifTaskFailed',
            't1.point as point',
            't1.negative_point as negativePoint',
            't1.status as status',
            't1.created_at as created_at',
            't1.description as description',
            't1.status as status',
            't1.priority as priority',
            't1.punishment as punishment',
            't3.referable as referable',
            't1.page_url as pageurl',
            'personnel.first_name as creatorFirstName',
            'personnel.last_name as creatorLastName',
            't2.read_on as readOn'
          ])
          .getRawMany();
        resolve(list);
      } catch (err) {
        reject(err);
      }
    });
  };

  private inProgress = async (userId: number) => {
    return await this.taskMemberRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
      .leftJoinAndSelect(
        'tasks_condition',
        't3',
        't2.task_condition_id_fk = t3.id',
      )
      .leftJoinAndSelect(
        'personnel',
        'personnel',
        't2.created_by = personnel.id')
      .where(
        't1.personnel_id_fk = :uid and t2.status = :status and (t2.approved = 0 or t2.approved is null)',
        {
          uid: userId,
          status: TaskStatus.DONE,
        },
      )
      .select([
        't2.id as id',
        't2.title as title',
        't2.task_type as taskType',
        't2.related_task as relatedTask',
        't2.due_date as dueDate',
        't2.if_task_failed as ifTaskFailed',
        't2.point as point',
        't2.negative_point as negativePoint',
        't2.status as status',
        't2.created_at as created_at',
        't2.description as description',
        't2.status as status',
        't2.priority as priority',
        't2.punishment as punishment',
        't3.referable as referable',
        't2.page_url as pageurl',
        'personnel.first_name as creatorFirstName',
        'personnel.last_name as creatorLastName'
      ])
      .getRawMany();
  };

  private notMyDuty = async (userId: number) => {

    return await this.taskNotMyDutyRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
      .leftJoinAndSelect(
        'personnel',
        'personnel',
        't2.created_by = personnel.id')
      .where('t2.created_by = :uid', {
        uid: userId,
      })
      .select([
        't2.id as id',
        't2.title as title',
        't2.task_type as taskType',
        't2.related_task as relatedTask',
        't2.due_date as dueDate',
        't2.if_task_failed as ifTaskFailed',
        't2.point as point',
        't2.negative_point as negativePoint',
        't2.status as status',
        't2.created_at as created_at',
        't2.description as description',
        't2.status as status',
        't2.priority as priority',
        't2.punishment as punishment',
        't2.page_url as pageurl',
        'personnel.first_name as creatorFirstName',
        'personnel.last_name as creatorLastName'
      ])
      .getRawMany();
  };
  async checkDailyScheduleTasks(hour: number, minute: number) {
    try {
      const today = moment().utc(true).format('YYYY-MM-DD HH:mm:ss');
      const dailyTasks = await this.tasksScheduleDailyRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect(
          'tasks_condition',
          't2',
          't1.tasks_condition_id_fk = t2.id',
        )
        .where(
          't1.hour = :h and t1.minute = :m and (t1.from_date <= :fd or t1.from_date is null) and (t1.to_date >= :td or t1.to_date is null)',
          {
            h: hour,
            m: minute,
            fd: today,
            td: today,
          },
        )
        .select(['t2'])
        .getRawMany();

      console.log(hour, minute);
      console.log('daily tasks found:', dailyTasks.length);

      if (dailyTasks.length > 0) {

        for(const task of dailyTasks) {
          const dto: CreateTaskDTO = {
            title: task.t2_title,
            description: task.t2_description,
            taskType: TaskType.INDEPENDENT,
            relatedTask: null,
            dueDate: moment()
              .utc(false)
              .add(+task.t2_days_after_create, 'days')
              .toDate(),
            ifTaskFailed: task.t2_if_task_failed,
            point: task.t2_point,
            negativePoint: task.t2_negative_point,
            status: TaskStatus.NEW,
            members: task.t2_personnel_members.split(','),
            priority: task.t2_priority ? task.t2_priority : TaskPriority.NORMAL,
            punishment: task.t2_punishment
              ? task.t2_punishment
              : TaskPunishment.NONE,
            pageUrl: task.t2_page_url,
            approveCondition: task.t2_approve_condition
              ? task.t2_approve_condition
              : TaskDoneCondition.NONE,
            approverJobsId:
              task.t2_approver_jobs_ids != null
                ? task.t2_approver_jobs_ids.toString().split(',').map(Number)
                : null,
            approveJobsSequence: task.t2_approve_jobs_sequence,
            approverPersonnelId: task.t2_approver_personnel_id_fk,
            personnelToInform:
              task.t2_personnel_to_inform != null
                ? task.t2_personnel_to_inform.split(',').map(Number)
                : null,
            smsNotification:
              task.t2_sms_notification != null
                ? task.t2_sms_notification.split(',')
                : null,
            referable: task.t2_referable,
            attachmentDescription: null,
          };

          if(task.t2_file) {
            dto.fileUrl = task.t2_file;
          }

          await this.create(dto, +task.t2_creator_id_fk, null, task.t2_id);
        }
      }
    } catch (err) {
      this.logger.error(`error occured: ${err}`);
    }
  }

  async checkWeeklyScheduleTasks(
    dayName: WeekDays,
    hour: number,
    minute: number,
  ) {
    try {
      const today = moment().utc(true).format('YYYY-MM-DD HH:mm:ss');
      const weeklyTasks = await this.tasksScheduleWeeklyRepo.createQueryBuilder(
        't1',
      )
        .innerJoinAndSelect(
          'tasks_condition',
          't2',
          't1.tasks_condition_id_fk = t2.id',
        )
        .where(
          'day_name = :dn and hour=:hour and minute=:minute and (from_date <= :fd or from_date is null) and (to_date >= :td or to_date is null)',
          {
            dn: dayName,
            fd: today,
            td: today,
            minute: minute,
            hour: hour,
          },
        )
        .select('t2')
        .getRawMany();

      weeklyTasks.forEach((task) => {
        const dto: CreateTaskDTO = {
          title: task.t2_title,
          description: task.t2_title,
          taskType: TaskType.INDEPENDENT,
          relatedTask: null,
          dueDate: moment()
            .utc(false)
            .add(+task.t2_days_after_create, 'days')
            .toDate(),
          ifTaskFailed: task.t2_if_task_failed,
          point: task.t2_point,
          negativePoint: task.t2_negative_point,
          status: TaskStatus.NEW,
          members: task.t2_personnel_members.split(','),
          priority: task.t2_priority ? task.t2_priority : TaskPriority.NORMAL,
          punishment: task.t2_punishment
            ? task.t2_punishment
            : TaskPunishment.NONE,
          pageUrl: task.t2_page_url,
          approveCondition: task.t2_approve_condition
            ? task.t2_approve_condition
            : TaskDoneCondition.NONE,
          approverJobsId:
            task.t2_approver_jobs_ids !== null
              ? task.t2_approver_jobs_ids.toString().split(',').map(Number)
              : null,
          approveJobsSequence: task.t2_approve_jobs_sequence,
          approverPersonnelId: task.t2_approver_personnel_id_fk,
          personnelToInform:
            task.t2_personnel_to_inform != null
              ? task.t2_personnel_to_inform.split(',').map(Number)
              : null,
          smsNotification: task.t2_sms_notification
            ? task.t2_sms_notification.split(',')
            : null,
          referable: task.t2_referable,
          attachmentDescription: null,
        };

        if(task.t2_file) {
          dto.fileUrl = task.t2_file;
        }

        this.create(dto, +task.t2_creator_id_fk, null, task.t2_id);
      });
    } catch (err) {
      this.logger.error(`error occured checkWeeklyScheduleTasks: ${err}`);
    }
  }

  async checkMonthlyScheduleTasks(day: number) {
    try {
      const today = moment().utc(true).format('YYYY-MM-DD 00:00:00');
      const monthlyTasks = await this.tasksScheduleMonthlyRepo.createQueryBuilder(
        't1',
      )
        .innerJoinAndSelect(
          'tasks_condition',
          't2',
          't1.tasks_condition_id_fk = t2.id',
        )
        .where(
          't1.date = :date',
          {
            date: moment().utc(true).format('YYYY-MM-DD 00:00:00')
          },
        )
        .select('t2')
        .getRawMany();

      monthlyTasks.forEach((task) => {
        const dto: CreateTaskDTO = {
          title: task.t2_title,
          description: task.t2_title,
          taskType: TaskType.INDEPENDENT,
          relatedTask: null,
          dueDate: moment()
            .utc(false)
            .add(+task.t2_days_after_create, 'days')
            .toDate(),
          ifTaskFailed: task.t2_if_task_failed,
          point: task.t2_point,
          negativePoint: task.t2_negative_point,
          status: TaskStatus.NEW,
          members: task.t2_personnel_members.split(','),
          priority: task.t2_priority ? task.t2_priority : TaskPriority.NORMAL,
          punishment: task.t2_punishment
            ? task.t2_punishment
            : TaskPunishment.NONE,
          pageUrl: task.t2_page_url,
          approveCondition: task.t2_approve_condition
            ? task.t2_approve_condition
            : TaskDoneCondition.NONE,
          approverJobsId: task.t2_approver_jobs_ids
            .toString()
            .split(',')
            .map(Number),
          approveJobsSequence: task.t2_approve_jobs_sequence,
          approverPersonnelId: task.t2_approver_personnel_id_fk,
          personnelToInform:
            task.t2_personnel_to_inform != null
              ? task.t2_personnel_to_inform.split(',').map(Number)
              : null,
          smsNotification: task.t2_sms_notification
            ? task.t2_sms_notification.split(',')
            : null,
          referable: task.t2_referable,
          attachmentDescription: null,
        };

        if(task.t2_file) {
          dto.fileUrl = task.t2_file;
        }

        this.create(dto, task.t2_creator_id_fk, null, task.t2_id);
      });
    } catch (err) {
      this.logger.error(`error on checkMonthlyScheduleTasks: ${err}`);
    }
  }

  async checkYearlyScheduleTasks(day: number, month: number) {
    try {
      const today = moment().utc(true).format('YYYY-MM-DD 00:00:00');
      const yearlyTasks = await this.tasksScheduleYearlyRepo.createQueryBuilder(
        't1',
      )
        .innerJoinAndSelect(
          'tasks_condition',
          't2',
          't1.tasks_condition_id_fk = t2.id',
        )
        .where(
          't1.date = :date',
          {
            date: moment().utc(true).format('YYYY-MM-DD 00:00:00')
          },
        )
        .select('t2')
        .getRawMany();

      yearlyTasks.forEach((task) => {
        const dto: CreateTaskDTO = {
          title: task.t2_title,
          description: task.t2_title,
          taskType: TaskType.INDEPENDENT,
          relatedTask: null,
          dueDate: moment()
            .utc(false)
            .add(+task.t2_days_after_create, 'days')
            .toDate(),
          ifTaskFailed: task.t2_if_task_failed,
          point: task.t2_point,
          negativePoint: task.t2_negative_point,
          status: TaskStatus.NEW,
          members: task.t2_personnel_members.split(','),
          priority: task.t2_priority ? task.t2_priority : TaskPriority.NORMAL,
          punishment: task.t2_punishment
            ? task.t2_punishment
            : TaskPunishment.NONE,
          pageUrl: task.t2_page_url,
          approveCondition: task.t2_approve_condition
            ? task.t2_approve_condition
            : TaskDoneCondition.NONE,
          approverJobsId: task.t2_approver_jobs_ids
            .toString()
            .split(',')
            .map(Number),
          approveJobsSequence: task.t2_approve_jobs_sequence,
          approverPersonnelId: task.t2_approver_personnel_id_fk,
          personnelToInform:
            task.t2_personnel_to_inform != null
              ? task.t2_personnel_to_inform.split(',').map(Number)
              : null,
          smsNotification: task.t2_sms_notification
            ? task.t2_sms_notification.split(',')
            : null,
          referable: task.t2_referable,
          attachmentDescription: null,
        };

        if(task.t2_file) {
          dto.fileUrl = task.t2_file;
        }
        this.create(dto, task.t2_creator_id_fk, null, task.t2_id);
      });
    } catch (err) {
      this.logger.error(`error on checkYearlyScheduleTasks: ${err}`);
    }
  }

  async findAllTasksSMSNotification(date: string) {
    try {
      const list = await this.tasksSMSNotificationRepo.createQueryBuilder('t1')
        .innerJoinAndSelect('personnel', 't2', 't1.personnel_id_fk = t2.id')
        .where('DATE_FORMAT(t1.date, :df) = :date', {
          df: '%Y-%m-%d %H:%i',
          date: date,
        })
        .select([
          't2.mobile1 as mobile',
          't1.percentage as percentage',
          't1.tasks_id_fk as taskId',
          't2.first_name as firstName',
          't2.last_name as lastName',
        ])
        .getRawMany();

      return list;
    } catch (err) {
      throw err;
    }
  }

  async approveTask(id: number, userId: number) {
    const task = await this.taskRepo.findOne({ where: { id: id } });

    if (task.approved == 1 && task.status === TaskStatus.DONE) {
      return `${id} closed`;
    }

    if (task) {
      if (task.approveCondition === TaskDoneCondition.SPECIFIC_JOB) {
        return await this.approveTaskBasedOnSpecificJob(task, userId);
      } else if (task.approveCondition === TaskDoneCondition.SUPER_ADMIN) {
        return await this.approveTaskBasedOnSuperAdmin(task, userId);
      } else {
        const approveEntity = await this.taskApproverRepo.findOne({
          where: {
            personnelId: userId,
            taskId: id,
            approved: 0,
          },
        });
        if (approveEntity) {
          await this.taskApproverRepo
            .createQueryBuilder()
            .update()
            .where('id = :id', { id: approveEntity.id })
            .set({
              approved: 1,
            })
            .execute();

          await this.taskRepo
            .createQueryBuilder()
            .update()
            .set({
              approved: 1,
            })
            .where('id = :id', { id: id })
            .execute();

          await this.queueService.sendSMSAfterTaskApproved({
            taskId: task.id,
            creatorId: task.created_by
          });

          await this.taskMemberRepo.createQueryBuilder()
            .update()
            .set({
              read_on: null
            })
            .where('task_id_fk = :tid', {
              tid: +task.id
            })
            .execute();

          return 'task has been approved';
        } else {
          throw new NotFoundException('task has not been found');
        }
      }
    } else {
      throw new NotFoundException('task could not be found');
    }
  }

  private async handleSms(
    sendCondition: TasksSMSNotificationType[],
    members: number[],
    taskId: number,
  ) {
    try {

      for (let i = 0; i < sendCondition.length; i++) {
        const condition = sendCondition[i] as TasksSMSNotificationType;
        switch (condition) {
          case TasksSMSNotificationType.START:
            this.queueService.smsSendAfterTaskCreated({
              members: members,
              taskId: taskId,
            });
            break;
          case TasksSMSNotificationType.PERCENT25:
            this.queueService.smsSendOn25Percent({
              taskId: taskId,
              members: members,
            });
            break;
          case TasksSMSNotificationType.PERCENT50:
            this.queueService.smsSendOn50Percent({
              taskId: taskId,
              members: members,
            });
            break;
          case TasksSMSNotificationType.PERCENT75:
            this.queueService.smsSendOn75Percent({
              taskId: taskId,
              members: members,
            });
            break;
          case TasksSMSNotificationType.PERCENT90:
            this.queueService.smsSendOn90Percent({
              taskId: taskId,
              members: members,
            });
            break;
        }
      }
    } catch (err) {
      throw err;
    }
  }

  private async handleCreatorSMS(creatorId: number, taskId: number) {
    this.queueService.sendSMSToTaskCreator({
      creatorId: creatorId,
      taskId: taskId
    });
  }

  async setSMSNotificationForMembersOf(
    taskId: number,
    members: number[],
    percentage: number,
  ) {
    try {
      const sendSMSObject = await this.calculatePercentage(percentage, taskId);
      const insert = [];
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        insert.push({
          personnelId: +member,
          date: sendSMSObject.sendDate,
          taskId: taskId,
          percentage: percentage,
        });
      }

      this.tasksSMSNotificationRepo
        .createQueryBuilder()
        .insert()
        .values(insert)
        .execute();
    } catch (err) { }
  }
  private async calculatePercentage(percentage: number, taskId: number) {
    try {
      const task = await this.taskRepo
        .createQueryBuilder()
        .where('id = :id and status <> :status', {
          id: taskId,
          status: TaskStatus.DONE,
        })
        .getOne();

      if (task && task.dueDate && task.created_at) {
        const fromDate = moment(task.created_at).utc(true);
        const toDate = moment(task.dueDate).utc(true);
        const duration = moment.duration(toDate.diff(fromDate)).asSeconds();
        const sendDate = moment(fromDate)
          .utc(false)
          .add(Math.round(percentage * 0.01 * duration), 'seconds')
          .format('YYYY/MM/DD HH:mm:ss');
        return {
          startDate: task.created_at,
          seconds: Math.round(percentage * 0.01 * duration),
          sendDate: sendDate,
        };
      } else {
        throw new Error(
          'task does not have either dueDate / created_at to calculate the percentage',
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async taskDetail(id: number) {
    try {
      const task = await this.taskRepo.findOne({
        where: {
          id: id,
        },
      });

      if (task) {
        const membersArray = [];
        const members = await this.taskMemberRepo.find({
          where: {
            taskId: task.id,
          },
        });
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          const personnel = await this.personnelService.findPersonnelById(
            member.userId,
          );
          membersArray.push({
            id: personnel.id,
            firstName: personnel.first_name,
            lastName: personnel.last_name,
            mobile: personnel.mobile1,
            nationalCode: personnel.national_number,
          });
        }

        const toInformArray = [];
        const toInforms = await this.tasksToInformRepo.find({
          where: {
            taskId: task.id,
          },
        });

        for (let i = 0; i < toInforms.length; i++) {
          const personnel = await this.personnelService.findPersonnelById(
            toInforms[i].personnelId,
          );
          if (personnel) {
            toInformArray.push({
              id: personnel.id,
              firstName: personnel.first_name,
              lastName: personnel.last_name,
              mobile: personnel.mobile1,
              nationalCode: personnel.national_number,
            });
          }
        }

        const notMyDuty = await this.taskNotMyDutyRepo.findOne({
          where: {
            taskId: task.id,
          },
        });


        const forwardTaskMembers = await this.taskForwardRepo.createQueryBuilder('t1')
          .innerJoinAndSelect('personnel', 'personnel', 't1.personnel_id_fk = personnel.id')
          .where('t1.task_id_fk = :tid', {
            tid: task.id
          })
          .select([
            'personnel.first_name as firstName',
            'personnel.last_name as lastName',
            'personnel.id as id'
          ])
          .getRawMany();



        const forwardMembersArray: any[] = [];

        for(const forwardTaskMember of forwardTaskMembers) {
          forwardMembersArray.push({
            fullName: `${forwardTaskMember.firstName} ${forwardTaskMember.lastName}`,
            id: forwardTaskMember.id
          })
        }

        return {
          task: task,
          members: membersArray,
          membersToInform: toInformArray,
          notMyDuty: notMyDuty,
          forwardMembers: forwardMembersArray
        };
      } else {
        throw new NotFoundException('task could not be found');
      }
    } catch (err) {
      throw err;
    }
  }

  async createNotMyDuty(dto: CreateTaskNotMyDutyDTO, userId: number) {
    try {
      const notMyDuty = await this.taskNotMyDutyRepo
        .createQueryBuilder()
        .insert()
        .values([
          {
            ...dto,
            date: moment().utc(true).format('YYYY/MM/DD HH:mm:ss'),
            personnelId: userId,
            approved: null,
          },
        ])
        .execute();

      //remove user from task_member
      await this.taskMemberRepo
        .createQueryBuilder()
        .delete()
        .where('task_id_fk = :tid and personnel_id_fk = :pid', {
          tid: dto.taskId,
          pid: userId,
        })
        .execute();
    } catch (err) {
      throw err;
    }
  }

  async approveNotMyDuty(taskId: number, approve: boolean, userId: number) {
    try {
      const entity = await this.taskNotMyDutyRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
        .innerJoinAndSelect(
          'tasks_condition',
          't3',
          't2.task_condition_id_fk = t3.id',
        )
        .where(
          't1.task_id_fk = :tid and t3.creator_id_fk = :creator and t1.approved is null',
          {
            tid: taskId,
            creator: userId,
          },
        )
        .getRawOne();

      if (entity) {
        await this.taskNotMyDutyRepo
          .createQueryBuilder()
          .update()
          .where('task_id_fk = :tid', {
            tid: taskId
          })
          .set({
            approved: approve == true ? 1 : 0
          })
          .execute();

        //remove user from members
      } else {
        throw new NotFoundException('task could not be found');
      }
    } catch (err) {
      throw err;
    }
  }


  async getCounters(userId: number): Promise<ITaskCounter> {
    const tasks: number = await this.taskMemberRepo.createQueryBuilder('t1')
      .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
      .where('t1.personnel_id_fk = :pid', {
        pid: userId
      })
      .andWhere('t2.status <> :status', {
        status: TaskStatus.DONE
      })
      .andWhere('t1.read_on is null')
      .getCount();

    const toInform: number = await this.tasksToInformRepo.createQueryBuilder('t1')
      .innerJoinAndSelect('tasks', 't2', 't1.tasks_id_fk = t2.id')
      .where('t1.personnel_id_fk = :pid', {
        pid: userId
      })
      .andWhere('t2.status <> :status', {
        status: TaskStatus.DONE
      })
      .andWhere('t1.read_on is null')
      .getCount();


    const inProgress: number = await this.taskMemberRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
      .leftJoinAndSelect(
        'tasks_condition',
        't3',
        't2.task_condition_id_fk = t3.id',
      )
      .where(
        't1.personnel_id_fk = :uid and t2.status = :status and (t2.approved = 0 or t2.approved is null)',
        {
          uid: userId,
          status: TaskStatus.DONE,
        },
      )
      .andWhere('t1.read_on is null')
      .getCount();



    const done: number = await this.taskRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
      .leftJoinAndSelect(
        'tasks_condition',
        't3',
        't1.task_condition_id_fk = t3.id',
      )
      .where(
        't2.personnel_id_fk = :id and t1.status = :status and t1.approved = 1',
        {
          id: userId,
          status: TaskStatus.DONE,
        },
      )
      .andWhere('t2.read_on is null')
      .getCount();

    const notDone: number = await this.taskRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks_member', 't2', 't1.id = t2.task_id_fk')
      .leftJoinAndSelect(
        'tasks_condition',
        't3',
        't1.task_condition_id_fk = t3.id',
      )
      .where(
        't2.personnel_id_fk = :id and t1.status <> :status and (t1.approved = 0 or t1.approved is null) and t1.if_task_failed = :failed',
        {
          id: userId,
          status: TaskStatus.DONE,
          failed: FailedTaskType.KILL,
        },
      )
      .andWhere('t2.read_on is null')
      .getCount();

    const redirected: number = await this.taskRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks_forward', 't2', 't1.id = t2.task_id_fk')
      .leftJoinAndSelect(
        'tasks_condition',
        't3',
        't1.task_condition_id_fk = t3.id',
      )
      .where(
        't2.personnel_id_fk = :id and t1.status <> :status and (t1.approved = 0 or t1.approved is null)',
        {
          id: userId,
          status: TaskStatus.DONE,
        },
      )
      .andWhere('t2.read_on is null')
      .getCount();

    const toApprove: number = await this.taskRepo.createQueryBuilder('t1')
      .innerJoinAndSelect('tasks_approver', 't3', 't3.task_id_fk = t1.id')
      .leftJoinAndSelect(
        'tasks_condition',
        't4',
        't1.task_condition_id_fk = t4.id',
      )
      .where(
        't1.status = :status and (t1.approved is null or t1.approved = 0) and t3.personnel_id_fk = :pid and t3.approved=0',
        {
          status: TaskStatus.DONE,
          pid: userId,
        },
      )
      .andWhere('t3.read_on is null')
      .groupBy('t1.id')
      .getCount();

    const notMyDuty: number = await this.taskNotMyDutyRepo.createQueryBuilder( 't1')
      .innerJoinAndSelect('tasks', 't2', 't1.task_id_fk = t2.id')
      .where('t2.created_by = :uid', {
        uid: userId,
      })
      .andWhere('t1.read_on is null')
      .getCount();

    return {
      tasks: tasks,
      toInform: toInform,
      inProgress: inProgress,
      done: done,
      notDone: notDone,
      redirected: redirected,
      toApprove: toApprove,
      notMyDuty: notMyDuty
    };
  }

  private updateTaskBasedOnSpecificJobs = async (task: Task) => {
    if (task.approverJobsId) {
      const members = await this.personnelService.findPersonnelofJobs(
        task.approverJobsId.split(',').map(Number),
      );

      if (task.approveJobsSequence === TaskApproveSequence.LINEAR) {
        this.taskApproverRepo.insert({
          personnelId: members[0].personnel_id_fk,
          taskId: task.id,
          approved: 0,
        });
      } else {
        const insert = [];
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          insert.push({
            personnelId: member.personnel_id_fk,
            taskId: task.id,
            approved: 0,
          });
        }
        this.taskApproverRepo
          .createQueryBuilder()
          .insert()
          .values(insert)
          .execute();
      }
    }
  };

  private updateTaskBasedOnCreator = async (task: Task) => {
    if (task.conditionId) {
      const condition = await this.taskConditionRepo.findOne({
        where: { id: task.conditionId },
      });
      await this.taskApproverRepo.insert({
        personnelId: condition.creatorId,
        taskId: task.id,
        approved: 0,
      });
    } else if (task.created_by != -1) {
      await this.taskApproverRepo.insert({
        personnelId: task.created_by,
        taskId: task.id,
        approved: 0,
      });
    }
    return 'task sent to creator for approval';
  };

  private approveTaskBasedOnSpecificJob = async (
    task: Task,
    userId: number,
  ) => {
    const usersCanApprove = await this.personnelService.findPersonnelofJobs(
      task.approverJobsId.split(',').map(Number),
    );

    if (usersCanApprove.find((x) => x.personnel_id_fk == userId) == undefined) {
      throw new NotFoundException(
        `you are not able to approve task #${task.id}`,
      );
    }

    const userCanApprove = await this.taskApproverRepo.findOne({
      where: {
        taskId: task.id,
        personnelId: userId,
        approved: 0,
      },
    });

    if (userCanApprove === undefined) {
      throw new NotFoundException('you are not able to approve at this stage');
    }

    await this.taskApproverRepo
      .createQueryBuilder()
      .where('id = :id', { id: userCanApprove.id })
      .update()
      .set({ approved: 1 })
      .execute();

    if (task.approveJobsSequence === TaskApproveSequence.LINEAR) {
      const index = usersCanApprove.findIndex(
        (x) => x.personnel_id_fk === userId,
      );
      //next person to update
      const nextPerson = usersCanApprove[index + 1];
      if (nextPerson != undefined) {
        await this.taskApproverRepo
          .createQueryBuilder()
          .insert()
          .values([
            {
              taskId: task.id,
              personnelId: nextPerson.personnel_id_fk,
              approved: 0,
            },
          ])
          .execute();
      }
    } else if (task.approveJobsSequence === TaskApproveSequence.PARALLEL) {
      //approve all
      await this.taskApproverRepo
        .createQueryBuilder()
        .update()
        .where('task_id_fk = :tid', { tid: task.id })
        .set({
          approved: 1,
        })
        .execute();
    }

    //count number of approves
    const approveCount = await this.taskApproverRepo.count({
      where: {
        taskId: task.id,
        approved: 1,
      },
    });

    if (approveCount == usersCanApprove.length) {
      //close the task
      await this.taskRepo
        .createQueryBuilder()
        .update()
        .set({
          approved: 1,
          status: TaskStatus.DONE,
        })
        .execute();

      return `${task.id} closed`;
    }
  };

  private approveTaskBasedOnSuperAdmin = async (task: Task, userId: number) => {
    const entity = await this.taskApproverRepo.findOne({
      where: {
        personnelId: userId,
        taskId: task.id,
        approved: 0,
      },
    });

    if (entity) {
      await this.taskApproverRepo
        .createQueryBuilder()
        .update()
        .where('task_id_fk = :id', { id: task.id })
        .set({
          approved: 1,
        })
        .execute();

      await this.taskRepo
        .createQueryBuilder()
        .update()
        .where('id = :id', { id: task.id })
        .set({
          approved: 1,
        })
        .execute();
    } else {
      throw new NotFoundException('task could not be found');
    }
  };

  private updateTaskBasedOnSpecificPerson = async (task: Task) => {
    await this.taskApproverRepo
      .createQueryBuilder()
      .insert()
      .values([
        {
          taskId: task.id,
          personnelId: task.approverPersonnelId,
          approved: 0,
        },
      ])
      .execute();
  };

  private updateTaskBasedOnSuperAdmin = async (task: Task) => {
    const superAdmins = await this.personnelService.getSuperAdmins();
    superAdmins.forEach((admin) => {
      this.taskApproverRepo
        .createQueryBuilder()
        .insert()
        .values([
          {
            personnelId: admin.id,
            taskId: task.id,
            approved: 0,
          },
        ])
        .execute();
    });
  };

  private checkTaskWithCondition = async (
    task: Task,
    file?: Express.Multer.File,
    attachmentDescription?: string
  ) => {

    const condition = await this.taskConditionRepo.findOne({
      where: {
        id: task.conditionId
      }
    });

    const dataSource = new DataSource(ormconfig);

    await dataSource.initialize();

    if(condition.tableId) {
      const conditionBasedOnTable = await this.taskConditionRepo.createQueryBuilder( 't1')
        .innerJoinAndSelect('table_name', 't2', 't1.table_name_id_fk = t2.id')
        .where('t1.id = :id', { id: task.conditionId })
        .getRawOne();

      if(!conditionBasedOnTable) {
        throw new NotFoundException('condition could not be found');
      }


      const checkCondition = await dataSource.createQueryBuilder(
        conditionBasedOnTable.t2_table_name,
        't1',
      )
        .where(
          `t1.${conditionBasedOnTable.t1__condition} and t1.id = ${task.destinationRecordId}`,
        )
        .getOne();


      if(checkCondition) {
        await dataSource.destroy();

        throw new HttpException(
          'condition is still exists, task could not be closed',
          400,
        );
      }
    }

    let approved: boolean = true;

    if(condition.approverPersonnelId) {
      approved = false;
    }
    let fileUrl: string = null;

    if(file) {
      fileUrl = `tasks/${file.filename}`;
    }
    //can close task
    await this.taskRepo
      .createQueryBuilder()
      .update()
      .set({
        approved: approved == true ? 1 : 0,
        status: TaskStatus.DONE,
        attachmentUrl: fileUrl,
        attachmentDescription: attachmentDescription
      })
      .where('id = :id', { id: task.id })
      .execute();

    await this.queueService.sendSMSAfterTaskDone({
      taskId: task.id,
      creatorId: task.created_by
    });

    await dataSource.destroy();

    return `task #${task.id} closed.`;
  };

  private caluclateTaskPoint = async (taskId: number) => {
    try {
    } catch (err) {
      return 0;
    }
  };

  async readTask(args: {
    taskId: number;
    userId: number;
  }): Promise<void> {

    await this.taskMemberRepo.update({
      taskId: args.taskId,
      userId: args.userId,
      read_on: IsNull(),
    }, {
      read_on: new Date(moment().utc(true).format('YYYY-MM-DD HH:mm:ss'))
    });

    await this.taskApproverRepo.update({
      taskId: args.taskId,
      personnelId: args.userId,
      readOn: IsNull()
    }, {
      readOn: new Date(moment().utc(true).format('YYYY-MM-DD HH:mm:ss'))
    });

    await this.taskForwardRepo.update({
      taskId: args.taskId,
      personnelId: args.userId,
      readOn: IsNull()
    }, {
      readOn: new Date(moment().utc(true).format('YYYY-MM-DD HH:mm:ss'))
    });

    const notMyDuty = await this.taskNotMyDutyRepo.createQueryBuilder('t1')
      .innerJoinAndSelect('tasks', 'tasks', 't1.task_id_fk = tasks.id')
      .where('t1.read_on is null')
      .select('t1')
      .getOne();

    if(notMyDuty) {
      notMyDuty.readOn = new Date(moment().utc(true).format('YYYY-MM-DD HH:mm:ss'));
      await this.taskNotMyDutyRepo.save(notMyDuty);
    }

    await this.tasksToInformRepo.update({
      taskId: args.taskId,
      personnelId: args.userId,
      readOn: IsNull()
    }, {
      readOn: new Date(moment().utc(true).format('YYYY-MM-DD HH:mm:ss'))
    });

  }

  async forwardTask(args: {
    taskId: number;
    forwardTo: number[];
    description: string;
  }): Promise<void> {
    for(const personnelId of args.forwardTo) {
      await this.tasksToInformRepo.delete({
        taskId: args.taskId,
        personnelId: personnelId
      });

      await this.taskForwardRepo.insert({
        personnelId: personnelId,
        taskId: args.taskId,
        description: args.description
      });
    }
  }
}
