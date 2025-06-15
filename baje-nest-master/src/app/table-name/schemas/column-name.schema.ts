import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'column_name'})
export class ColumnName { 

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { nullable: true , name: 'table_name_id_fk'})
    tableId: number;

    @Column('varchar', { nullable: true, length: 255, name: 'column_name'})
    columnName: string;

    @Column('varchar', { nullable: true, length: 255})
    title: string;

    @Column('varchar', {nullable: true, length: 255})
    type: string;
}