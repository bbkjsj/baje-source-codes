import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_member'})
export class TaskMember { 

    @PrimaryGeneratedColumn()
    id:number;

    @Column('int', {nullable: true, name: 'task_id_fk'})
    taskId: number;

    @Column('int', {nullable: true, name: 'personnel_id_fk'})
    userId: number;

    @Column({ type: 'datetime'})
    read_on: Date;
}