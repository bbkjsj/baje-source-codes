import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {

  @IsString()
  readonly status: string;

  @IsString()
  readonly typeId: string;

  @IsString()
  readonly systemId: string;

  @IsString()
  readonly styleId: string;

  @IsString()
  readonly engineNumber: string;

  @IsString()
  readonly chassisNumber: string;

  @IsString()
  readonly madeYear: string;

  @IsString()
  readonly environmentId: string;

  @IsString()
  @IsOptional()
  readonly organizationCode: string;

  @IsString()
  @IsOptional()
  readonly plaque1: string;

  @IsString()
  @IsOptional()
  readonly plaque2: string;


  @IsString()
  @IsOptional()
  readonly plaque3: string;


  @IsString()
  @IsOptional()
  readonly plaque4: string;

  @IsString()
  @IsOptional()
  readonly vinNumber: string;

  @IsString()
  @IsOptional()
  readonly serialNumber: string;

  @IsString()
  @IsOptional()
  readonly color: string;

  @IsString()
  @IsOptional()
  readonly gearBox: string;

  @IsString()
  @IsOptional()
  readonly price: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly ownerId: string;

  @IsString()
  @IsOptional()
  readonly ownerType: string;

  @IsNotEmpty()
  @IsString()
  readonly companyId: string;

  @IsString()
  readonly dateType: string;
}
