import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'doctor_visit'})
export class DoctorVisit { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { nullable: true })
    visit_date: Date;

    @Column('int', { nullable: true })
    doctor_id_fk: number;

    @Column('varchar', {nullable: true, length: 300})
    result: string;

    @Column('varchar', {nullable: true, length: 45})
    approved_position_code: string;

    @Column('datetime', { nullable: true })
    next_visit_date: Date;

    @Column('text', {nullable:true})
    special_description: string;

    @Column('int', {nullable:true})
    personnel_id_fk: number;
}