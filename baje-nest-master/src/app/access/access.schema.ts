
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'access' })
export class AccessSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    name: 'minimum_required_access_level'
  })
  minimumRequiredAccessLevel: string;

  @Column()
  enable: boolean;

  @Column()
  code: string;

}