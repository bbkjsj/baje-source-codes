import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'hse_checklist_question'})
export class HSEChecklistQuestion { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable: true})
    checklist_id_fk: number;

    @Column('int', {nullable: true})
    question_id_fk: number;

    @Column('int', {nullable: true}) 
    weight_factor: number;

    @Column('varchar', { nullable:true,length:100})
    critical: string;

    @Column('text',{nullable:true})
    requirements: string;

    @Column('text', {nullable: true})
    description: string;
}