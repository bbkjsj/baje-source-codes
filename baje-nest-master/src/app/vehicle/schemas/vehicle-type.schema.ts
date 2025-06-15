import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'vehicle_type'})
export class VehicleType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, length: 100})
    title: string;

    @Column('varchar',{nullable:true, length: 200})
    code: string;

    @Column('tinyint', { nullable: true})
    pelak: number;
}
