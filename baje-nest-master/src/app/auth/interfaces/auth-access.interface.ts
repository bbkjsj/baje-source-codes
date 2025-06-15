export interface IAuthAccess {
  readonly id: number;
  readonly access: string;
  readonly minimumLevel: string;
  readonly code: string;
  readonly companyId: number;
  readonly environmentId: number;
  readonly accessLevel: string;
}