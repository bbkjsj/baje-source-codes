import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'contract_progress'})
export class ContractProgress { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {
        nullable: true
    })
    contract_id_fk: number;

    @Column('datetime', { nullable: true})
    date: Date;


    @Column('decimal', {nullable: true, precision: 10, scale: 2})
    real_progress: number;

    @Column('decimal', {nullable: true, precision: 10, scale: 2})
    program_progress: number;

    @Column('varchar', {nullable: true, length: 100})
    status: string;

    @Column('tinyint', {nullable: true})
    edit_by_admin: number;
}