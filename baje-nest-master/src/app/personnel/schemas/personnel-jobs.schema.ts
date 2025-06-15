import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'personnel_job'})
export class PersonnelJobs {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true})
    personnel_id_fk: number;

    @Column('int', { nullable: true})
    jobs_id_fk: number;

    @Column('datetime', { nullable: true})
    from_date: Date;

    @Column('datetime', { nullable: true})
    to_date: Date;

    @Column('int', {nullable:true})
    chart_id_fk: number;

    @Column('tinyint', {nullable:true})
    approved: number;
}