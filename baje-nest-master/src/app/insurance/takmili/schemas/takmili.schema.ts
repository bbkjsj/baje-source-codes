import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'insurance_takmili_personnel'})
export class InsuranceTakmiliPersonnelSchema {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true})
    personnel_id_fk: number|null;

    @Column('datetime', { nullable: true})
    start_date: Date|null;

    @Column('datetime', { nullable: true})
    end_date: Date | null;

    @Column('text', { nullable: true})
    description: string | null;

    @Column('int', { nullable: true})
    insurance_id_fk: number | null;

    @Column('int', { nullable: true})
    main_insurer_personnel_id_fk: number | null;

    @Column('tinyint', {nullable: true})
    is_approved: number | null;

    @Column('tinyint', {nullable: true})
    is_deleted: number|null;
}