import { IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { DependencyQuitReason } from 'src/common/enums/dependency-quit-status.enum';
import { DependencyStatus } from 'src/common/enums/dependency-status.enum';
import { FamilyRelation } from 'src/common/enums/family-relation.enum';

export class FamilyCreateDTO {

  @IsNotEmpty()
  @IsString()
  readonly personnelNationalId: string;

  @IsNotEmpty()
  @IsEnum(FamilyRelation)
  relation: FamilyRelation;


  @ValidateIf(dto => dto.relation === FamilyRelation.FATHER)
  @IsString()
  readonly fatherNationalId?: string;

  @ValidateIf(dto => dto.relation === FamilyRelation.MOTHER)
  @IsString()
  readonly motherNationalId?: string;

  @ValidateIf(dto => dto.relation === FamilyRelation.SPOUSE)
  @IsString()
  readonly spouseNationalId?: string;

  @ValidateIf(dto => dto.relation === FamilyRelation.BROTHER)
  @IsString()
  readonly brotherNationalId?: string;

  @ValidateIf(dto => dto.relation === FamilyRelation.SISTER)
  @IsString()
  readonly sisterNationalId?: string;

  @ValidateIf(dto => dto.relation === FamilyRelation.BROTHER || dto.relation === FamilyRelation.SISTER)
  @IsBoolean()
  @IsNotEmpty()
  readonly sameMother: boolean;

  @ValidateIf(dto => dto.relation === FamilyRelation.BROTHER || dto.relation === FamilyRelation.SISTER)
  @IsBoolean()
  @IsNotEmpty()
  readonly sameFather: boolean;

  @IsOptional()
  @IsBoolean()
  readonly syncMother: boolean
}
