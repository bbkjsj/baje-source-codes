import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_schedule_weekly'})
export class TasksScheduleWeekly { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true, name:'tasks_condition_id_fk'})
    conditionId: number;

    @Column('varchar', {nullable: true, length: 45, name:'day_name'})
    dayName: string;

    @Column('int', {nullable: true})
    hour: number;

    @Column('int', { nullable: true})
    minute: number;

    @Column('datetime', { nullable: true, name:'from_date'})
    fromDate:Date|null;

    @Column('datetime', {nullable: true, name:'to_date'})
    toDate: Date|null;
}