import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'access_prerequisite'
})
export class AccessPrerequisiteSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'access_id_fk',
    type: 'int'
  })
  accessId: number;

  @Column({
    name: 'required_access_id_fk',
    type: 'int'
  })
  requiredAccessId: number;
}