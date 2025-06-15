import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'hse_checklist'})
export class HSEChecklist { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {nullable: true, length: 100})
    group: string;

    @Column('int', {nullable: true})
    environment_id_fk: number;

    @Column('int', {nullable: true})
    jobs_id_fk:number;

    @Column('int', {nullable: true})
    vehicle_type_id_fk: number;

    @Column('text' , {nullable: true})
    comment: string;

    @Column('tinyint', {nullable: true})
    enable: number;

    @Column('int', { nullable: true})
    code: number;

    @Column('varchar', { nullable: true, length: 45})
    type: string;

    @Column('int', { nullable: true})
    minimum_point:number;
}