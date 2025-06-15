import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "damage_service"})
export class DamageService { 

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("int", { name: "personnel_id_fk" })
    personnel_id_fk: number;

    @Column("varchar", { name: "type", nullable: true, length: 45 })
    type: string | null;

    @Column("datetime", { name: "date", nullable: true })
    date: Date | null;

    @Column("text", { name: "description", nullable: true })
    description: string | null;

    @Column("varchar", {
        name: "type_service_damage",
        nullable: true,
        length: 300,
      })
    type_service_damage: string | null;

    @Column("varchar", {
        name: "type_reward_penalty",
        nullable: true,
        length: 300,
      })
    type_reward_penalty: string | null;

    @Column("varchar", {
        name: "amount_reward_penalty",
        nullable: true,
        length: 500,
      })
    amount_reward_penalty: string | null;

    @Column("tinyint", { name: "hr_approved", nullable: true })
    hr_approved: number | null;

    @Column("tinyint", { name: "project_admin_approved", nullable: true })
    project_admin_approved: number | null;

    @Column("tinyint", { name: "manager_approved", nullable: true })
    manager_approved: number | null;
}