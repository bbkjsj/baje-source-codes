import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'vehicle_style'})
export class VehicleStyle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true, length: 100})
    title: string;

    @Column({
      nullable:true,
      name: 'system_id_fk'
    })
    systemId: number;

    @Column({
      nullable: true,
      name: 'type_id_fk'
    })
    typeId: number;
}
