import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'insurance'})
export class Insurance { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {nullable: true, length: 200})
    type: string;

    @Column('varchar', {nullable: true, length: 300})
    insurer_main: string;

    @Column('varchar', {nullable: true, length: 300})
    insurer_company: string;

    @Column('varchar', {nullable: true, length: 45})
    contract_number: string;

    @Column('datetime', { nullable: true})
    contract_issue_date: Date;

    @Column('datetime', { nullable: true})
    contract_date_from_date: Date;

    @Column('datetime', {nullable: true})
    to_date: Date;

    @Column('decimal', {precision: 10, scale: 0, nullable: true})
    main_insured: number;

    @Column('decimal', {precision: 10, scale: 0, nullable: true})
    spouse_insured: number;

    @Column('decimal', {precision: 10, scale: 0, nullable: true})
    doughter_insured: number;

    @Column('decimal', {precision: 10, scale: 0, nullable: true})
    son_insured: number;

    @Column('decimal', {precision: 10, scale: 0, nullable: true})
    father_insured: number;

    @Column('decimal', {precision: 10, scale: 0, nullable: true})
    mother_insured: number;

    @Column('text', {nullable: true})
    description: string;

    @Column('int', {nullable: true})
    personnel_id_fk: number;

    @Column('int', { nullable: true})
    company_id_fk: number;

    @Column('tinyint', {nullable: true})
    approved: number;

    @Column('varchar', {nullable: true, length: 300})
    pdf_file_url: string;

    @Column('int', {nullable: true})
    insurer_main_company_id_fk: number;

    @Column('datetime', { nullable: true })
    change_deadline_date: Date;
}