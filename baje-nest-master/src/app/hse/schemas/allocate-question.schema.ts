import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'hse_allocate_question'})
export class HSEAllocateQuestion { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true})
    question_id_fk: number;

    @Column('int', { nullable: true})
    personnel_id_fk: number;

    @Column('int', { nullable: true})
    vehicle_id_fk: number;

    @Column('int', { nullable: true})
    environment_id_fk: number;

    @Column('datetime',{nullable: true })
    from_date: Date;

    @Column('datetime', {nullable:true})
    to_date: Date;

    @Column('int', {nullable:true})
    weight_factor: number;

    @Column('varchar',{nullable:true, length: 45})
    critical: string;

    @Column('text',{nullable: true})
    requirements: string;

    @Column('text', { nullable: true})
    description: string;
}