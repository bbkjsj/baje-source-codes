import { IsArray, IsNumber } from 'class-validator';

export class DeleteAssignAccessToPersonnel {

  @IsNumber()
  readonly personnelId: number;

  @IsNumber()
  readonly accessId: number;
}