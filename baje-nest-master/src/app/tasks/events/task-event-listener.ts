import { Logger } from '@nestjs/common';
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "../schemas/task.schema";

export class TasksEventListener {
    private logger: Logger = new Logger();

    constructor(
        @InjectRepository(Task) private readonly repo: Repository<Task>
    ){}


    @OnEvent('tasks.insert')
    handleTaskCreateEvent(payload: any) {
        this.logger.log('task created event raised');
    }

}