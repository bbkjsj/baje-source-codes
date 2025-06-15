import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectConnection } from "@nestjs/typeorm";
import { QueueService } from "src/common/providers/queue/queue.service";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, Repository, UpdateEvent } from "typeorm";


@Injectable()
export class TaskSubscriber implements EntitySubscriberInterface {

    private logger: Logger = new Logger(TaskSubscriber.name);

    private tasksTables = [];
    constructor(@InjectConnection() readonly connection: Connection,
        private eventEmitter: EventEmitter2,
        private readonly queueService: QueueService) {
        connection.subscribers.push(this);
        this.tasksTables = [
            'tasks',
            'tasks_approver',
            'tasks_forward',
            'tasks_member',
            'tasks_notmyduty',
            'tasks_point'
        ]
    }

    async afterUpdate(event: UpdateEvent<any>): Promise<any> {

        if(this.tasksTables.indexOf(event.metadata.givenTableName) > -1) {
            this.logger.verbose('Task update subscribed');
            const data:any = { 
                tableName: event.metadata.givenTableName,
                payload: event.entity
            }
            this.eventEmitter.emit('tasks.update', data);
        }
        this.createQueue(event);
    }

    async afterInsert(event: InsertEvent<any>): Promise<any> {

        if(this.tasksTables.indexOf(event.metadata.givenTableName) > -1) {
            this.logger.verbose('Task insert subscribed.');

            const data:any = { 
                tableName: event.metadata.givenTableName,
                payload: event.entity
            }
            this.eventEmitter.emit('tasks.insert', data);
        }
        this.createQueue(event);
    }

    async afterRemove(event: RemoveEvent<any>): Promise<any> {
        if(this.tasksTables.indexOf(event.metadata.givenTableName) > -1) { 
            const data:any = { 
                tableName: event.metadata.givenTableName,
                payload: event.entity
            }
            this.eventEmitter.emit('tasks.remove', data);
        }
    }

    private createQueue = ((event: InsertEvent<any>) => {
        const body = event.entity;
        const tableName = event.metadata.givenTableName;
        const columns = [];

        event.metadata.ownColumns.forEach(column => {
            const m = {
                propertiesMap: column.entityMetadata.propertiesMap,
                propertyName: column.propertyName,
                databaseName: column.databaseName
            }
            columns.push(m);
        })

        this.queueService.createTasksConditions({
            body: body,
            tableName: tableName,
            columns: columns
        });
    })
}