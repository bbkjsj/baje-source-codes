import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_sms_notification'})
export class TasksSMSNotification { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true, name: 'personnel_id_fk'})
    personnelId: number;

    @Column('int', { nullable: true, name: 'tasks_id_fk'})
    taskId: number;

    @Column('int', { nullable: true})
    percentage: number;
    
    @Column('datetime', { nullable: true})
    date: Date;
}