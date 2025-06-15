import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'vehicle_system' })
export class VehicleSystem {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true, length: 100 })
  title: string;

  @Column({ name: 'type_id_fk', nullable: true})
  typeId: number;

  @Column({
    name: 'logo',
    nullable: true,
  })
  logo: string;


  @Column({
    name: 'en_title',
    nullable: true
  })
  enTitle: string;
}
