import { IAuthAccess } from './auth-access.interface';
import { IAuthCompany } from './auth-company.interface';
import { IAuthContract } from './auth-contract.interface';

export interface IAuthWhoAmI {
  readonly personnelId: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly nationalCode: string;
  readonly isDoctor: boolean;
  readonly isSuper: boolean;
  readonly imageUrl: string;
  readonly gender: string;

  readonly company: IAuthCompany[];
  readonly access: IAuthAccess[];
  readonly contract: IAuthContract;
  readonly surveyAccess: string[];
}