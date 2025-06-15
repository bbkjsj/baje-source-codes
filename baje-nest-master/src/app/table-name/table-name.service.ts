import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { execPath } from 'process';
import { Repository, QueryRunner, getConnection, DataSource } from "typeorm";
import { CreateColumnNameDTO } from './dto/create-column-name.dto';
import { CreateTableNameDto } from './dto/create-table-name.dto';
import { UpdateColumnNameDTO } from './dto/update-column-name.dto';
import { UpdateTableNameDto } from './dto/update-table-name.dto';
import { ColumnName } from './schemas/column-name.schema';
import { TableName } from './schemas/table-name.schema';
import * as ormconfig from "../../../ormconfig";

@Injectable()
export class TableNameService {
  private queryRunner:QueryRunner;
  private dbName:string = process.env.DB_DATABASE;

  constructor(@InjectRepository(TableName) private readonly repo: Repository<TableName>,
  @InjectRepository(ColumnName) private readonly columnRepo: Repository<ColumnName>
  ){
  }

  async create(createTableNameDto: CreateTableNameDto) {
    try{
      const dup = await this.repo.createQueryBuilder()
      .where('table_name = :tn',{ tn: createTableNameDto.table_name})
      .getCount();


      if(dup > 0) {
        throw new HttpException('table name already exists', 400);
      }

      return await this.repo.createQueryBuilder()
      .insert()
      .values([createTableNameDto])
      .execute();
    }
    catch(err){
      throw err;
    }
  }

  async findAll() {
    try{
      return await this.repo.createQueryBuilder()
      .getMany();
    }
    catch(err){
      throw err;
    }
  }

  async findOne(id: number) {
    try{
      return await this.repo.createQueryBuilder()
      .where('id = :id', {id: id})
      .getOne();

    }
    catch(err) {
      throw err;
    }
  }

  async update(id: number, updateTableNameDto: UpdateTableNameDto) {
    return await this.repo.createQueryBuilder()
    .update()
    .set(updateTableNameDto)
    .where('id = :id', { id: id})
    .execute();
  }

  async remove(id: number) {
    return await this.repo.createQueryBuilder()
    .delete()
    .where('id = :id', {id: id})
    .execute();
  }

  async getDatabaseTables() {
    try{
      const currentNames = await this.repo.find({ select: ['table_name']});
      let tableNames = '';
      currentNames.forEach(item => {
        tableNames += `'${item.table_name}',`
      });
      if(tableNames.length > 0) {
        tableNames = tableNames.substring(0, tableNames.length-1);
      }
      const tableExceptions = ['audit', 'tasks', 'tasks_log', 'migrations'];
      let exceptionNames = '';
      tableExceptions.forEach(item => {
        exceptionNames += `'${item}',`
      });
      exceptionNames = exceptionNames.substring(0, exceptionNames.length-1);

      let cmd = `show tables where Tables_in_${this.dbName} not in (${exceptionNames})`;
      if(tableNames) {
        cmd = `show tables where Tables_in_${this.dbName} not in(${tableNames}) and Tables_in_${this.dbName} not in (${exceptionNames})`;
      }

      const dataSource: DataSource = new DataSource(ormconfig);

      await dataSource.initialize();

      const list = await dataSource.manager.query(cmd);
      const response = list.map(item => {
        return item[`Tables_in_${this.dbName}`]
      })

      await dataSource.destroy();

      return response;
    }
    catch(err){
      throw err;
    }
  }

  async fieldsOfTable(tableName: string) {
    try{
      const table = await this.repo.createQueryBuilder()
      .where('table_name = :tn', { tn:tableName})
      .getOne();

      let phrase = '';

      if(table) {
        const columns = await this.columnRepo.createQueryBuilder()
        .where('table_name_id_fk = :tid', {tid : table.id})
        .getMany();

        columns.forEach(item => {
          phrase += `'${item.columnName}',`;
        });

        if(phrase.length > 0) {
          phrase = phrase.substring(0, phrase.length-1);
        }
      }

      const dataSource: DataSource = new DataSource(ormconfig);
      await dataSource.initialize();
      let  cmd = `show fields from ${tableName}`;
      if(phrase != '') {
        cmd = `show fields from ${tableName} where Field not in(${phrase})`;
      }
      const list =  await dataSource.manager.query(cmd);

      await dataSource.destroy();
      return list;
    }
    catch(err) {
      throw err;
    }
  }

  async createColumnName(dto: CreateColumnNameDTO) {
    try{
      const dup = await this.columnRepo.createQueryBuilder()
      .where('table_name_id_fk = :id and column_name = :cname', { id: dto.tableId, cname: dto.columnName})
      .getCount();
      if(dup > 0) {
        throw new HttpException('Column name already exists', 400);
      }

      return await this.columnRepo.createQueryBuilder()
      .insert()
      .values([dto])
      .execute();
    }
    catch(err) {
      throw err;
    }
  }

  async findColumnNameByTableId(id: number) {
    try{
      return await this.columnRepo.createQueryBuilder()
      .where('table_name_id_fk = :tid', { tid: id})
      .getMany();
    }
    catch(err) {
      throw err;
    }
  }

  async updateColumnName(id: number, dto:UpdateColumnNameDTO) {
    try{
      return await this.columnRepo.createQueryBuilder()
      .update()
      .set(dto)
      .where('id = :id', { id: id})
      .execute();
    }
    catch(err) {
      throw err;
    }
  }

  async deleteColumnName(id: number) {
    try{
      return await this.columnRepo.createQueryBuilder()
      .delete()
      .where('id = :id', { id: id})
      .execute();
    }
    catch(err) {
      throw err;
    }
  }

  async findColumnNameDetail(id: number) {
    try{
      return await this.columnRepo.createQueryBuilder()
      .where('id = :id', { id: id})
      .getOne();
    }
    catch(err) {
      throw err;
    }
  }


  async getTableIdByName(name: string) {
    try{
      return this.repo.createQueryBuilder()
      .where('table_name = :tn', {tn: name})
      .getOne();
    }
    catch(err) {
      throw err;
    }
  }
}
