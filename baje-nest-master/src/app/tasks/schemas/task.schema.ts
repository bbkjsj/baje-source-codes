import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tasks'})
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, length: 255})
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('varchar', {nullable: true, length: 45, name: 'task_type'})
    taskType: string;

    @Column('int', {nullable: true , name: 'related_task'})
    relatedTask: number;

    @Column('datetime', { nullable: true , name: 'due_date'})
    dueDate: Date;

    @Column('varchar', { nullable: true, length: 100, name:'if_task_failed'})
    ifTaskFailed: string;

    @Column('int', {nullable: true })
    point: number;

    @Column('int', {nullable: true, name: 'negative_point'})
    negativePoint: number;

    @Column('varchar', {nullable: true})
    status: string;

    @Column('datetime', { nullable: true})
    created_at: Date;

    @Column('int', {nullable: true})
    created_by: number;

    @Column('tinyint', {nullable: true})
    approved: number;

    @Column('varchar', {nullable: true, length: 255})
    priority: string;

    @Column('varchar', {nullable: true, length: 255})
    punishment: string;

    @Column('varchar', {nullable: true, length: 500, name:'page_url'})
    pageUrl: string;

    @Column('varchar',{nullable: true, length: 255, name:'approve_condition'})
    approveCondition: string;

    @Column('varchar', {nullable: true, name:'approver_jobs_ids'})
    approverJobsId: string;

    @Column('int', {nullable: true, name:'approver_personnel_id_fk'})
    approverPersonnelId: number;

    @Column('varchar', { nullable: true, length: 45, name:'approve_jobs_sequence'})
    approveJobsSequence: string;

    @Column('int', { nullable: true, name:'task_condition_id_fk'})
    conditionId: number;

    @Column('int', { nullable: true, name:'destination_record_id'})
    destinationRecordId: number;

    @Column('tinyint', {nullable: true, name:'referable'})
    referable: number;

    @Column({ name: 'attachment_url'})
    attachmentUrl: string;

    @Column({ name: 'attachment_description' })
    attachmentDescription: string;

    @Column({ name: 'file_url' })
    fileUrl: string;
}
