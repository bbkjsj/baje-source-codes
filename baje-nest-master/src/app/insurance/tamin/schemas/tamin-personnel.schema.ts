import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'insurance_tamin_personnel'})
export class InsuranceTaminPersonnel { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true})
    insurance_tamin_id_fk: number;

    @Column('int', { nullable: true })
    personnel_id_fk: number;

    @Column('datetime', { nullable: true })
    start_date: Date;

    @Column('datetime', { nullable: true })
    end_date: Date;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    total_work_day: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    daily_salary: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    monthly_salary: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    include_benefit: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    salary_benefit_include: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    salary_benefit_include_notinclude: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    insured_share: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    employer_share: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    jobless_share: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    hard_job_share: number;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    total_share: number;

    @Column('int', {nullable: true})
    job_id_fk: number;

    @Column('text', { nullable: true })
    description: string;
}