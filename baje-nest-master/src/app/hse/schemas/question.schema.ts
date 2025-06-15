import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'hse_question'})
export class HSEQuestion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, length: 100})
    group: string;

    @Column('text', {nullable: true})
    question: string;

    @Column('varchar', { nullable: true, length: 100})
    type: string;

    @Column('varchar', { nullable: true, length: 45})
    code: string;

    @Column('tinyint', {nullable: true})
    is_reverse: number;

    @Column({ name: 'vehicle_type_id_fk'})
    vehicleTypeId: number;

    @Column({ name: 'jobs_id_fk'})
    jobsId: number;
}
