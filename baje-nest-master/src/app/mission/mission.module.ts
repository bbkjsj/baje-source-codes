import {Module} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonnelModule } from "../personnel/personnel.module";
import { PersonnelMission } from "./schemas/mission.schema";
import { MissionService } from "./mission.service";
import { MissionController } from "./misson.controller";

@Module({
    imports: [
        PersonnelModule,
        TypeOrmModule.forFeature([
            PersonnelMission
        ])
    ],
    controllers: [MissionController],
    providers: [MissionService]
})
export class MissionModule{}