import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateNationalCodeDTO {

  @IsNotEmpty()
  @IsString()
  nationalCode: string;

}