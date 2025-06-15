import { PartialType } from '@nestjs/mapped-types';
import { CreateThirdPartyInsuranceDto } from './create-third-party-insurance.dto';

export class UpdateThirdPartyInsuranceDto extends PartialType(CreateThirdPartyInsuranceDto) {}
