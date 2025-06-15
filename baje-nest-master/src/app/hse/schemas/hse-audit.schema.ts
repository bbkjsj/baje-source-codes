import { Personnel } from "src/app/personnel/schemas/personnel.schema";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'hse_audit'})
export class HSEAudit { 

    @PrimaryGeneratedColumn()
    id: number;


    @Column('int', {nullable: true})
    personnel_id_fk: number;

    @Column('int', {nullable: true})
    vehicle_id_fk: number;

    @Column('int', {nullable: true})
    environment_id_fk: number;

    @Column('int', {nullable: true})
    troubleshooter_id_fk: number;

    @Column('datetime', {nullable: true})
    audit_date: Date;

    @Column('text', {nullable: true})
    description: string;


    @Column('int', {nullable: true})
    operator_id_fk: number;

    @Column('datetime', { nullable: true})
    date: Date;

    @Column('tinyint', { nullable: true})
    draft: number;

    @Column('int', { nullable: true})
    minimum_point: number;
}