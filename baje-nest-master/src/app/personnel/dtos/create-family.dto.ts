import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, isString, IsString } from 'class-validator';

export class CreateFamilyDTO {

  @IsNotEmpty()
  @IsNumber()
  readonly personnelId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly parentId: number;

  @IsNotEmpty()
  @IsString()
  readonly relation: string;

  @IsNotEmpty()
  @IsString()
  readonly dependencyStatus: string;

  @IsOptional()
  @IsString()
  readonly dependencyQuitReason: string;

  @IsOptional()
  @IsString()
  readonly insuranceNumber: string;

  @IsOptional()
  @IsBoolean()
  readonly reverseDependency: boolean;

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;


  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  readonly fatherName: string;
}