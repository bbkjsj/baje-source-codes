import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { PersonnelModule } from "src/app/personnel/personnel.module";
import { TableNameModule } from "src/app/table-name/table-name.module";
import { TasksModule } from "src/app/tasks/tasks.module";
import { QueueProcessor } from "./queue.processor";
import { QueueService } from "./queue.service";

@Module({
    imports:[
        BullModule.registerQueue({
            name: 'mainQueue'
        }),
        TableNameModule,
        forwardRef(() => TasksModule),
        PersonnelModule
    ],
    providers: [QueueService, QueueProcessor],
    exports: [QueueService]
})
export class QueueModule{}