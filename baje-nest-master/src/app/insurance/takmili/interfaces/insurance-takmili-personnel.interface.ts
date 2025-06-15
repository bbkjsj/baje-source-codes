export interface IInsuranceTakmiliPersonnel {
  readonly id: number;
  readonly insuranceId: number;
  readonly mainPersonnelId: number;
  readonly mainPersonnelFirstName: string;
  readonly mainPersonnelLastName: string;
  readonly mainPersonnelNationalNumber: string;
  readonly personnelId: number;
  readonly personnelFirstName: string;
  readonly personnelLastName: string;
  readonly personnelNationalNumber: string;
  readonly fromDate: Date;
  readonly toDate: Date;
  readonly relation: string;
  readonly isApproved: boolean;
}