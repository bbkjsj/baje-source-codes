import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'survey' })
export class SurveySchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'workgroup_id_fk'
  })
  workgroupId: number;

  @Column({ name: 'participate_type' })
  participateType: string;

  @Column({ name: 'survey_call' })
  surveyCall: string;

  @Column({ name: 'suruvey_workgroup_call_id_fk' })
  surveyWorkgroupCallId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'survey_category_id_fk' })
  surveyCategoryId: number;

  @Column({ name: 'category_title' })
  categoryTitle: string;

  @Column({ name: 'problem_description' })
  problemDescription: string;

  @Column({ name: 'suggestion' })
  suggestion: string;

  @Column()
  requirement: string;

  @Column({ name: 'is_exist' })
  isExist: boolean;

  @Column({ name: 'participate_in_execution' })
  participateInExecution: boolean;

  @Column({ name: 'participate_exe_type' })
  participateExeType: string;

  @Column({ name: 'participate_exe_percent' })
  participateExePercent: number;

  @Column({ name: 'participate_exe_year' })
  participateExeYear: number;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 'survey_user_id_fk' })
  surveyId: number;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'idea_price' })
  ideaPrice: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'approve_level1' })
  approveLevel1: boolean;

  @Column({ name: 'approve_level2' })
  approveLevel2: boolean;

  @Column({ name: 'create_date' })
  createDate: Date;

  @Column({ name: 'last_update_date' })
  lastUpdateDate: Date;

  @Column({ name: 'is_postpond' })
  isPostpond: boolean;

  @Column({ name: 'end_of_postpone'})
  endOfPostpone: Date;

  @Column({ name: 'reward' })
  reward: string;
}