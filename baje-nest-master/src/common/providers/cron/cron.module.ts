import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksModule } from "src/app/tasks/tasks.module";
import { QueueModule } from "../queue/queue.module";
import { CronService } from "./cron.service";

@Module({
    imports:[
        ScheduleModule.forRoot(),
        TasksModule,
        QueueModule
    ],
    providers:[CronService],
    exports:[CronService]
})
export class CronModule{}