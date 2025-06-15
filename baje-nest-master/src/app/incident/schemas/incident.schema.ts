import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'incident_personnel'})
export class PersonnelIncident { 

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column('int', {nullable: true})
    personnel_id_fk: number | null;

    @Column('text', { nullable: true})
    injury: string | null;

    @Column('text', { nullable: true})
    injury_type: string | null;

    @Column('varchar', {length: 200, nullable: true})
    relation: string | null;

    @Column('int', {nullable: true})
    incident_id_fk: number | null;

    @Column('text', { nullable: true})
    injury_other: string | null;

    @Column('text', { nullable: true})
    injury_type_other: string | null;
}