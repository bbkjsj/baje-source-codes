import { PartialType } from '@nestjs/mapped-types';
import { FamilyCreateDTO } from './family-create.dto';

export class FamilyUpdateDTO extends PartialType(FamilyCreateDTO) {}