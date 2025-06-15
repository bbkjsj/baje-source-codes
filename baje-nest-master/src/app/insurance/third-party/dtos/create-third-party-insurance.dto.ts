import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateThirdPartyInsuranceDto {

  @IsString()
  machineOrganizationCode: string;

  @IsString()
  insuranceIdentification: string;

  @IsString()
  insuranceNumber: string;

  @IsString()
  vehicleId: number;

  @IsOptional()
  @IsString()
  insurerCompanyId: number;

  @IsOptional()
  @IsString()
  insurerPersonnelId: number;

  @IsDateString()
  fromDate: Date;

  @IsDateString()
  toDate: Date;

  @IsString()
  noDamageHistory: number;

  @IsString()
  insurance: number;

  @IsOptional()
  @IsString()
  maxCommitmentFinancialDamanges: number;

  @IsOptional()
  @IsString()
  maxCommitmentInjury: number;

  @IsOptional()
  @IsString()
  maxCommitmentDriver: number;

  @IsString()
  deliverToPersonnelId: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  insuranceCompanyId: number;
}