import { Module } from "@nestjs/common";
import { DataSyncPersonnelService } from "./data-sync-personnel.service";
import { DataSyncPersonnelController } from "./data-sync-personnel.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Personnel } from "../../personnel/schemas/personnel.schema";
import { FamilySchema } from "../../family/schemas/family.schema";
import { DataSyncAuthorizationService } from "../shared/data-sync-authorization.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Personnel,
      FamilySchema,
    ])
  ],
  controllers: [
    DataSyncPersonnelController
  ],
  providers: [
    DataSyncPersonnelService,
    DataSyncAuthorizationService
  ]
})
export class DataSyncPersonnelModule {}