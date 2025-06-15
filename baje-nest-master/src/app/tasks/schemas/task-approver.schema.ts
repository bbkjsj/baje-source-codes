import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_approver'})
export class TaskApprover { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {name:'personnel_id_fk', nullable: true})
    personnelId: number

    @Column('int', { nullable: true, name: 'task_id_fk'})
    taskId: number

    @Column('tinyint', { nullable: true})
    approved: number;

    @Column({ name: 'read_on', type: 'datetime' })
    readOn: Date;
}