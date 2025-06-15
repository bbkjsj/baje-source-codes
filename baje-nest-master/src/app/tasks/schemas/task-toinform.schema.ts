import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_toinform'})
export class TasksToInform { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true, name: 'tasks_id_fk'})
    taskId: number;

    @Column('int', {nullable: true, name: 'personnel_id_fk'})
    personnelId: number;

    @Column({ type: 'datetime', name: 'read_on'})
    readOn: Date;
}