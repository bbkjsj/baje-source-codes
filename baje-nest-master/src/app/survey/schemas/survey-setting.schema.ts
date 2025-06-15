import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'survey_setting' })
export class SurveySettingSchema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'manager_id_fk' })
  managerId: number;

  @Column({ name: 'max_day_first_assessment' })
  maxDayFirstAssessment: number;

  @Column({ name: 'max_day_expert_workgroup' })
  maxDayExpertWorkgroup: number;

  @Column({ name: 'max_day_excellent_workgroup' })
  maxDayExcellentWorkgroup: number;

  @Column({ name: 'max_day_edit' })
  maxDayEdit: number;

  @Column({ name: 'max_day_review_request' })
  maxDayReviewRequest: number;

  @Column({ name: 'max_day_planning_execution' })
  maxDayPlanningExecution: number;

  @Column({ name: 'max_day_execution_review' })
  maxDayExecutionReview: number;

  @Column({ name: 'rial_rate_per_year' })
  rialRatePerYear: number;

  @Column({ name: 'min_reward_rial' })
  minRewardRial: number;

  @Column({ name: 'max_percent_participate' })
  maxPercentParticipate: number;

  @Column({ name: 'min_pass_point' })
  minPassPoint: number;

  @Column({ name: 'background_image' })
  backgroundImage: string;
}