import { PartialType } from '@nestjs/mapped-types';
import { CreateTableNameDto } from './create-table-name.dto';

export class UpdateTableNameDto extends PartialType(CreateTableNameDto) {}
