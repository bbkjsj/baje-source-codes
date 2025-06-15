import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class QueueService {

    constructor(@InjectQueue('mainQueue') private readonly mainQueue: Queue) {}

    createTasksConditions(data: any) {
        this.mainQueue.add('task-condition', data);
    }

    smsSendAfterTaskCreated(data: any) {
        this.mainQueue.add('send-sms-after-task-created', data);
    }

    smsSendOn25Percent(data: any) {
        this.mainQueue.add('send-sms-after-25percent-of-task', data);
    }

    smsSendOn50Percent(data: any) {
        this.mainQueue.add('send-sms-after-50percent-of-task', data);
    }

    smsSendOn75Percent(data: any) {
        this.mainQueue.add('send-sms-after-75percent-of-task', data);
    }

    smsSendOn90Percent(data:any) {
        this.mainQueue.add('send-sms-after-90percent-of-task', data);
    }

    checkForTasksSMS(data: any) {
        this.mainQueue.add('check-for-tasks-sms', data);
    }

    taskConditionForOldData(data: any) {
        this.mainQueue.add('check-for-old-data-on-task-condition', data);
    }

    sendSMSToTaskCreator(data: any) {
        this.mainQueue.add('send-sms-to-task-creator', data);
    }

    async sendSMSAfterTaskApproved(data: any) {
        await this.mainQueue.add('send-sms-after-task-approved', data);
    }

    async sendSMSAfterTaskDone(data: any) {
        await this.mainQueue.add('send-sms-after-task-done', data);
    }
}