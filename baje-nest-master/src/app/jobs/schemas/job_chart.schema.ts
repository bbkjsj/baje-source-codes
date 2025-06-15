import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'jobs_chart'})
export class JobChart {
    @PrimaryGeneratedColumn()
    id:number;

    @Column('varchar', {nullable: true, length: 200 })
    title: string;

    @Column('int', { nullable: true })
    environment_id_fk: number;

    @Column('datetime', { nullable: true })
    apply_date: Date;

    @Column('tinyint',{nullable:true})
    enable: number;

    @Column('text', { nullable: true })
    description: string;

    @Column('int',{nullable:true })
    company_id_fk: number;
}

