import { CompanyBoardMemberRole } from "src/common/enums/company-board-member.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'company_board_member'})
export class CompanyBoardMember { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {nullable:true})
    company_id_fk: number;

    @Column('int', {nullable:true})
    personnel_id_fk: number;

    @Column('varchar', {nullable:true, length: 45})
    role: CompanyBoardMemberRole;

    @Column('varchar', {nullable:true, length: 200})
    signature_rights: String;

    @Column('datetime', {nullable: true})
    from_date: Date;

    @Column('datetime', {nullable: true})
    to_date: Date;

    @Column('text', {nullable: true})
    description: string;

    @Column('tinyint', {nullable: true})
    enabled: number;
}