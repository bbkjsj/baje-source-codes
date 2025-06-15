import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'contract_peyman_report'})
export class ContractPeymanReport { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable:true})
    contract_id_fk: number;

    @Column('tinyint', { nullable: true})
    edit_by_admin: number;

    @Column('datetime', { nullable: true})
    date: Date;

    @Column('varchar', { nullable: true, length: 200})
    status: string;

    @Column('int', { nullable:true })
    disabled_car_no_tier_quantity: number;

    @Column('int', { nullable: true })
    disabled_car_no_part_quantity: number;

    @Column('int', {nullable:true})
    active_car_quantity: number;

    @Column('decimal', {nullable:true, precision: 10, scale: 0})
    ready_to_work_factor: number;

    @Column('text', {nullable: true })
    description: string;

    @Column('int', { nullable: true })
    ready_to_work_car_quantity: number;
}