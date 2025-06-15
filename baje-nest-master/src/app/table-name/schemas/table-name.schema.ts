import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'table_name'})
export class TableName {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, length: 200})
    table_name: string;

    @Column('varchar', {nullable: true, length: 300})
    title: string;
}
