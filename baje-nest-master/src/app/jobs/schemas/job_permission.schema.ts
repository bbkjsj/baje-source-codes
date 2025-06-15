import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'jobs_permission'})
export class JobPermission {

    @PrimaryGeneratedColumn()
    id:number;

    @Column('int', { nullable:true })
    jobs_id_fk: number;

    @Column({ name: 'access_id_fk' })
    accessId: number;

    @Column('varchar', { nullable: true, length: 200 })
    permission: string;
}