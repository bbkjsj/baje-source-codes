import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tasks_notmyduty'})
export class TasksNotMyDuty { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true, name:'task_id_fk'})
    taskId: number;

    @Column('int', {nullable: true, name:'personnel_id_fk'})
    personnelId: number;

    @Column('text', {nullable: true})
    description:  string;
    
    @Column('datetime', { nullable: true})
    date: Date;

    @Column('tinyint', {nullable: true})
    approved: number;

    @Column({ name: 'read_on', type: 'datetime'})
    readOn: Date;
}
