import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'personnel_subordinate'})
export class Subordinate { 

    @PrimaryGeneratedColumn({type: "int"})
    id: number;

    @Column('int')
    personnel_id_fk: number;

    @Column('varchar', { name: 'first_name', nullable: true, length: 100})
    first_name: string|null;

    @Column("varchar", { name: "last_name", nullable: true, length: 100 })
    last_name: string | null;

    @Column("varchar", { name: "relation", nullable: true, length: 45 })
    relation: string | null;

    @Column("varchar", { name: "national_code", nullable: true, length: 10 })
    national_code: string | null;

    @Column("varchar", {
        name: "sponsorship_status",
        nullable: true,
        length: 100,
      })
    sponsorship_status: string | null;

    @Column("text", { name: "sponsor_description", nullable: true })
    sponsor_description: string | null;

    @Column("datetime", { name: "sponsor_date", nullable: true })
    sponsor_date: Date | null;

    @Column("varchar", { name: "father_name", nullable: true, length: 100 })
    father_name: string | null;

    @Column("varchar", { name: "id_number", nullable: true, length: 45 })
    id_number: string | null;

    @Column("datetime", { name: "birth_date", nullable: true })
    birth_date: Date | null;

    @Column("varchar", { name: "issue_place", nullable: true, length: 200 })
    issue_place: string | null;

    @Column("varchar", { name: "insurance_number", nullable: true, length: 45 })
    insurance_number: string | null;

    @Column("text", { name: "exit_sponsor_reason", nullable: true })
    exit_sponsor_reason: string | null;

    @Column("datetime", { name: "exit_sponsor_date", nullable: true })
    exit_sponsor_date:Date | null;
}