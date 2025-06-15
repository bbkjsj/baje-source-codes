import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'personnel_timeoff'})
export class TimeOff { 

    @PrimaryGeneratedColumn({ type: 'int'})
    id: number;

    @Column("varchar", { name: "type", nullable: true, length: 200 })
    type: string | null;

    @Column("varchar", { name: "request_type", nullable: true, length: 200 })
    request_type: string | null;

    @Column("datetime", { name: "from_date", nullable: true })
    from_date: Date | null;

    @Column("datetime", { name: "to_date", nullable: true })
    to_date: Date | null;

    @Column("text", { name: "description", nullable: true })
    description: string | null;

    @Column("varchar", { name: "status", nullable: true, length: 200 })
    status: string | null;

    @Column("int", { name: "personnel_id_fk", nullable: true })
    personnel_id_fk: number | null;

    @Column("varchar", { name: "file_url", nullable: true, length: 300 })
    file_url: string | null;

    @Column('int', {nullable: true})
    operator_id_fk: number | null;
}