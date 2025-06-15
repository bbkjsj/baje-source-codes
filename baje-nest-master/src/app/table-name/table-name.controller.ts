import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TableNameService } from './table-name.service';
import { CreateTableNameDto } from './dto/create-table-name.dto';
import { UpdateTableNameDto } from './dto/update-table-name.dto';
import { CreateColumnNameDTO } from './dto/create-column-name.dto';
import { UpdateColumnNameDTO } from './dto/update-column-name.dto';

@Controller('table-name')
export class TableNameController {
  constructor(private readonly tableNameService: TableNameService) {}

  @Post()
  create(@Body() createTableNameDto: CreateTableNameDto) {
    return this.tableNameService.create(createTableNameDto);
  }

  @Get('/db/:table/fields')
  columnsOfTable(@Param('table') table: string) { 
    return this.tableNameService.fieldsOfTable(table);
  }

  
  @Get('/db/tables')
  findDBTables() { 
    return this.tableNameService.getDatabaseTables();
  }

  
  @Get()
  findAll() {
    return this.tableNameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tableNameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTableNameDto: UpdateTableNameDto) {
    return this.tableNameService.update(+id, updateTableNameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tableNameService.remove(+id);
  }

  @Post('/column')
  createColumnName(@Body() body: CreateColumnNameDTO) { 
    return this.tableNameService.createColumnName(body);
  }

  @Patch('/column/:id')
  updateColumnName(@Param('id') id: string, @Body() body: UpdateColumnNameDTO) {
    return this.tableNameService.updateColumnName(+id, body);
  }

  @Delete('/column/:id')
  deleteColumnName(@Param('id') id: string){
    return this.tableNameService.deleteColumnName(+id);
  }

  @Get('/column/table/:id')
  getColumnsOfTableId(@Param('id') id: string) {
    return this.tableNameService.findColumnNameByTableId(+id);
  }

  @Get('/column/:id')
  getColumnDetail(@Param('id') id:string){
    return this.tableNameService.findColumnNameDetail(+id);
  }
}
