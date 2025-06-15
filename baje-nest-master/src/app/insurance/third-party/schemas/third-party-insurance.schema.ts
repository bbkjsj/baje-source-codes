import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'insurance_third_party'
})
export class ThirdPartyInsurance {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'machine_organization_code',
    type: 'varchar'
  })
  machineOrganizationCode: string;

  @Column({
    name: 'insurance_identification'
  })
  insuranceIdentification: string;

  @Column({
    name: 'insurance_number'
  })
  insuranceNumber: string;

  @Column({
    name: 'vehicle_id_fk'
  })
  vehicleId: number;

  @Column({
    name: 'insurer_personnel_id_fk'
  })
  insurerPersonnelId: number;

  @Column({
    name: 'insurer_company_id_fk'
  })
  insurerCompanyId: number;

  @Column({
    name: 'from_date'
  })
  fromDate: Date;

  @Column({
    name: 'to_date'
  })
  toDate: Date;

  @Column({
    name: 'no_damage_history'
  })
  noDamageHistory: number;

  @Column({
    name: 'insurance'
  })
  insurance: number;

  @Column({
    name: 'max_commitment_financial_damages'
  })
  maxCommitmentFinancialDamanges: number;

  @Column({
    name: 'max_commitment_injury'
  })
  maxCommitmentInjury: number;

  @Column({
    name: 'max_commitment_driver'
  })
  maxCommitmentDriver: number;

  @Column({
    name: 'deliver_to_personnel_id_fk'
  })
  deliverToPersonnelId: number;

  @Column({
    name: 'file'
  })
  file: string;

  @Column({
    name: 'description'
  })
  description: string;

  @Column({
    name: 'insurance_company_id_fk'
  })
  insuranceCompanyId: number;

  @Column({
    name: 'status'
  })
  status: string;
}