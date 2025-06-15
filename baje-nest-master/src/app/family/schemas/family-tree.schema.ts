import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'family_tree'})
export class FamilyTreeSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'personnel_id_fk'
  })
  personnelId: number;

  @Column({
    name: 'parent_id_fk'
  })
  parentId: number;
}