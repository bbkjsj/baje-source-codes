import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSystemDto {

  @IsString()
  title: string;

  @IsOptional()
  enTitle: string;

}
