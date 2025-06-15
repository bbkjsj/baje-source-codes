import { IsNotEmpty, IsNumber } from 'class-validator';

export class FamilySwapDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly personnelId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly parentId: number;

}