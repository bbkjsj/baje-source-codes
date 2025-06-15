import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'personnel_access'
})
export class AccessPersonnelSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'personnel_id_fk'
  })
  personnelId: number;

  @Column({
    name: 'access_id_fk'
  })
  accessId: number;

  @Column({
    name: 'assigned_by_id_fk'
  })
  assignedById: number;

  @Column({
    name: 'start_date'
  })
  startDate: Date;

  @Column({
    name: 'end_date'
  })
  endDate: Date;

  @Column({
    name: 'access_level'
  })
  accessLevel: string;

  @Column({
    name: 'company_id_fk'
  })
  companyId: number;

  @Column({
    name: 'environment_id_fk'
  })
  environmentId: number;
}
