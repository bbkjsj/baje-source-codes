import { IsNotEmpty, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class ValidatePersonnelRequest {

  @MinLength(10)
  @MaxLength(10)
  @IsString()
  @IsNotEmpty()
  readonly nationalCode: string;


  constructor(args: ValidatePersonnelRequest) {
    Object.assign(this, args);
  }
}