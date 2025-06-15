import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'environment' })
export class EnvironmentSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    name: 'company_id_fk',
    type: 'bigint'
  })
  companyId: number;

  @Column({
    name: 'parent_id_fk',
    type: 'bigint'
  })
  parentId: number;

  @Column({})
  type: string;

  @Column()
  code: string;

  @Column({
    type: 'bigint',
    name: 'environment_usage_id'
  })
  usage: number;

  @Column({
    type: 'decimal'
  })
  latitude: number;

  @Column({
    type: 'decimal'
  })
  longitude: number;

  @Column()
  address: string;

  @Column({
    name: 'post_code'
  })
  postCode: string;

  @Column({
    name: 'occupied_status'
  })
  occupiedStatus: string;

  @Column()
  status: string;

  @Column({
    type: 'tinyint',
    name: 'independent_chart'
  })
  independentChart: boolean;

  @Column({
    type: 'tinyint',
    name: 'independent_vehicle'
  })
  independentVehicle: boolean;
}