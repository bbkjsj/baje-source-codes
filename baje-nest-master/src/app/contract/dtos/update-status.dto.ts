import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsOptional } from 'class-validator';
import { CreateContractDTO } from './create.dto';

export class ContractUpdateStatusDTO extends PartialType(CreateContractDTO) {

  @IsOptional()
  @IsDateString()
  defectsFixedOn: string;

  @IsOptional()
  @IsDateString()
  temporaryDeliveredOn: Date;

  @IsOptional()
  @IsDateString()
  definitiveStatementOn: Date;

  @IsOptional()
  @IsDateString()
  definitiveAdjustmentOn: Date;

  @IsOptional()
  @IsDateString()
  definitiveDeliveryOn: Date;

  @IsOptional()
  @IsDateString()
  accountSettledOn: Date;

  @IsOptional()
  @IsDateString()
  warrantyReleasedOn: Date;

  @IsOptional()
  @IsDateString()
  checkoutOn: Date;
}