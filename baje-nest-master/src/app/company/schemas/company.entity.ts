import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'company' })
export class CompanySchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'register_number' })
  registerNumber: string;

  @Column({ name: 'register_date' })
  registerDate: Date;

  @Column({ name: 'national_id' })
  nationalId: string;

  @Column({ name: 'finance_code' })
  financeCode: string;

  @Column({ name: 'manager_id_fk' })
  managerId: number;

  @Column({ name: 'logo_url' })
  logoUrl: string;


  @Column({
    name: 'seal_url'
  })
  sealUrl: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ name: 'postal_code' })
  postalCode: string;

  @Column({ name: 'email' })
  email: string;

  @Column()
  description: string;

  @Column()
  approved: boolean;

  @Column({ name: 'approve_date' })
  approvedDate: Date;

  @Column({ name: 'approve_user_id' })
  approveUserId: number;

  @Column()
  deleted: boolean;

  @Column({ name: 'is_group' })
  isGroup: boolean;

  @Column({ name: 'type'})
  type: string;
}
