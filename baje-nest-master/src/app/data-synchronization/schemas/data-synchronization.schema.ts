import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DataSynchronizationModuleNameEnum } from "../enums/data-synchronization-module-name.enum";

@Entity({ name: 'data_synchronization'})
export class DataSynchronizationSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'module_name'
  })
  moduleName: string;

  @Column({
    type: 'datetime',
    name: 'sync_date'
  })
  syncDate: Date;


  @Column({
    name: 'requested_by'
  })
  requestedBy: string;
}