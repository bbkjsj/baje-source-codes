import { type } from 'os';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'family' })
export class FamilySchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'personnel_id_fk'
  })
  personnelId: number;

  @Column({
    type: 'int',
    name: 'father_id_fk'
  })
  fatherId: number;

  @Column({
    type: 'int',
    name: 'mother_id_fk'
  })
  motherId: number;

  @Column({
    type: 'int',
    name: 'spouse_id_fk'
  })
  spouseId: number;

  @Column()
  vid: string;

  @Column({ name: 'same_mother' })
  sameMother: boolean;

  @Column({ name: 'same_father' })
  sameFather: boolean;


  constructor(personnelId: number, fatherId?: number, motherId?: number, spouseId?: number, sameFather?: boolean, sameMother?: boolean) {
    this.personnelId = personnelId;
    this.fatherId = fatherId;
    this.motherId = motherId;
    this.spouseId = spouseId;
  }
}
