import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'survey_execution' })
export class SurveyExecutionSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'survey_id_fk' })
  surveyId: number;

  @Column({ name: 'personnel_id_fk' })
  personnelId: number;

  @Column({ name: 'date' })
  date: Date;

  @Column({ name: 'approve' })
  approve: boolean;

  @Column({ name: 'due_day' })
  dueDay: number;

  @Column({ name: 'timeline_file' })
  timeLineFile: string;

}