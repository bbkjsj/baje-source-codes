import { Process, Processor } from "@nestjs/bull";
import { forwardRef, Inject, Logger } from "@nestjs/common";
import { Job } from "bull";
import { TableNameService } from "src/app/table-name/table-name.service";
import { CreateTaskDTO } from "src/app/tasks/dto/create-task.dto";
import { TasksService } from "src/app/tasks/tasks.service";
import { DataSource, getConnection } from "typeorm";
import { QueueService } from "./queue.service";
import * as moment from "moment";
import { TaskStatus } from "src/common/enums/task-status.enum";
import { TaskType } from "src/common/enums/task-type.enum";
import { PersonnelService } from "src/app/personnel/personnel.service";
import { TaskPriority } from "src/common/enums/task-priority.enum";
import { TaskPunishment } from "src/common/enums/task-punishment.enum";
import { TaskDoneCondition } from "src/common/enums/task-done-condition.enum";
import { TasksSMSNotificationType } from "src/common/enums/tasks-sms-notification.enum";
import { NimaadSMS } from "../sms/nimaadsms";
import * as ormconfig from 'ormconfig';
import { createConnection } from "mysql2";
import { getEntityManagerToken } from "@nestjs/typeorm";
import { KavenegarSMS } from "../sms/kavenegar";
@Processor('mainQueue')
export class QueueProcessor {

    private logger: Logger = new Logger();

    constructor(private queueService: QueueService,
        private readonly tableNameService: TableNameService,
        @Inject(forwardRef(() => TasksService)) private readonly tasksService: TasksService,
        private readonly personnelService: PersonnelService,
    ) { }

