import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'settle'})
export class Settle { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true})
    personnel_id_fk: number;

    @Column('datetime',{nullable: true})
    date: Date;

    @Column('text', { nullable: true})
    reason: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('tinyint', {nullable: true })
    approved: number;

    @Column('int',  { nullable: true})
    register_user_id_fk: number;

    @Column('varchar', {nullable: true, length: 200})
    status: string;
}