import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'jobs_shift'})
export class JobsShift { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable:true, length: 255 })
    title: string;
    

    @Column('int', { nullable: true })
    time_off_days: number;

    @Column('tinyint', { nullable: true})
    enabled: number;

    @Column('varchar', { nullable: true, length: 40})
    timespan: string;

    @Column('tinyint', { nullable: true })
    calculate_public_holidays: number;

    @Column('tinyint', { nullable: true })
    calculate_extra_work: number;

    @Column('tinyint', { nullable: true })
    calculate_off_work: number;

    @Column('tinyint', { nullable: true })
    public_holidays_are_off: number;

    @Column('tinyint', { nullable: true })
    calculate_night: number;

    @Column('tinyint', { nullable: true })
    calculate_friday: number;
}