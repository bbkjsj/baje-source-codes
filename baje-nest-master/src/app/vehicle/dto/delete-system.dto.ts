import { IsString } from 'class-validator';

export class DeleteSystemDto {

  @IsString({ each: true })
  ids: string[];
}