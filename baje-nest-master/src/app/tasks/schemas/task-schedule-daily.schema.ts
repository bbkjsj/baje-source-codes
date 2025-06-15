import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_schedule_daily'})
export class TasksScheduleDaily { 
    @PrimaryGeneratedColumn()
    id:number;

    @Column('int', {nullable: true, name:'tasks_condition_id_fk'})
    conditionId: number;

    @Column('int', {nullable: true})
    hour: number;

    @Column('int', {nullable: true})
    minute: number;

    @Column('datetime', { nullable: true, name:'from_date'})
    fromDate:Date|null;

    @Column('datetime', {nullable: true, name:'to_date'})
    toDate: Date|null;
}