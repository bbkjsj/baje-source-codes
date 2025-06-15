import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEnvironmentDTO {

  @IsNotEmpty()
  title: string;

  @IsNumber()
  parentId: number;

  @IsNumber()
  companyId: number;

  @IsOptional()
  type: string;

  @IsOptional()
  code: string;

  @IsNumber()
  usage: number;

  @IsOptional()
  @IsNumber()
  langitude: number;

  @IsOptional()
  @IsNumber()
  latitude: number;

  @IsOptional()
  address: string;

  @IsOptional()
  postCode: string;


  @IsNotEmpty()
  occupiedStatus: string;

  @IsBoolean()
  independentChart: boolean;

  @IsBoolean()
  independentVehicle: boolean;

  @IsOptional()
  @IsEnum(['disable', 'enable'])
  status: string;
}