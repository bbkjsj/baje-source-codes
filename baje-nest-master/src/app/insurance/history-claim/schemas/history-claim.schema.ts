import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'insurance_history_claim'})
export class InsuranceHistoryClaim { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int',{nullable: true})
    personnel_id_fk: number|null;

    @Column('varchar',{nullable: true, length: 45})
    workshop_code: string|null;

    @Column('varchar', { nullable: true, length: 45})
    row: string|null;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    year: number|null;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    month: number|null;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    number_of_days: number|null;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    salary_bonus: number|null;

    @Column('varchar', { nullable: true, length: 200})
    status: string|null;

    @Column('varchar', { nullable: true, length: 200})
    register_number: string|null;

    @Column('datetime', { nullable: true})
    register_date: Date|null;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    debt: number|null;

    @Column('int', { nullable: true})
    contract_id_fk: number|null;
}