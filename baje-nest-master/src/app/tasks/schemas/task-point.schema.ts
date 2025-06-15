import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tasks_point '})
export class TasksPoint { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true, name: 'personnel_id_fk'})
    personnelId: number;

    @Column('int', { nullable: true, name:'task_id_fk'})
    taskId: number;

    @Column('double', { nullable: true, })
    point: number;
}