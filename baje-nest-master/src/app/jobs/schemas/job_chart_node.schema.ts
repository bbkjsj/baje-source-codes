import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'jobs_chart_node'})
export class JobChartNode {  

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true })
    chart_id_fk: number;

    @Column('int', { nullable: true })
    count: number;

    @Column('int', { nullable: true })
    jobs_tamin_code_id_fk: number;

    @Column('varchar', { nullable: true, length: 200})
    title: string;

    @Column('int' , {nullable: true })
    parent_id_fk: number;
}