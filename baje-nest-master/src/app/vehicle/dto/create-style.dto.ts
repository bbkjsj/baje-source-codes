import { IsNumber, IsString } from 'class-validator';

export class CreateStyleDto {

  @IsString()
  title: string;

  @IsNumber()
  systemId: number;

  @IsNumber()
  typeId: number;
}
