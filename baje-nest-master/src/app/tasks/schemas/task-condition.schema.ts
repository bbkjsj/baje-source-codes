import { TableName } from "src/app/table-name/schemas/table-name.schema";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks_condition'})
export class TaskCondition { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true, name:'table_name_id_fk'})
    tableId: number;

    @Column('text', {nullable: true, name:'_condition'})
    condition: string;

    @Column('varchar', { nullable: true, length: 500})
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('int', { nullable: true , name: 'seconds_after_create'})
    secondsAfterCreate: number;

    @Column('varchar', { nullable: true, length: 100, name:'if_task_failed'})
    ifTaskFailed: string;

    @Column('int', {nullable: true })
    point: number;

    @Column('int', {nullable: true, name: 'negative_point'})
    negativePoint: number;

    @Column('varchar', {nullable: true, length: 500, name: 'personnel_members'})
    personnelMembers : string;

    @Column('varchar', {nullable: true, length: 500, name:'jobs'})
    jobs: string;

    @Column('tinyint', { nullable: true})
    enable: number;

    @Column('varchar', {length: 255, nullable: true})
    punishment: string;

    @Column('varchar', {nullable: true, length: 255})
    priority: string;

    @Column('varchar', {nullable: true, length: 500, name:'personnel_to_inform'})
    personnelToInform: string;

    @Column('varchar', {nullable: true, name:'sms_notification'})
    smsNotification: string;

    @Column('varchar', {nullable: true, length: 500,  name:'page_url'})
    pageUrl: string;

    @Column('varchar',{nullable: true, length: 255, name:'approve_condition'})
    approveCondition: string;

    @Column('varchar', {nullable: true, name:'approver_jobs_ids', length: 255})
    approverJobsId: string;

    @Column('varchar', { nullable: true, length: 45, name:'approve_jobs_sequence'})
    approveJobsSequence: string;

    @Column('int', {nullable: true, name:'approver_personnel_id_fk'})
    approverPersonnelId: number;

    @Column('int', { nullable: true, name: 'creator_id_fk'})
    creatorId: number;
    
    @Column('tinyint', {nullable: true, name:'referable'})
    referable: number;
    
    @OneToOne(() => TableName)
    @JoinColumn([
        {
            name: 'table_name_id_fk',
            referencedColumnName:'id'
        }
    ])
    tableInfo: TableName;

    @Column({ name: 'file' })
    file: string;

}