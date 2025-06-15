import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'personnel_access'})
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true, name: 'personnel_id_fk'})
    personnelId: number;

    @Column('int', {nullable: true, name: 'company_id_fk'})
    companyId: number;

    @Column('int', { nullable: true, name: 'contract_id_fk'})
    contractId: number;

    @Column({
        name: 'environment_id_fk'
    })
    environmentId: number;

    @Column('varchar', { nullable: true, length: 100})
    access: string;

    @Column({
        name: 'zone'
    })
    zone: number;

    @Column({
        name: 'is_enable'
    })
    isEnable: boolean;

    @Column({
        name: 'from_date'
    })
    fromDate: Date;

    @Column({
        name: 'to_date'
    })
    toDate: Date;
}
