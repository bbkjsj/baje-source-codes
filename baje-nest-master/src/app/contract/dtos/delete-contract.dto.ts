import { IsArray, IsNumber } from 'class-validator';

export class DeleteContractDto {

  @IsNumber({} , { each: true })
  ids: number[];
}