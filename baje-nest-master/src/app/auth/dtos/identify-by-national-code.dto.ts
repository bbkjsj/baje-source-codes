import { IsString } from 'class-validator';

export class IdentifyByNationalCodeRequest {
  @IsString()
  readonly nationalNumber: string;
}