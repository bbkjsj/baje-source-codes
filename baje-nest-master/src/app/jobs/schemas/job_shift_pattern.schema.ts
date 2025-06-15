import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'jobs_shift_pattern'})
export class JobsShiftPattern { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true })
    shift_id_fk: number;

    @Column('varchar', { nullable:true, length: 200 })
    status: string;

    @Column('int', { nullable: true })
    days: number;

    @Column('datetime', {nullable: true })
    from_time: Date;

    @Column('datetime', {nullable: true })
    to_time: Date;
}