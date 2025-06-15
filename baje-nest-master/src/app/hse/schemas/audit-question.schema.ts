import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'hse_audit_question'})
export class HSEAuditQuestion { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true})
    audit_id_fk: number;

    @Column('text', { nullable: true})
    question: string;

    @Column('int', { nullable: true })
    question_id_fk: number;

    @Column('text', { nullable: true })
    answer: string;

    @Column('varchar', { nullable: true, length: 100})
    critical: string;

    @Column('int', { nullable: true })
    weight_factor: number;

    @Column('text', { nullable: true })
    requirements: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('varchar', { nullable: true, length: 100})
    group: string;

    @Column('varchar', { nullable: true, length: 100})
    type: string;

    @Column('varchar', { nullable: true, length: 45})
    code: string;
    
    @Column('tinyint', { nullable: true})
    is_not_related: number;

    @Column('text', { nullable: true })
    operator_description: string;

    @Column('tinyint', { nullable: true })
    is_reverse: number;
}