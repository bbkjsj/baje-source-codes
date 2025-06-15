import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class AssignAccessToPersonnelRequest {

  @IsNumber()
  readonly personnelId: number;

  @IsNumber({}, { each: true })
  @IsArray()
  readonly accessIds: number[];

  @IsDateString()
  @IsOptional()
  readonly startDate: string;

  @ValidateIf(object => object.startDate != null)
  @IsDateString()
  @IsNotEmpty()
  readonly endDate: string;

  @IsEnum(['environment', 'baje', 'company'])
  readonly accessLevel: string;

  @ValidateIf(object => object.accessLevel === 'company')
  @IsNumber()
  readonly companyId: number;

  @ValidateIf(object => object.accessLevel === 'environment')
  @IsNumber()
  readonly environmentId: number;
}