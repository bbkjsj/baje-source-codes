import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'contract' })
export class Contract {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'type'
    })
    type: string;

    @Column({
        name: 'number'
    })
    contractNumber: string;

    @Column({
        type: 'datetime',
        name: 'date'
    })
    contractDate: Date;

    @Column({
        name: 'employer'
    })
    employer: string;

    @Column({
        name: 'contractor'
    })
    contractor: string;

    @Column({
        name: 'subject'
    })
    subject: string;

    @Column({
        type: 'datetime',
        name: 'start_date'
    })
    startDate: Date;

    @Column({
        name: 'end_date',
        type: 'datetime'
    })
    endDate: Date;

    @Column({
        type: 'decimal',
        name: 'initial_amount'
    })
    initialAmount: number;

    @Column({
        name: 'workshop_code'
    })
    workshopCode: string;

    @Column()
    row: string;

    @Column({
        type: 'int',
        name: 'consultant_company_id_fk'
    })
    consultantCompanyId: number;

    @Column('int', { nullable: true, name: 'manager_id' })
    managerId: number;

    @Column('varchar', { nullable: true, length: 45 })
    code: string;

    @Column('int', { nullable: true, name: 'employer_id' })
    employerId: number;

    @Column('varchar', { nullable: true, length: 45, name: 'boss_id' })
    bossId: number;

    @Column('varchar', { nullable: true, length: 45, name: 'contractor_type' })
    contractorType: string;

    @Column('int', { nullable: true, name: 'contractor_id' })
    contractorId: number;

    @Column('tinyint', { nullable: true })
    deleted: number;

    @Column('int', { nullable: true, name: 'main_contract_id_fk' })
    mainContractId: number;

    @Column('tinyint', { nullable: true, name: 'can_delete' })
    canDelete: number;

    @Column('tinyint', { nullable: true, name: 'edit_by_admin' })
    editByAdmin: number;

    @Column('varchar', { nullable: true, length: 100 })
    activity: string;

    @Column({
        type: 'varchar',
        name: 'contract_type'
    })
    contractType: string;

    @Column({
        name: 'environment_id_fk',
        type: 'int'
    })
    environmentId: number;

    @Column({
        name: 'price_list_year'
    })
    priceListYear: number;

    @Column({
        type: 'bigint',
        name: 'adjustment_base_index'
    })
    adjustmentBaseIndex: number;

    @Column({
        type: 'varchar',
        name: 'pricelist_parts'
    })
    priceListParts: string;

    @Column({
        type: 'bigint',
        name: 'time_weight'
    })
    timeWeight: number;

    @Column({
        type: 'bigint',
        name: 'rial_weight'
    })
    rialWeight: number;

    @Column({
        type: 'datetime',
        name: 'defects_fixed_on'
    })
    defectsFixedOn: Date;

    @Column({
        type: 'datetime',
        name: 'temporary_delivered_on'
    })
    temporaryDeliveredOn: Date;

    @Column({
        type: 'datetime',
        name: 'definitive_statement_on'
    })
    definitiveStatementOn: Date;

    @Column({
        type: 'datetime',
        name: 'definitive_adjustment_on'
    })
    definitiveAdjustmentOn: Date;

    @Column({
        type: 'datetime',
        name: 'definitive_delivery_on'
    })
    definitiveDeliveryOn: Date;

    @Column({
        type: 'datetime',
        name: 'account_settled_on'
    })
    accountSettledOn: Date;

    @Column({
        type: 'datetime',
        name: 'warranty_released_on'
    })
    warrantyReleasedOn: Date;

    @Column({
        type: 'datetime',
        name: 'checkout_on'
    })
    checkoutOn: Date;
}