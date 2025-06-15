import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePrerequisiteDTO {

  @IsNotEmpty()
  readonly accessCode: number;

  @IsOptional()
  @IsBoolean()
  readonly createPrequisiteForUsers: boolean;

  @IsNumber({}, { each: true })
  readonly prerequisiteIds: number[];
}