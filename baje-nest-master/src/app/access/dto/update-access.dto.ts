import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccessDTO {

  @IsOptional()
  @IsBoolean()
  readonly enable: boolean;
}