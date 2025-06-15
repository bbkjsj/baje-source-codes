import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Role } from 'src/common/enums/roles.enum';

export class CreatePermissionDto {
  @ValidateNested({ each: true })
  @Type(() => _CreatePermissionDTO)
  data: [_CreatePermissionDTO];
}

export class _CreatePermissionDTO {
  @IsEnum(Role, { each: true })
  access: Role[];

  @IsNumber()
  @IsOptional()
  companyId: number;

  @IsNumber()
  @IsOptional()
  contractId: number;
}
