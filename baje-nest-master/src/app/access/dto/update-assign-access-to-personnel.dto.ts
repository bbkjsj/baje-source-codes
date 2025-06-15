import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateAssignAccessToPersonnel {

  @IsOptional()
  @IsDateString()
  readonly endDate: Date;

}