    @Process('task-condition')
    async handleTasksConditions(job: Job) {

        try {
            if (job.data.tableName) {
                const tableEntity = await this.tableNameService.getTableIdByName(job.data.tableName);

                if (tableEntity) {
                    //check conditions on tableId
                    const tableCondition = await this.tasksService.getTableConditionsByTableId(tableEntity.id);

                    if (tableCondition && tableCondition.length > 0) {
                        let tableNames = [];
                        let tableValues = [];

                        const dataSource: DataSource = new DataSource(ormconfig);

                        await dataSource.initialize();



                        for (let i = 0; i < tableCondition.length; i++) {
                            const item = tableCondition[i];
                            const arr = item.condition.split(/<|=|>/)
                            tableNames.push(arr[0].trim());
                            tableValues.push(arr[arr.length - 1]);

                            const cmd = `select ${[...new Set(tableNames)].toString()} from ${job.data.tableName} where ${item.condition} order by id desc limit 1;`;

                            const list = await dataSource.manager.query(cmd);

                            let membersArray = [];

                            if (list.length > 0) {
                                if (item.personnelMembers) {
                                    membersArray = item.personnelMembers.split(',').map(Number);
                                }
                                else if (item.jobs != null) {
                                    const jobs = item.jobs.split(',');

                                    jobs.forEach(async job => {
                                        const members = await this.personnelService.findPersonnelOfJob(+job);
                                        members.forEach(member => {
                                            membersArray.push(member.personnel_id_fk);
                                        })
                                    })
                                    membersArray = [...new Set(membersArray)];
                                }
                                if (membersArray.length > 0) {

                                    //create tasks and store id
                                    const createTaskDTO: CreateTaskDTO = {
                                        title: item.title,
                                        description: item.description,
                                        dueDate: moment().utc(true).add(item.secondsAfterCreate, 'seconds').toDate(),
                                        ifTaskFailed: item.ifTaskFailed,
                                        point: item.point,
                                        negativePoint: item.negativePoint,
                                        members: membersArray,
                                        status: TaskStatus.NEW,
                                        relatedTask: null,
                                        taskType: TaskType.INDEPENDENT,
                                        priority: item.priority != null ? item.priority : TaskPriority.NORMAL,
                                        punishment: item.punishment != null ? item.punishment : TaskPunishment.NONE,
                                        pageUrl: item.pageUrl,
                                        approveCondition: item.approveCondition,
                                        approverJobsId: item.approverJobsId != null ? item.approverJobsId.split(',').map(Number) : null,
                                        approverPersonnelId: item.approverPersonnelId,
                                        personnelToInform: item.personnelToInform != null ? item.personnelToInform.split(',').map(Number) : null,
                                        smsNotification: item.smsNotification ? item.smsNotification.split(',') as TasksSMSNotificationType[] : null,
                                        approveJobsSequence: item.approveJobsSequence,
                                        referable: item.referable,
                                        attachmentDescription: null,
                                    }
                                    const newTask = await this.tasksService.create(createTaskDTO, -1, +job.data.body.id, item.id);
                                    //check for task members to inform
                                    if (item.personnelToInform) {
                                        const personnels = item.personnelToInform.toString().split(',').map(Number);
                                        await this.tasksService.createTaskToInformPersonnel(newTask.identifiers[0].id, personnels);
                                    }
                                }


                            }
                        }
                        await dataSource.destroy();
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            console.log('error at queue processor');
        }

    }

    @Process('send-sms-after-task-created')
    async handleSendSMS(job: Job) {
        console.log('send-sms-after-task-created is running');
        try {
            if (job.data.members && job.data.taskId) {
                for (let i = 0; i < job.data.members.length; i++) {
                    const personnel = await this.personnelService.findPersonnelById(+job.data.members[i]);
                    if (personnel) {
                        new NimaadSMS().sendCreatedTask(personnel.mobile1, +job.data.taskId, `${personnel.first_name} ${personnel.last_name}`);
                    }
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    @Process('send-sms-after-25percent-of-task')
    async handleSendSMSOn25PercentOfTask(job: Job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 25);
            }
        }
        catch (err) {
            throw err;
        }
    }

    @Process('send-sms-after-50percent-of-task')
    async handleSendSMSOn50PercentOfTask(job: Job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 50);
            }
        }
        catch (err) {
            throw err;
        }
    }

    @Process('send-sms-after-75percent-of-task')
    async handleSendSMSOn75PercentOfTask(job: Job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 75);
            }
        }
        catch (err) {
            throw err;
        }
    }

    @Process('send-sms-after-90percent-of-task')
    async handleSendSMSOn90PercentOfTask(job: Job) {
        try {
            if (job.data.taskId && job.data.members) {
                const taskId = +job.data.taskId;
                this.tasksService.setSMSNotificationForMembersOf(taskId, job.data.members, 90);
            }
        }
        catch (err) {
            throw err;
        }
    }

    @Process('check-for-tasks-sms')
    async checkForTasksSMS(job: Job) {
        try {

            if (job.data.date) {
                const list = await this.tasksService.findAllTasksSMSNotification(job.data.date);
                list.forEach(item => {
                    new NimaadSMS().sendTaskPercentage(+item.percentage, item.mobile, +item.taskId, null);
                })
            }
        }
        catch (err) {
            throw err;
        }
    }

    @Process('check-for-old-data-on-task-condition')
    async taskConditionCheckForOldData(job: Job) {
        try {
            console.log( 'check-for-old-data-on-task-condition is running');

            const conditionId: number = job.data.conditionId;

            const condition = await this.tasksService.getTaskConditionDetail(conditionId);

            const tableName = await this.tableNameService.findOne(condition.condition.tableId);

            const cmdQuery: string = `select * from ${tableName.table_name} where ${condition.condition.condition} order by id asc`;

            const dataSource: DataSource = new DataSource(ormconfig);

            await dataSource.initialize();

            const list = await dataSource.manager.query(cmdQuery);

            if (list.length > 0) {
                const item = condition.condition;
                let membersArray = [];

                if (item.personnelMembers) {
                    membersArray = condition.condition.personnelMembers.split(',').map(Number);
                }


                const createTaskDTO: CreateTaskDTO = {
                    title: item.title,
                    description: item.description,
                    dueDate: moment().utc(true).add(item.secondsAfterCreate, 'seconds').toDate(),
                    ifTaskFailed: item.ifTaskFailed,
                    point: item.point,
                    negativePoint: item.negativePoint,
                    members: membersArray,
                    status: TaskStatus.NEW,
                    relatedTask: null,
                    taskType: TaskType.INDEPENDENT,
                    priority: item.priority != null ? item.priority : TaskPriority.NORMAL,
                    punishment: item.punishment != null ? item.punishment : TaskPunishment.NONE,
                    pageUrl: item.pageUrl,
                    approveCondition: item.approveCondition,
                    approverJobsId: item.approverJobsId != null ? item.approverJobsId.split(',').map(Number) : null,
                    approverPersonnelId: item.approverPersonnelId,
                    personnelToInform: item.personnelToInform != null ? item.personnelToInform.split(',').map(Number) : null,
                    smsNotification: item.smsNotification ? item.smsNotification.split(',') as TasksSMSNotificationType[] : null,
                    approveJobsSequence: item.approveJobsSequence,
                    referable: item.referable,
                    attachmentDescription: null,
                    fileUrl: condition.condition.file !== null ? condition.condition.file : null
                }


                for (let listItem of list) {

                    const newTask = await this.tasksService.create(createTaskDTO, condition.condition.creatorId, +job.data.conditionId, item.id);

                    if (createTaskDTO.personnelToInform) {
                        let informMembers = createTaskDTO.personnelToInform.toString().split(',').map(Number);

                        if(informMembers.length > 0) {
                            await this.tasksService.createTaskToInformPersonnel(newTask.identifiers[0].id, informMembers);
                        }

                    }
                }
            }
            await dataSource.destroy();
        }
        catch(e) {
            console.log(e);
        }
    }

    @Process('send-sms-to-task-creator')
    async sendSMSToTaskCreator(job: Job): Promise<void> {
        try {
            console.log('send-sms-to-task-creator is running');
            if(job.data.taskId && job.data.creatorId) {

                const personnel = await this.personnelService.findPersonnelById(job.data.creatorId);
                const task = await this.tasksService.taskDetail(job.data.taskId);

                if(personnel) {
                    new NimaadSMS().sendSMSToTaskCreator({
                        creatorMobile: personnel.mobile1,
                        creatorName: `${personnel.last_name}`,
                        taskId: job.data.taskId,
                        taskTitle: task.task.title
                    });
                }
            }
        }
        catch (e) {
            console.log(QueueProcessor.name, e);
        }
    }

    @Process('send-sms-after-task-done')
    async sendSMSAfterTaskDone(job: Job): Promise<void> {
        try {
            console.log('send-sms-after-task-done is running');
            if(job.data.taskId && job.data.creatorId) {

                const personnel = await this.personnelService.findPersonnelById(job.data.creatorId);
                const task = await this.tasksService.taskDetail(job.data.taskId);

                if(personnel) {
                    new NimaadSMS().sendDoneTask({
                        creatorMobile: personnel.mobile1,
                        creatorName: `${personnel.last_name}`,
                        taskId: job.data.taskId,
                        taskTitle: task.task.title
                    });
                }
            }
        }
        catch (e) {
            console.log(QueueProcessor.name, e);
        }
    }

    @Process('send-sms-after-task-approved')
    async sendSMSAfterTaskApproved(job: Job): Promise<void> {
        try {
            console.log('send-sms-after-task-approved is running');
            if(job.data.taskId && job.data.creatorId) {

                const personnel = await this.personnelService.findPersonnelById(job.data.creatorId);
                const task = await this.tasksService.taskDetail(job.data.taskId);

                if(personnel) {
                    new NimaadSMS().sendSMSAfterTaskApproved({
                        creatorMobile: personnel.mobile1,
                        creatorName: `${personnel.last_name}`,
                        taskId: job.data.taskId,
                        taskTitle: task.task.title
                    });
                }
            }
        }
        catch (e) {
            console.log(QueueProcessor.name, e);
        }
    }
}