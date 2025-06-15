import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './schemas/permission.schema';
import { PersonnelModule } from '../personnel/personnel.module';
import { AccessService } from '../access/access.service';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [
    PersonnelModule,
    TypeOrmModule.forFeature([
      Permission,
    ]),
    AccessModule
  ],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
