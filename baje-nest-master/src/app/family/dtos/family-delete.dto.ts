import { IsNotEmpty, IsNumber } from 'class-validator';

export class FamilyDeleteDTO {

  @IsNotEmpty()
  @IsNumber()
  readonly personnelId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly relativeId: number;
}