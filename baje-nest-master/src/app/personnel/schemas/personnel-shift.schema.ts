import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'personnel_shift'})
export class PersonnelShift {  

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true})
    jobs_shift_id_fk: number;

    @Column('int', { nullable: true })
    personnel_id_fk: number;

    @Column('datetime', { nullable:true})
    start_date: Date;

    @Column('datetime', { nullable:true})
    end_date: Date;
}