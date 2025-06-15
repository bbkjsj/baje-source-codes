import { PartialType } from '@nestjs/mapped-types';
import { AddEnvironmentUsageDTO } from './environment-usage.dto';

export class UpdateEnvironmentUsageDTO extends
  PartialType(AddEnvironmentUsageDTO) {}
