
export interface IPersonnelAccess {
  readonly id: number;
  readonly access: string;
  readonly accessId: number;
  readonly accessCode: string;
  readonly operatorId: number;
  readonly operatorFullName: string;
  readonly operatorNationalNumber: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly accessLevel: string;
  readonly companyId: number;
  readonly companyName: string;
  readonly environmentId: number;
  readonly environmentName: string;
  readonly personnelFirstName: string;
  readonly personnelLastName: string;
  readonly personnelNationalNumber: string;
}