import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class DataSyncPersonnelUpdateRequest {

  @IsNotEmpty()
  @IsString()
  readonly nationalCode: string;

  @IsOptional()
  readonly firstName: string;

  @IsOptional()
  readonly lastName: string;

  @IsOptional()
  readonly fatherName: string;

  @IsOptional()
  @IsDateString()
  readonly birthDate: Date;

  @IsOptional()
  readonly idNumber: string;

  @IsOptional()
  @IsEnum([ 'm', 'f'])
  readonly gender: string;

  @IsOptional()
  readonly fatherNationalCode: string;

  @IsOptional()
  readonly motherNationalCode: string;

  @IsOptional()
  readonly spouseNationalCode: string;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  readonly mobile: string;

  @IsOptional()
  readonly insuranceNumber: string;

  @IsOptional()
  readonly address: string;

  @IsOptional()
  readonly postalCode: string;
  constructor(args: DataSyncPersonnelUpdateRequest) {
    Object.assign(this, args);
  }
}
