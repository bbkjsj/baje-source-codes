import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'survey_workgroup_personnel' })
export class SurveyWorkgroupPersonnelSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'personnel_id_fk' })
  personnelId: number;

  @Column({ name: 'workgroup_id_fk' })
  workgroupId: number;

  @Column({ name: 'position' })
  position: string;

  @Column({ name: 'member_from' })
  memberFrom: Date;

  @Column({ name: 'member_to' })
  memberTo: Date;

  @Column()
  approved: boolean;

  @Column()
  fix: boolean;
}