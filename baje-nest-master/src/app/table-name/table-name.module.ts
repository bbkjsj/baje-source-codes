import { Module } from '@nestjs/common';
import { TableNameService } from './table-name.service';
import { TableNameController } from './table-name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableName } from './schemas/table-name.schema';
import { ColumnName } from './schemas/column-name.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TableName,
      ColumnName
    ])
  ],
  controllers: [TableNameController],
  providers: [TableNameService],
  exports: [TableNameService]
})
export class TableNameModule {}
