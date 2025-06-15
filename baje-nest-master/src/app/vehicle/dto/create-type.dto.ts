import { IsNumber, IsString } from 'class-validator';

export class CreateTypeDto {
  @IsString()
  title: string;

  @IsString()
  code: string;

  @IsNumber()
  pelak: number;
}