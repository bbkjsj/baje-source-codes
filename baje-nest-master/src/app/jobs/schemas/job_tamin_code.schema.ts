import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'jobs_tamin_code'})
export class JobsTaminCode {  


    @PrimaryGeneratedColumn()
    id:number;

    @Column('int', { nullable: true })
    jobs_id_fk: number;

    @Column('varchar', { nullable:true, length:45 })
    code: string;
}