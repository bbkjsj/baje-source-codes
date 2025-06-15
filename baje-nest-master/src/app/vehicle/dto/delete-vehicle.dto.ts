import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export class DeleteVehicleDto {

  @IsArray()
  @IsString({ each: true })
  ids: string[];
}