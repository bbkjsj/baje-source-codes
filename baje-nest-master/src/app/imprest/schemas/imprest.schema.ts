import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'imprest'})
export class PersonnelImprest { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true})
    personnel_id_fk: number | null;

    @Column('decimal', { nullable: true, precision: 10,
        scale: 0,})
    amount: number | null;

    @Column('decimal', { nullable: true, precision: 10,
        scale: 0,})
    number_of_installment: number | null;

    @Column('text', { nullable: true})
    description: string | null;

    @Column('datetime',  { nullable: true})
    date: Date | null;

    @Column('varchar', { nullable: true, length: 100})
    project_manager_status: string | null;

    @Column('varchar', {nullable: true, length: 100})
    accountant_status: string | null;

    @Column('int', {nullable: true})
    company_id_fk: number | null;

    @Column('decimal', { nullable: true, precision: 10, scale: 0})
    paid_amount: number|null;
}