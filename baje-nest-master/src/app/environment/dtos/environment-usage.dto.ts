import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';


export class AddEnvironmentUsageDTO {

  @IsString()
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly jobId: number;

  @IsBoolean()
  readonly isEnable: boolean;


}