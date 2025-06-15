import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'personnel_mission'})
export class PersonnelMission { 
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true})
    personnel_id_fk: number | null;

    @Column('varchar', {nullable: true, length: 200})
    type: string | null;

    @Column('varchar', {nullable: true, length: 400})
    location: string|null;

    @Column('varchar', {nullable: true, length: 500})
    subject: string|null;

    @Column('datetime', {nullable: true})
    from_date: Date|null;

    @Column('datetime', {nullable: true})
    to_date: Date | null;

    @Column('varchar', { nullable: true, length: 300})
    residency: string | null;

    @Column('varchar', { nullable: true, length: 400})
    vehicle: string|null;

    @Column('text', { nullable: true})
    description: string|null;

    @Column('varchar', {nullable: true, length: 200})
    status: string|null;
}