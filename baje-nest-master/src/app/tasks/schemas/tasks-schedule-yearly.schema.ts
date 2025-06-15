import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_schedule_yearly'})
export class TasksScheduleYearly { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true, name: 'tasks_condition_id_fk'})
    conditionId: number;

    @Column({ type: 'datetime' })
    date: Date;
}