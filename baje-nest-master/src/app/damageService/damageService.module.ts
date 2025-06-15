import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonnelModule } from "../personnel/personnel.module";
import { DamageServiceController } from "./damageService.controller";
import { DamageService } from "./schemas/damageService.schema";
import { DamageServiceService } from "./damageService.service";
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        PersonnelModule,
        TypeOrmModule.forFeature([
            DamageService
        ])
    ],
    controllers: [DamageServiceController],
    providers: [DamageServiceService],
    exports: [DamageServiceService]
})
export class DamageServiceModule{}