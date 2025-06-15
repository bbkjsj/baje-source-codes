import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'job_title'})
export class JobTitle { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {nullable: true, length: 100})
    title: string | null;

    @Column('varchar', { nullable: true, length: 45})
    code: string | null;
}