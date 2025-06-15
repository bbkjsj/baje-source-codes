import { Module, Provider } from "@nestjs/common";
import { DataSynchronizationController } from "./data-synchronization.controller";
import { DataSynchronizationService } from "./data-synchronization.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSynchronizationSchema } from "./schemas/data-synchronization.schema";
import { DataSyncPersonnelModule } from "./personnel/data-sync-personnel.module";
import { Personnel } from "../personnel/schemas/personnel.schema";
import { DataSyncAuthorizationService } from "./shared/data-sync-authorization.service";

const providers: Provider[] = [
  DataSynchronizationService,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataSynchronizationSchema,
    ]),
    DataSyncPersonnelModule,
  ],
  controllers: [
    DataSynchronizationController
  ],
  providers: [
    ...providers
  ],
  exports: [
    ...providers
  ]
})
export class DataSynchronizationModule {}