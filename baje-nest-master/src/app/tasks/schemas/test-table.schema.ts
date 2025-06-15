import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'test_table'})
export class TestTable{  

    @PrimaryGeneratedColumn()
    id:number;

    @Column('varchar', {nullable: true, length: 255})
    first_name: string;
}