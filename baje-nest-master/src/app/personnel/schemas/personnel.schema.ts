import { PersonnelStatus } from 'src/common/enums/personnel-status.enum';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'personnel'} )
export class Personnel {

    @PrimaryGeneratedColumn()
    id:number;

    @Column('varchar', { nullable: true, length: 45})
    birth_date: string;

    @Column('varchar', { nullable: true, length: 10})
    national_number: string;

    @Column('varchar', { nullable: true, length: 100})
    first_name: string;

    @Column('varchar', { nullable: true, length: 100})
    last_name: string;

    @Column('varchar', { nullable: true, length: 100})
    father_name: string;

    @Column('varchar', { nullable: true, length: 45})
    id_number: string;

    @Column('varchar', { nullable: true, length: 1})
    sex: string;

    @Column('varchar', { nullable: true, length: 100})
    birth_place: string;

    @Column('varchar', { nullable: true, length: 100})
    id_issue_place: string;

    @Column('varchar', { nullable: true, length: 100})
    nation: string;

    @Column('text', { nullable: true})
    public_description: string;

    @Column('text', { nullable: true})
    private_description: string;

    @Column('varchar', { nullable: true, length: 200})
    password: string;

    @Column('varchar', { nullable: true, length: 300})
    image_url: string;

    @Column('varchar', { nullable: true, length: 45})
    marital_status: string;

    @Column('varchar', { nullable: true, length: 45})
    army_service: string;

    @Column('varchar', { nullable: true, length: 100})
    education: string;

    @Column('varchar', { nullable: true, length: 200})
    job_title: string;

    @Column('varchar', { nullable: true, length: 100})
    insurance_number: string;

    @Column('varchar', { nullable: true, length: 45})
    personnel_id: string;

    @Column('varchar', { nullable: true, length: 45})
    job_type: string;

    @Column('varchar', { nullable: true, length: 45})
    job_status: string;

    @Column('datetime', {nullable: true})
    job_disable_date: Date;

    @Column('text', { nullable: true })
    job_disable_description: string;

    @Column('varchar', { nullable: true, length: 11})
    mobile1: string;

    @Column('varchar', { nullable: true, length: 11})
    mobile2: string;

    @Column('varchar', { nullable: true, length: 100})
    phone: string;

    @Column('varchar', { nullable: true, length: 200})
    email: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_account1: string;

    @Column('varchar', { nullable: true, length: 45})
    sheba1: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_name1: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_account2: string;

    @Column('varchar', { nullable: true, length: 45})
    sheba2: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_name2: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_account3: string;

    @Column('varchar', { nullable: true, length: 45})
    sheba3: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_name3: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_account4: string;

    @Column('varchar', { nullable: true, length: 45})
    sheba4: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_name4: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_account5: string;

    @Column('varchar', { nullable: true, length: 45})
    sheba5: string;

    @Column('varchar', { nullable: true, length: 45})
    bank_name5: string;

    @Column('varchar', { nullable: true, length: 200})
    national_card_front_url: string;

    @Column('varchar', { nullable: true, length: 200})
    national_card_rear_url: string;

    @Column('varchar', { nullable: true, length: 200})
    birth_certificate_url: string;

    @Column('varchar', { nullable: true, length: 200})
    army_service_card_url: string;

    @Column('int', { nullable: true })
    company_id_fk: number;

    @Column('tinyint',{ nullable: true})
    data_approved: number;

    @Column('text', {nullable:true})
    address: string;

    @Column('varchar', { nullable: true, length: 200})
    sign_url: string;

    @Column('varchar', { nullable: true, length: 200})
    study_field: string;

    @Column('tinyint',{nullable: true})
    is_super_user: number;

    @Column('varchar', { nullable: true, length: 45})
    postal_code: string;

    @Column('int', {nullable: true})
    contract_id_fk: number;

    @Column('varchar', { nullable: true, length: 100})
    code: string;

    @Column('varchar', { nullable: true, length: 200})
    isargar: string;

    @Column('varchar', { nullable: true, length: 200})
    shahid_name: string;

    @Column('decimal', {nullable:true, precision: 10, scale:0})
    veteran_percentage: number;

    @Column('int', {nullable: true})
    frontline_year: number;

    @Column('int', {nullable: true})
    frontline_month: number;

    @Column('int', {nullable: true})
    frontline_day: number;

    @Column('tinyint', {nullable: true})
    shahid_was_colleague: number;

    @Column('int', {nullable:true})
    captivity_year: number;

    @Column('int', {nullable:true})
    captivity_month: number;

    @Column('int',{nullable: true})
    captivity_day: number;

    @Column('int', {nullable:true})
    history_total_day: number;

    @Column('double',{nullable:true})
    insurance_share_employee: number;

    @Column('double',{nullable:true})
    insurance_share_employer: number;

    @Column('double',{nullable:true})
    insurance_share_unemployment: number;

    @Column('double',{nullable:true})
    insurance_share_harmful: number;

    @Column('datetime',{nullable:true})
    employeement_date: Date;

    @Column('varchar', { nullable: true, length: 45})
    employeement_type: string;

    @Column('varchar', { nullable: true, length: 100})
    user_type: string;

    @Column('datetime', {nullable: true})
    contract_start_date: Date | null;

    @Column('datetime', { nullable: true})
    contract_end_date: Date | null;

    @Column('varchar', {nullable: true, length: 300})
    latest_educational_document_url: string;

    @Column('int', { nullable: true, name:'default_company_id_fk'})
    defaultCompanyId: number;

    @Column('varchar', {nullable:true, length: 300, name: 'default_home_page'})
    defaultHomePage: string;

    @Column()
    status: string;

    @Column({
        type: 'datetime',
        name: 'updated_on'
    })
    updatedOn: Date;

    @Column({
        name: 'sync_by'
    })
    syncBy: string;
}