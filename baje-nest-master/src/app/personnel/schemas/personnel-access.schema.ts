import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "personnel_access", schema: "bjdb"})
export class PersonnelAccess {

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id:number;

    @Column("int", { nullable: true , name: 'personnel_id_fk'})
    personnel_id_fk: number | null;

    @Column("varchar", { name:'access', nullable: true, length: 100})
    access: string | null;

    @Column("int", { nullable: true })
    company_id_fk: number | null;

    @Column("int", { nullable: true})
    contract_id_fk: number|null;
}