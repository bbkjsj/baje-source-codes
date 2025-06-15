import { PartialType } from '@nestjs/mapped-types';
import { CreateEnvironmentDTO } from './create-environment.dto';

export class UpdateEnvironmentDTO extends PartialType(CreateEnvironmentDTO) {}