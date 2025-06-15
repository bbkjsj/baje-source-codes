import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'jobs'})
export class Job {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, length: 200})
    title: string;

    @Column('varchar', { nullable: true, length: 45})
    status: number;
}
