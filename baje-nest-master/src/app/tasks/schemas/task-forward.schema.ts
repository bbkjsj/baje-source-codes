import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_forward'})
export class TaskForward { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {name: 'task_id_fk', nullable: true})
    taskId: number;

    @Column('int', {name: 'personnel_id_fk', nullable: true})
    personnelId: number;

    @Column('text', { name: 'description', nullable: true})
    description: string;

    @Column({ type: 'datetime', name: 'read_on'})
    readOn: Date;
}