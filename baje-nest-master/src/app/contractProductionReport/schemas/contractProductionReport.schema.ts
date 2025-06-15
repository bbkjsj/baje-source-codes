import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'contract_production_report'})
export class ContractProductionReport { 

    @PrimaryGeneratedColumn()
    id: number;


    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    stone_tonnage: number;


    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    dust_tonnage: number;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    stone_load_quantity: number;

    @Column('decimal', {nullable: true, precision: 10, scale: 0})
    dust_load_quantity: number;

    @Column('varchar', {length: 45, nullable: true})
    contract_id_fk: number;

    @Column('tinyint', { nullable: true })
    edit_by_admin: number;

    @Column('datetime', {nullable: true })
    date: Date;

    @Column('varchar', { nullable: true, length: 300})
    status: string;

    @Column('text',  { nullable: true })
    description: string;
}